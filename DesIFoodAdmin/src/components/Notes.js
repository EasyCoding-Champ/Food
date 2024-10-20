import React, { useContext, useRef, useEffect, useState } from 'react'
import Noteitem from './Noteitem';
import { useNavigate } from 'react-router-dom';
import foodContext from '../context/food/foodContext';


const Notes = (props) => {
    const context = useContext(foodContext);
    const { foods, getfood, editItem } = context;
    let navigate = useNavigate();
    useEffect(() => {
        if (localStorage.getItem('token')) {
            getfood()
        } else {
            navigate("/login");
        }

        // eslint-disable-next-line
    }, [])
    const ref = useRef(null)
    const refClose = useRef(null)
    const [options,setOptions] = useState([{ half: "", full: "" }]);
    const [food, setFood] = useState({id:" ", eCategoryName: " ", ename: "", eimg: null, eoptions: [{ half: " ", full: "" }], edescription: " " })

    const updateItem = (currentItem) => {
        ref.current.click();
        setFood({id:currentItem._id ,eCategoryName: currentItem.CategoryName,ename:currentItem.name, eimg: currentItem.img, eoptions: currentItem.options, edescription: currentItem.description })
        
    }
    // Handle option changes
      const handleOptionChange = (index, field, value) => {
        const updatedOptions = [...food.eoptions];
        updatedOptions[index][field] = value;
        setOptions(updatedOptions);
      };
    const handleClick = (e) => {
        editItem(food.id,food.eCategoryName, food.ename, food.eimg, food.eoptions, food.edescription)
        refClose.current.click();
    }

    const onChange = (e) => {
        setFood({ ...food, [e.target.name]: e.target.value })
    }
    return (
        <>
            <button ref={ref} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
                Launch demo modal
            </button>
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Edit Note</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form className='w-50 m-auto mt-5 border bg-light border-success rounded'>
        <h2>Update FoodItem</h2>
        <div className="m-3">
        <label htmlFor="CategoryName" className="form-label">Food Category Name:</label>
                <input  type="text" className="form-control" id="eCategoryName" name="eCategoryName" value={food.eCategoryName} onChange={onChange} disabled />
            </div>
            <div className="m-3">
                <label htmlFor="name" className="form-label">Food Name:</label>
                <input type="text" className="form-control" id="ename" name="ename" value={food.ename} onChange={onChange} required />
            </div>
            <div className="m-3">
                <label htmlFor="img" className="form-label">Food Image:</label>
                <input type="file" className="form-control" id="eimg" name="eimg" onChange={onchange} disabled />
            </div>
            <div className="m-3">
                <label htmlFor="options" className="form-label">Quantity Price:</label>
                {food.eoptions.map((option, index) => (
                    <div key={index}>
                        <input type="text"  placeholder="Half" value={option.half} onChange={(e) => handleOptionChange(index, 'half', e.target.value)} required/>
                        <input type="text"  placeholder="Full" value={option.full} onChange={(e) => handleOptionChange(index, 'full', e.target.value)} required />
                    </div>
                ))}
            </div>
            <div className="m-3">
                <label htmlFor="description" className="form-label">Description:</label>
                <textarea id="edescription" className="form-control" name="edescription" value={food.edescription} onChange={onChange} required
                />
            </div>
            <button ref={refClose} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button disabled={food.eCategoryName.length < 3 || food.ename.length < 3 ||food.edescription.length<5} onClick={handleClick} type="button" className="btn btn-primary">Update Note</button>
        </form>
                        </div>
                        {/* <div className="modal-footer">
                            <button ref={refClose} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button disabled={food.etitle.length < 5 || food.edescription.length < 5} onClick={handleClick} type="button" className="btn btn-primary">Update Note</button>
                        </div> */}
                    </div>
                </div>
            </div>

            <div className="row my-3">
                <h2>You foods</h2>
                <div className="container mx-2">
                    {foods.length === 0 && 'No foods to display'}
                </div>

                {
                        //foods.filter((item)=>(item.CategoryName===foodcard.CategoryName ) && (item.name.toLowerCase().includes(search.toLocaleLowerCase)))
                    foods.map(filterItems=>{
                        return (<div key={filterItems._id} className='col-12 col-md-6 col-lg-3'>
                        <Noteitem foodName={filterItems.name} item={filterItems} updateNote={updateItem} options={filterItems.options[0]} ImgSrc={filterItems.img}></Noteitem>
                        </div>
                        )
                    })}



                {/* {foods.map((food) => {
                    return <Noteitem key={food._id} updateNote={updateNote} showAlert={props.showAlert} food={food} />
                })} */}
            </div>
        </>
    )
}

export default Notes
