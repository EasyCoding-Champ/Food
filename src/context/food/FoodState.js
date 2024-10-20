import React from 'react';
import { useReducer, useState } from "react";
import FoodContext from "./foodContext";
const host = "http://localhost:5000"
const FoodState = (props) => {
  const foodInitial = []
  const [foods, setFood] = useState(foodInitial)
  const [foodscat, setFoodcat] = useState(foodInitial)
  // Get all food

  const getFoods = async () => {
    // API Call 
    const response = await fetch(`${host}/api/food/fetchallfooditem`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
          }
    });
    const json = await response.json()
    console.log(json)
    setFood(json)
  }

  const getFoodscat = async () => {
    // API Call 
    const response = await fetch(`${host}/api/food/fetchallfooditemcat`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
          }
    });
    const json = await response.json()
    console.log(json)
    setFoodcat(json)
  }
//   const initiatepayment=async()=>{
//     try{
// const response=await
//     }
//   }

  const reducer=(state,action)=>{
  switch(action.type){
  case "ADD":
    return[...state,{id:action.id,name: action.name, price: action.price, qty:action.qty ,size:action.size,img:action.img}]
    case "REMOVE":
            let newArr = [...state]
            newArr.splice(action.index, 1)
            return newArr;
        case "DROP":
            let empArray = []
            return empArray
        case "UPDATE":
            let arr = [...state]
            arr.find((food, index) => {
                if (food.id === action.id) {
                    console.log(food.qty, parseInt(action.qty), action.price + food.price)
                    arr[index] = { ...food, qty: parseInt(action.qty) + food.qty, price: action.price + food.price }
                }
                return arr
            })
            return arr
  default:
    console.log("error in reducer");
}
  }
  
  const[state,dispatch]=useReducer(reducer,[])
  
  return (
    <FoodContext.Provider value={{foods,foodscat,dispatch,state,getFoods,getFoodscat}}>
      {props.children}
    </FoodContext.Provider>
  )
}

export default FoodState;