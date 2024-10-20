const express = require('express');
const multer = require('multer');
const router = express.Router();
const fetchuser = require('../midleware/fetchuser');
const FoodItem = require('../model/FoodItem');
//const foodCategory=require('../model/FoodCategory')
const { body, validationResult } = require('express-validator');
const FoodCategory = require('../model/FoodCategory');
const Order = require('../model/Order');
const { default: axios, Axios } = require('axios');
// Set up multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({limits: { fileSize: 50 * 1024 * 1024 }, storage: storage });


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
router.post('/FoodItem', upload.single('img'),async (req, res) => {
    try {
        //destructring concept
        //const { CategoryName, name,options,description } = req.body;
        const newItem = new FoodItem({
            CategoryName: req.body.CategoryName,
            name: req.body.name,
            img: {
              data: req.file ? req.file.buffer : null,
              contentType: req.file ? req.file.mimetype : null
            },
            options: JSON.parse(req.body.options),  // Parsing stringified options array
            description: req.body.description,
            date: req.body.date ? new Date(req.body.date) : Date.now()
          });

        // If there are errors, return Bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // const note = new FoodItem({
        //     CategoryName, name, img,options,description
        // })
        const savedFood = await newItem.save()
        console.log(savedFood)

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

// ROUTE 4: Delete an existing Food using: PUT "/api/notes/deletenote". Login required
router.delete('/deleteItems/:id', async (req, res) => {
    const { CategoryName, name, img,options,description } = req.body;
    try {
        // Find the note to be updated and update it
        let food = await FoodItem.findById(req.params.id);
        if (!food) { return res.status(404).send("Not Found") }
        food = await FoodItem.findByIdAndDelete(req.params.id)
        res.json({"Success": "Note has been deleted", food: food });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})


// ROUTE 5: Update an existing FOOD using: PUT "/api/food/updatefood". Login required
router.put('/updatenote/:id', upload.single('img'),async (req, res) => {
    const { CategoryName, name, img,options,description } = req.body;
    const oldItem = new FoodItem({
        CategoryName: req.body.CategoryName,
        name: req.body.name,
        img: {
          data: req.file ? req.file.buffer : null,
          contentType: req.file ? req.file.mimetype : null
        },
        options: JSON.parse(req.body.options),  // Parsing stringified options array
        description: req.body.description,
        date: req.body.date ? new Date(req.body.date) : Date.now()
      });
    try {
        // Create a newNote object
        const newFoodItem = {};
        if (CategoryName) { newFoodItem.CategoryName = oldItem.CategoryName };
        if (name) { newFoodItem.name = oldItem.name };
        if (img) { newFoodItem.img = oldItem.img };
        if (options) { newFoodItem.options = oldItem.options };
        if (description) { newFoodItem.description = oldItem.description };
    
        // Find the note to be updated and update it
        let food = await FoodItem.findById(req.params.id);
        if (!food) { return res.status(404).send("Not Found") }

        // if (food.user.toString() !== req.user.id) {
        //     return res.status(401).send("Not Allowed");
        // }
        //new: true=new note hai to to update ho jayega
        food = await FoodItem.findByIdAndUpdate(req.params.id, { $set: newFoodItem }, { new: true })
        res.json({ food });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

router.post('/myOrderData', async (req, res) => {
    try {
        const orderitem = await Order.find();
        res.json({orderData:orderitem})
    } catch (error) {
        res.send("Error",error.message)
    }
    

});

router.get('/getDistance', async (req, res) => {
    try {
        const { origins, destinations } = req.query;
        //const response = await axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json`, {
        const response = await axios.get(`https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/distancematrix/json`, {
          params: {
                origins,
                destinations,
                key: 'AIzaSyDRs-Ibg9zR5gzpdrNEqf_FpHh0VkdDKB8'
            }
        });

        res.json(response.data);
        console.log(response.data) // Send the API response back to the client
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/getlocation', async (req, res) => {
    try {
        let lat = req.body.latlong.lat
        let long = req.body.latlong.long
        console.log(lat, long)
        let location = await axios
            .get("https://api.opencagedata.com/geocode/v1/json?q=" + lat + "+" + long + "&key=74c89b3be64946ac96d777d08b878d43")
            .then(async res => {
                // console.log(`statusCode: ${res.status}`)
                console.log(res.data.results)
                // let response = stringify(res)
                // response = await JSON.parse(response)
                let response = res.data.results[0].components;
                console.log("chaman:"+response)
                let { village, county, state_district, state, postcode } = response
                return String(village + "," + county + "," + state_district + "," + state + "\n" + postcode)
            })
            .catch(error => {
                console.error(error)
            })
        res.send({ location })

    } catch (error) {
        console.error(error.message)
        res.send("Server Error")

    }
})

module.exports=router;