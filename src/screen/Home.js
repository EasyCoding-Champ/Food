import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Card from '../components/Card'

import foodContext from '../context/food/foodContext'
import { useNavigate } from 'react-router-dom'
// import { useNavigate } from 'react-router-dom'


const Home=(props) =>{
    const context=useContext(foodContext);
    const { foods, getFoods,getFoodscat,foodscat} = context;
    let navigate = useNavigate();
    const [search,setSearch]=useState('')
    //setFoodItem(foods.)
    useEffect(() => {
        if (localStorage.getItem('token')) {
            getFoods()
            getFoodscat()
        } else {
            navigate("/login");
        }

        // eslint-disable-next-line
    }, [])
    return (
        <div >
            <div><Navbar />
            <div id="carouselExampleFade" className="carousel slide carousel-fade" data-bs-ride="carousel" style={{objectFit:"contain i!mportant"}}>
                <div className="carousel-inner" id ='carosel'>
                    <div className="carousel-caption" style={{zIndex:"10"}}>
                        <div className="d-flex justify-content-center">
                            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" value={search} onChange={(e)=>{setSearch(e.target.value)}}/>
                            {/* <button className="btn btn-outline-success" type="submit">Search</button> */}
                        </div>
                    </div>
                    <div className="carousel-item active">
                        <img src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1899&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" className="photo" alt="..." />
                    </div>
                    <div className="carousel-item">
                        <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1981&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" className="photo" alt="..." />
                    </div>
                    <div className="carousel-item">
                        <img src="https://plus.unsplash.com/premium_photo-1661419883163-bb4df1c10109?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2hpY2tlbiUyMGxlZ3N8ZW58MHx8MHx8fDA%3D" className="photo" alt="..." />
                    </div>
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>
            <div className='m-3'>
                <div className="container mx-2">
                    {foods.length === 0 && 'No notes to display'}
                </div>
                {foodscat.map((foodcard) => {
                    return(<div className='row mb-3'><div key={foodcard._id} className='="fs-3 m-3'>
                    {foodcard.CategoryName}
                    </div>
                    <hr id="hr-success" style={{ height: "4px", backgroundImage: "-webkit-linear-gradient(left,rgb(0, 255, 137),rgb(0, 0, 0))" }}/>
                    
                    {
                    foods.filter((item)=>(item.CategoryName===foodcard.CategoryName) && (item.name.toLowerCase().includes(search.toLowerCase())))
                    .map(filterItems=>{
                        return (<div key={filterItems._id} className='col-12 col-md-6 col-lg-3'>
                        <Card foodName={filterItems.name} item={filterItems} options={filterItems.options[0]} ImgSrc={filterItems.img}></Card>
                        </div>
                        )
                    })}
                    </div>
               ) })}
            </div>
                <Footer />
            </div>
        </div>
    )
}
export default Home
