import React, { useContext, useEffect, useRef, useState } from 'react'
import foodContext from '../context/food/foodContext'
import { useNavigate } from 'react-router-dom';

const Noteitem = (props) => {
    const { deleteItems } = useContext(foodContext)
    const priceRef = useRef();
    let navigate = useNavigate();
    let opt = props.options;
    const { item, updateNote } = props;
    let priceoption = Object.keys(opt)
    const [qty, setQty] = useState(1)
    const [size, setSize] = useState()
    const handleClick = () => {
        if (!localStorage.getItem("token")) {
            navigate("/login")
        }
    }
    const handleQty = (e) => {
        setQty(e.target.value);
    }
    const handleOptions = (e) => {
        setSize(e.target.value);
    }
    // const handleAddToCart = async () => {
    //     let food = []
    //     for (const item of data) {
    //         if (item.id === foodItem._id) {
    //             food = item;

    //             break;
    //         }
    //     }
    //     console.log(food)
    //     console.log(new Date())
    //     if (food !== []) {
    //         if (food.size === size) {
    //             await dispatch({ type: "UPDATE", id: foodItem._id, price: finalPrice, qty: qty })
    //             return
    //         }
    //         else if (food.size !== size) {
    //             await dispatch({ type: "ADD", id: foodItem._id, name: foodItem.name, price: finalPrice, qty: qty, size: size, img: props.ImgSrc })
    //             console.log("Size different so simply ADD one more to the list")
    //             return
    //         }
    //         return
    //     }

    //     await dispatch({ type: "ADD", id: foodItem._id, name: foodItem.name, price: finalPrice, qty: qty, size: size })


    //     // setBtnEnable(true)

    // }
    let finalPrice = qty * parseInt(opt[size]);
    useEffect(() => {
        setSize(priceRef.current.value)
    }, [])
    return (
        <div className="card mt-3" style={{ "width": "18rem", "maxHeight": "360px" }}>
            <img src={props.ImgSrc} className='card-img-top' alt='...' style={{ height: "200px", objectFit: "fill" }} />
            <div className="card-body">
                <h5 className="card-title">{props.foodName}</h5>
                <div className='container w-100'>
                    <select className='m-2 h-100 bg-success rounded' style={{ select: "#FF0000" }} onClick={handleClick} onChange={handleQty}>
                        {Array.from(Array(6), (e, i) => {
                            return (
                                <option key={i + 1} value={i + 1}>{i + 1}</option>
                            )

                        })}
                    </select>
                    <select className='m-2 h-100 bg-success rounded' style={{ select: "#FF0000" }} ref={priceRef} onClick={handleClick} onChange={handleOptions}>
                        {priceoption.map((data) => {
                            return <option key={data} value={data}>{data}</option>
                        })}
                    </select>
                    <div className='d-inline h-100 f5-5'>
                        ₹{finalPrice}/-
                    </div>
                    <hr>
                    </hr>
                    {/* <i className="far fa-edit mx-2" onClick={() => { updateNote(note) }}>Add To Cart</i> */}
                    <i className="far fa-trash-alt mx-2" onClick={() => { deleteItems(item._id);}}></i>
                    <i className="far fa-edit mx-2" onClick={() => { updateNote(item) }}></i>
                </div>
            </div>
        </div>
    )
}
export default Noteitem
