import { useState } from "react";
import NoteContext from "./foodContext";
const host = "http://localhost:5000"
const FoodState = (props) => {
  const foodInitial = []
  const [foods, setFoods] = useState(foodInitial)
  const [foodscat, setFoodcat] = useState(foodInitial)
  // Get all food

  const getfood = async () => {
    // API Call 
    const response = await fetch(`${host}/api/food/fetchallfooditem`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const json = await response.json()
    setFoods(json)
  }

  //Add a Note
  const addItem = async ( newitem ) => {
// //Add Category in db
// const carresponse = await fetch(`${host}/api/food/addcategory`, {
//   method: 'POST',
//   headers: {
//     'content-Type': 'application/json'
//   },
//   body:JSON.stringify({CategoryName})
// });
// console.log(carresponse)

    //todo api call
    const response = await fetch(`${host}/api/food/FoodItem`, {
      method: 'POST',
      body:newitem,
    });
    const foodres = await response.json();
    console.log(foodres)
    setFoods(foods.concat(foodres))
  }

  //Delte a node
  const deleteItems = async (id) => {
    // API Call
    const response = await fetch(`${host}/api/food/deleteItems/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const json = response.json();
    console.log(json)
    const newfood = foods.filter((note) => { return note._id !== id })
    setFoods(newfood)
  }
  // Edit a Note
  const editItem = async (id,CategoryName, name, img,options,description) => {
    // API Call 
    const response = await fetch(`${host}/api/food/updatenote/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ CategoryName, name, img,options,description })
    });
    const json = await response.json();
    console.log(json)
    let newfood = JSON.parse(JSON.stringify(foods))
    // Logic to edit in client
    for (let index = 0; index < newfood.length; index++) {
      const element = newfood[index];
      if (element._id === id) {
        newfood[index].CategoryName = CategoryName;
        newfood[index].name = name;
        newfood[index].img = img;
        newfood[index].options = options;
        newfood[index].description = description;
        break;
      }
    }
    setFoods(newfood);
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
  
  return (
    <NoteContext.Provider value={{ foods,foodscat, getFoodscat,addItem,deleteItems, editItem, getfood }}>
      {props.children}
    </NoteContext.Provider>
  )
}
export default FoodState;
