const express = require('express');
const router = express.Router();
const axios = require('axios');
const fetchuser = require('../midleware/fetchuser');
const FoodItem = require('../model/FoodItem');

//const foodCategory=require('../model/FoodCategory')
const { body, validationResult } = require('express-validator');
const FoodCategory = require('../model/FoodCategory');
const Order = require('../model/Order');

// ROUTE 1: Get All the Notes using: GET "/api/notes/getuser". Login required
router.get('/fetchallfooditem', async (req, res) => {
    try {
        const foods = await FoodItem.find();
        const itemsWithImages = foods.map(item => ({
            ...item._doc,
            img: item.img && item.img.data
              ? `data:${item.img.contentType};base64,${item.img.data.toString('base64')}`
              : null
          }));
        res.json(itemsWithImages)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

// ROUTE 2: Add a new Note using: POST "/api/notes/addnote". Login required
router.post('/FoodItem', async (req, res) => {
        try {
            //destructring concept
            const { CategoryName, name, img,options,description } = req.body;

            // If there are errors, return Bad request and the errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const note = new FoodItem({
                CategoryName, name, img,options,description, user: req.user.id
            })
            const savedFood = await note.save()

            res.json(savedFood)

        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
        }
    })

    // ROUTE 3: Add a catogory using: POST "/api/food/addcategory". Login required
router.post('/addcategory', async (req, res) => {
    try {
        //destructring concept
        const { CategoryName } = req.body;

        // If there are errors, return Bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const foodcat = new FoodCategory({
            CategoryName
        })
        const savedFood = await foodcat.save()

        res.json(savedFood)

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

// ROUTE 4: Get All the food catogory using: GET "/api/food/fetchallfooditemcat". Login required
router.get('/fetchallfooditemcat', async (req, res) => {
    try {
        const foodcat = await FoodCategory.find();
        res.json(foodcat)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

router.post('/orderData', async (req, res) => {
    let data = req.body.order_data;
    await data.splice(0, 0, { Order_date: req.body.order_date });

    const { email, payment_status,payment_message,customer_details } = req.body; // Destructure email and customer_details from request body
    console.log(payment_status)

    // Check if email already exists in the database
    let existingOrder = await Order.findOne({ 'email': email });

    if (existingOrder === null) {
        // If the email does not exist, create a new order
        try {
            await Order.create({
                email: email,
                status: payment_status,
                message:payment_message,
                order_data: [data],
                customer_details: {
                    name: customer_details.customer_name,
                    phone: customer_details.customer_phone,
                    address: customer_details.customer_address,
                },
            }).then(() => {
                res.json({ success: true });
            });
        } catch (error) {
            console.log(error.message);
            res.status(500).send("Server Error: " + error.message);
        }
    } else {
        // If the email exists, update the existing order
        try {
            await Order.findOneAndUpdate(
                { email: email },
                { status: payment_status},
                {message:payment_message},
                {
                    $push: { order_data: data },
                    $set: {
                        'customer_details.name': customer_details.name,
                        'customer_details.phone': customer_details.phone,
                        'customer_details.address': customer_details.address,
                    },
                }
            ).then(() => {
                res.json({ success: true });
            });
        } catch (error) {
            console.log(error.message);
            res.status(500).send("Server Error: " + error.message);
        }
    }
});

router.post('/myOrderData', async (req, res) => {
    try {
        console.log(req.body.email)
        let eId = await Order.findOne({ 'email': req.body.email })
        //console.log(eId)
        res.json({orderData:eId})
    } catch (error) {
        res.send("Error",error.message)
    }
    

});
// const cors = require('cors');
// const axios = require('axios');
// const app = express();

// app.use(cors()); // Enable CORS for your backend server
// app.use(express.json()); // Middleware to parse JSON

// Define your backend route to handle Cashfree API requests
router.post('/api/payment', async (req, res) => {
  const { totalPrice, customerDetails } = req.body;
  try {
    const response = await axios.post('https://sandbox.cashfree.com/pg/orders', {
      order_id: `order_${Date.now()}`,
      order_amount: totalPrice,
      order_currency: 'INR',
      customer_details: customerDetails,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': 'TEST1033061394a9be7881d63f67cf2f31603301',
        'x-client-sct': 'cfsk_ma_test_fc2c673f8f83cb607ef02b59776a4ba5_62028b38',
        'x-api-version' :'2023-08-01',
      }
    });
    const { order_id, order_amount, payment_session_id,order_status,customer_details } = response.data;

        res.json({
            order_id,
            order_amount,
            customer_details,
            payment_session_id,
            order_status,
        });
    //res.json(response.data); // Send Cashfree API response back to the frontend
  } catch (error) {
    console.error('Cashfree Error:', error.response ? error.response.data : error.message);
    res.status(500).json({ message: 'Error communicating with Cashfree API', error });
  }
});

// const PORT = 8000;
// app.listen(PORT, () => {
//   console.log(`Backend proxy server running on port ${PORT}`);
// });


module.exports=router;