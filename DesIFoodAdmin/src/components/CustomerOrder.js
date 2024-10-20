import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function CustomerOrder() {
    const [orderData, setOrderData] = useState([]);
    const [dailyTotals, setDailyTotals] = useState({});
    const [grandTotal, setGrandTotal] = useState(0);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [filterStartDate, setFilterStartDate] = useState('');
    const [filterEndDate, setFilterEndDate] = useState('');
    const [isFiltered, setIsFiltered] = useState(false); 
    const [distances, setDistances] = useState({});
    let [address, setAddress] = useState("");
    let navigate = useNavigate()

    const fetchMyOrder = async () => {
        const response = await fetch("http://localhost:5000/api/food/myOrderData", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const result = await response.json();
        setOrderData(result.orderData); // Initialize with all orders
        calculateTotals(result.orderData); // Calculate totals for all orders initially
        await calculateDistances(result.orderData)
    };

    const calculateTotals = (orders) => {
        let dailyTotalMap = {};
        let grandTotal = 0;

        orders.forEach(order => {
            order.order_data.forEach(itemList => {
                const orderDate = itemList[0].Order_date;

                if (orderDate) {
                    let dayTotal = 0;
                    // Sum the price of all items for this day
                    itemList.forEach(item => {
                        if (item.price) {
                            dayTotal += item.price * item.qty; // Assuming qty is provided
                        }
                    });

                    // Add to the day's total
                    if (dailyTotalMap[orderDate]) {
                        dailyTotalMap[orderDate] += dayTotal;
                    } else {
                        dailyTotalMap[orderDate] = dayTotal;
                    }

                    // Add to the grand total
                    grandTotal += dayTotal;
                }
            });
        });

        // Update state with the calculated totals
        setDailyTotals(dailyTotalMap);
        setGrandTotal(grandTotal);
        setFilteredOrders(orders); // Initialize filtered orders
    };
    const currentdistance = async () => {
      let navLocation = () => {
        return new Promise((res, rej) => {
          navigator.geolocation.getCurrentPosition(res, rej);
        });
      }
      let latlong = await navLocation().then(res => {
        let latitude = res.coords.latitude;
        let longitude = res.coords.longitude;
        return [latitude, longitude]
      })
      // console.log(latlong)
      let [lat, long] = latlong
      console.log(lat, long)
      const response = await fetch("http://localhost:5000/api/food/getlocation", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ latlong: { lat, long } })
  
      });
      const { location } = await response.json()
      setAddress(location);
    }


 const calculateDistances = async (orders) => {
        const newDistances = {};
        await currentdistance()
        const destination = address; // Replace with actual destination
// Helper function to get lat/long using OpenCage
const getLatLong = async (address) => {
    try {
        const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json`, {
            params: {
                q: address,
                key: '74c89b3be64946ac96d777d08b878d43'
            }
        });
        
        const { lat, lng } = response.data.results[0].geometry;
        return { lat, lng };
    } catch (error) {
        console.error("Error fetching lat/long:", error);
        return null;
    }
};
// Convert destination address to lat/long
const destinationLatLng = await getLatLong(destination);
        for (const order of orders) {
            const { customer_details } = order;
            //const origin=customer_details.address
            const origin = "Ahad Excellencia Chikkanayakanahalli 560035"; // Assuming address is a string
            console.log("chamandsdfsd:"+origin)

            try {
                // const response = await axios.get('http://localhost:5000/api/food/getDistance', {
                //    params: {
                //     origins: origin,
                //     destinations: destination
                // }  
                // });

                // const distance = response.data.rows[0].elements[0].distance.text; // Get distance text
                // newDistances[order.id] = distance; // Store distance by order ID
                // Convert origin address to lat/long

        const originLatLng = await getLatLong(origin);
        if (originLatLng && destinationLatLng) {
            // Calculate the distance using the Haversine formula
            const distance = haversineDistance(originLatLng, destinationLatLng);
            newDistances[order.id] = `${distance.toFixed(2)} km`;
        } else {
            newDistances[order.id] = "Distance not available";
        }
            } catch (error) {
                console.error("Error fetching distance:", error);
                newDistances[order.id] = "Distance not available"; // Fallback in case of error
            }
        }

        setDistances(newDistances); // Update distances in state
    };

    // Haversine formula to calculate distance between two lat/long points
const haversineDistance = (coords1, coords2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Radius of the Earth in km
    const dLat = toRad(coords2.lat - coords1.lat);
    const dLon = toRad(coords2.lng - coords1.lng);
    const lat1 = toRad(coords1.lat);
    const lat2 = toRad(coords2.lat);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
};
    const handleFilter = () => {
        const startDate = new Date(filterStartDate);
        const endDate = new Date(filterEndDate);
        endDate.setHours(23, 59, 59, 999); // Include the entire end date

        const filtered = orderData.filter(order => {
            return order.order_data.some(itemList => {
                const orderDate = new Date(itemList[0].Order_date);
                return orderDate >= startDate && orderDate <= endDate;
            });
        });

        calculateTotals(filtered); // Recalculate totals based on filtered data
        setFilteredOrders(filtered);
        setIsFiltered(true); // Mark that filtering is applied
    };

    const handleReset = () => {
        setFilterStartDate('');
        setFilterEndDate('');
        setIsFiltered(false); // Reset filtering status
        calculateTotals(orderData); // Reset totals to include all orders
        setFilteredOrders(orderData); // Reset filtered orders to include all orders
    };

    useEffect(() => {
        fetchMyOrder();
    }, []);

    // Sort the orders by date in ascending order
    const sortOrdersByDate = (orders) => {
        return orders.sort((a, b) => {
            const dateA = new Date(a.order_data[0][0].Order_date);
            const dateB = new Date(b.order_data[0][0].Order_date);
            return dateA - dateB; // Sort in ascending order (earliest date first)
        });
    };

    // Sort all orders by date first
    const sortedOrderData = sortOrdersByDate(orderData);
    const displayedOrders = isFiltered ? sortOrdersByDate(filteredOrders) : sortedOrderData;
    console.log(displayedOrders)
    return (
        <div>
            <div className='container'>
                <div className='row'>
                    {/* Filter Inputs */}
                    <div className="col-12 mb-3">
                        <h2 className="text-center">Grand Total: ₹{grandTotal}/-</h2>
                        <div className="d-flex justify-content-center mb-3">
                            <input
                                type="date"
                                placeholder="From Date"
                                value={filterStartDate}
                                onChange={(e) => setFilterStartDate(e.target.value)}
                                className="form-control me-2"
                            />
                            <input
                                type="date"
                                placeholder="To Date"
                                value={filterEndDate}
                                onChange={(e) => setFilterEndDate(e.target.value)}
                                className="form-control me-2"
                            />
                            <button className="btn btn-primary" onClick={handleFilter}>Filter</button>
                            <button className="btn btn-secondary ms-2" onClick={handleReset}>Reset</button>
                        </div>
                    </div>

                    {/* Display daily totals if filtered */}
                    {isFiltered && (
                        <div className="col-12 mb-3 text-center">
                            {Object.keys(dailyTotals).map(date => (
                                <h5 key={date}>Total for {date}: ₹{dailyTotals[date]}/-</h5>
                            ))}
                            <hr />
                        </div>
                    )}

                    {/* Display the orders */}
                    {displayedOrders.length > 0 && displayedOrders.map((data, index) => (
                        <div key={index} className="order-section">
                            {data.order_data.map((order, i) => (
                                <div key={i}>
                                    {order.map((item, j) => (
                                        <div key={j}>
                                            {/* Check if the item has Order_date */}
                                            {item.Order_date ? (
                                                <div className='m-auto mt-5'>
                                                    <h5>Order Date: {item.Order_date}</h5>
                                                    <hr />
                                                </div>
                                            ) : (
                                                <div className='row'>
                                                    <div className='col-12 col-md-6 col-lg-3 d-flex align-items-start'>
                                                        <div className="card mt-3" style={{ width: "16rem", maxHeight: "360px" }}>
                                                            <img src={item.img} className="card-img-top" alt="..." style={{ height: "120px", objectFit: "fill" }} />
                                                            <div className="card-body">
                                                                <h5 className="card-title">{item.name}</h5>
                                                                <div className='container w-100 p-0' style={{ height: "38px" }}>
                                                                    <span className='m-1'>Quantity: {item.qty}</span>
                                                                    <span className='m-1'>Size: {item.size}</span>
                                                                    <div className='d-inline ms-2 h-100 w-20 fs-5'>
                                                                        ₹{item.price}/-
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className='col-12 col-md-6 col-lg-9'>
                                                    {/* Display customer details */}
                                                        <h3>Delivery Details</h3>
                                                        <p><strong>Email:</strong> {data.email}</p>
                                                        <p><strong>Name:</strong> {data.customer_details.name}</p>
                                                        <p><strong>Phone:</strong> {data.customer_details.phone}</p>
                                                        <p><strong>Address:</strong> {data.customer_details.address}</p>
                                                       <p><strong>Distance:</strong> {distances[data.id] || 'Calculating...'}</p> {/* Display distance */}
                                                    </div>
                                                </div>

                                            )}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    ))}

                    {/* If no orders are found */}
                    {displayedOrders.length === 0 && <div className="col-12 text-center"><h5>No orders found.</h5></div>}
                </div>
            </div>

            <Footer />
        </div>
    );
}
