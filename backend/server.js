const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(cors()); // Enable CORS for your backend server
app.use(express.json()); // Middleware to parse JSON

// Define your backend route to handle Cashfree API requests
app.post('/api/payment', async (req, res) => {
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
        'x-client-id': 'your-client-id-here',
        'x-client-secret': 'your-client-secret-here',
      }
    });

    res.json(response.data); // Send Cashfree API response back to the frontend
  } catch (error) {
    console.error('Cashfree Error:', error.response ? error.response.data : error.message);
    res.status(500).json({ message: 'Error communicating with Cashfree API', error });
  }
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Backend proxy server running on port ${PORT}`);
});
