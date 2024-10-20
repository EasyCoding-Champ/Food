import React, { useContext, useEffect, useState } from 'react';
import foodContext from '../context/food/foodContext';
import { Delete } from '@mui/icons-material';
import axios from 'axios';
import { load } from '@cashfreepayments/cashfree-js';
import MyOrder from './MyOrder';

export default function Cart() {
  const context = useContext(foodContext);
  const { state, dispatch } = context;
  const [errors, setErrors] = useState({});
  let data = state;
  const [cashfree, setcashfree] = useState({})
  const[checkoutResponse,setcheckoutResponse]=useState({})

  // State for shipping address details
  const [shippingAddress, setShippingAddress] = useState({
    name: '',
    phone: '',
    address: '',
  });

  const initializeSDK = async () => {
    try {
      let cashfreeinit = await load({ mode: "sandbox" });
      await setcashfree(cashfreeinit)
      console.log("Cashfree SDK initialized");
    } catch (error) {
      console.error("Error loading Cashfree SDK:", error);
    }
  };

  useEffect(() => {
    initializeSDK(); // Call this when the component mounts
  }, []);
    // Return true if there are no errors
  //   return Object.keys(newErrors).length === 0;
  // }

  if (data.length === 0) {
    return (
      <div>
        <div className='m-5 w-100 text-center fs-3'>The Cart is Empty!</div>
      </div>
    );
  }
  let totalPrice = data.reduce((total, food) => total + food.price, 0);
  let userEmail = localStorage.getItem("userEmail");
    let customer_id = localStorage.getItem('customer_id');
  const ordercustomerDetails = {
    customer_id: customer_id,
    customer_email: userEmail,
    customer_phone: shippingAddress.phone,
    customer_name: shippingAddress.name,
    customer_address: shippingAddress.address,
  };
  const validateField = (name, value) => {
    let error = '';

    if (name === 'name') {
      if (!value.trim()) {
        error = 'Name is required.';
      }
    }

    if (name === 'phone') {
      const phoneRegex = /^[0-9]{10}$/;
      if (!value) {
        error = 'Phone is required.';
      } else if (!phoneRegex.test(value)) {
        error = 'Phone number must be 10 digits.';
      }
    }

    if (name === 'address') {
      if (!value.trim()) {
        error = 'Address is required.';
      }
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  // Handle onBlur validation
  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };
  const handleCheckOut = async (e) => {
    const allValid = Object.keys(shippingAddress).every((key) => !errors[key]);
    console.log(allValid)
    console.log(shippingAddress.phone)
    if (allValid) {
    e.preventDefault();
    const customerDetails = {
      customer_id: customer_id,
      customer_email: userEmail,
      customer_phone: shippingAddress.phone,
      customer_name: shippingAddress.name,
    };
    console.log("sdfsdfd:"+shippingAddress.phone)
    try {
      const response = await axios.post('http://localhost:5000/api/food/api/payment', {
        totalPrice,
        customerDetails,
      });

      const { order_id, order_amount, payment_session_id ,order_status} = response.data;

      // Initialize Cashfree Payment
      const options = {
        orderId: order_id,
        orderAmount: order_amount,
        customerEmail: customerDetails.customer_email,
        customerPhone: customerDetails.customer_phone,
        status:order_status,
        paymentSessionId: payment_session_id,
        redirectTarget: '_modal',
      };
      // Initiate the payment process
      if (cashfree) {
        let paymentResponse = await cashfree.checkout(options);
        console.log("Payment response:", paymentResponse);
        console.log("lofd: "+paymentResponse)
        await setcheckoutResponse(paymentResponse)
      } else {
        console.error("Cashfree SDK is not initialized");
      }
console.log("paymet message :"+checkoutResponse.paymentDetails.paymentMessage)
      if (order_status==='ACTIVE') {
        let payment_status="Paid"
        let orderresponse = await fetch("http://localhost:5000/api/food/orderData", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            order_data: data,
            email: userEmail,
            order_date: new Date().toDateString(),
            payment_message:checkoutResponse.paymentDetails.paymentMessage,
            payment_status:payment_status,
            customer_details: ordercustomerDetails, // Send shipping address with order data
          })
        });

        console.log("JSON RESPONSE:::::", orderresponse.status);
        if (orderresponse.status === 200) {
          dispatch({ type: "DROP" });
           <MyOrder/>
        }
     }
    } catch (error) {
      console.error('Error initiating payment:', error);
    }
  }else{
    console.log('Form validation failed');
  }
  };

  // Function to get current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        // You might want to reverse geocode the coordinates to get an address
        setShippingAddress({
          ...shippingAddress,
          address: `Latitude: ${latitude}, Longitude: ${longitude}`, // Placeholder for address
        });
      }, (error) => {
        console.error("Error getting location:", error);
      });
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div>
      {console.log(data)}
      <div className='container m-auto mt-5'>
        {/* Scrollable Area with Bootstrap */}
        <div className="overflow-auto" style={{ maxHeight: '400px' }}>
        <table className='table table-hover'>
          <thead className='text-success fs-4'>
            <tr>
              <th scope='col'>#</th>
              <th scope='col'>Name</th>
              <th scope='col'>Quantity</th>
              <th scope='col'>Option</th>
              <th scope='col'>Amount</th>
              <th scope='col'></th>
            </tr>
          </thead>
          <tbody>
            {data.map((food, index) => (
              <tr key={index}>
                <th scope='row'>{index + 1}</th>
                <td>{food.name}</td>
                <td>{food.qty}</td>
                <td>{food.size}</td>
                <td>{food.price}</td>
                <td>
                  <button type="button" className="btn p-0" onClick={() => { dispatch({ type: "REMOVE", index: index }) }}>
                    <Delete />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div><h1 className='fs-2'>Total Price: {totalPrice}/-</h1></div>

        {/* Shipping Address Form */}
        <div>
      {/* Shipping Address Form */}
      <div className="mt-4">
        <h3>Shipping Address</h3>

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={shippingAddress.name}
          onChange={(e) => setShippingAddress({ ...shippingAddress, name: e.target.value })}
          onBlur={handleBlur}
          className={`form-control mb-2 ${errors.name ? 'is-invalid' : ''}`}
        />
        {errors.name && <div className="invalid-feedback">{errors.name}</div>}

        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={shippingAddress.phone}
          onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
          onBlur={handleBlur}
          className={`form-control mb-2 ${errors.phone ? 'is-invalid' : ''}`}
        />
        {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}

        <input
          type="text"
          name="address"
          placeholder="Address"
          value={shippingAddress.address}
          onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
          onBlur={handleBlur}
          className={`form-control mb-2 ${errors.address ? 'is-invalid' : ''}`}
        />
        {errors.address && <div className="invalid-feedback">{errors.address}</div>}

        <button className="btn btn-primary mb-3" onClick={getCurrentLocation}>
          Use Current Location
        </button>
      </div>
      </div>

        <div>
          <button className='btn bg-success mt-5' onClick={handleCheckOut}>Check Out</button>
        </div>
      </div>
      </div>
    </div>
  );
}