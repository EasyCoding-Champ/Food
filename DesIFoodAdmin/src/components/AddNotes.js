import React, { useContext, useEffect, useState } from 'react'
import noteContext from "../context/food/foodContext"

const AddNote = () => {
    const context = useContext(noteContext);
    const { addItem, foodscat, getFoodscat } = context;
    const [name, setName] = useState('');
    const [image, setImage] = useState(null);
    const [options, setOptions] = useState([{ half: '', full: '' }]);
    const [description, setDescription] = useState('');
    const[selectedItem,setselectedItem]=useState('')

    useEffect(() => {
        if (localStorage.getItem('token')) {
            getFoodscat()
        } else {
            console.log("failed")
        }

        // eslint-disable-next-line
    }, [])
    const handleChange = (e) => {
       const selectedId = e.target.value;
       const itemscat = foodscat.find(item => item._id === selectedId);
        setselectedItem(itemscat);
    };
    // Handle option changes
    const handleOptionChange = (index, field, value) => {
        const updatedOptions = [...options];
        updatedOptions[index][field] = value;
        setOptions(updatedOptions);
    };
    // Handle image file input
    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };
    // Handle form submit
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('CategoryName', selectedItem.CategoryName);
        formData.append('name', name);
        formData.append('img', image); // Append image file
        formData.append('options', JSON.stringify(options)); // Stringify options array
        formData.append('description', description);
        addItem(formData);
        setselectedItem('');
        setName('');
        setImage(null);
        setOptions([{ half: '', full: '' }]);
        setDescription('');
    };

    // const onChange = (e) => {
    //     setFood({ ...food, [e.target.name]: e.target.value })
    // }

    return (
        <div style={{ backgroundImage: 'url("https://images.pexels.com/photos/1565982/pexels-photo-1565982.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")', backgroundSize: 'cover', height: '100vh' }}>
            <div className='"container my-3"' >
                <form className='w-50 m-auto mt-5 border bg-light border-success rounded' onSubmit={handleSubmit}>
                    <h2>Add FoodItem</h2>
                    <div className="m-3">
                        <label htmlFor="CategoryName" className="form-label">Food Category Name:</label>
                        <select id="CategoryName" onChange={handleChange} defaultValue="">
                            <option value="" disabled>
                                -- Select an Item --
                            </option>
                            {foodscat.map(item => (
                                <option key={item._id} value={item._id}>
                                    {item.CategoryName}
                                </option>
                            ))}
                        </select>

                    </div>
                    <div className="m-3">
                        <label htmlFor="name" className="form-label">Food Name:</label>
                        <input type="text" className="form-control" id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} required minLength={3} />
                    </div>
                    <div className="m-3">
                        <label htmlFor="img" className="form-label">Food Image:</label>
                        <input type="file" className="form-control" onChange={handleImageChange} />
                    </div>
                    <div className="m-3">
                        <label htmlFor="options" className="form-label">Quantity Price:</label>
                        {options.map((option, index) => (
                            <div key={index}>
                                <input type="text" placeholder="Half" value={option.half} onChange={(e) => handleOptionChange(index, 'half', e.target.value)} required />
                                <input type="text" placeholder="Full" value={option.full} onChange={(e) => handleOptionChange(index, 'full', e.target.value)} required />
                            </div>
                        ))}
                    </div>
                    <div className="m-3">
                        <label htmlFor="description" className="form-label">Description:</label>
                        <textarea id="description" className="form-control" name="description" value={description} onChange={(e) => setDescription(e.target.value)} required minLength={5}
                        />
                    </div>
                    <button disabled={name.length < 3 || description.length < 5} type="submit" className="btn btn-primary">Add Item</button>
                </form>
            </div>
        </div>
    );
};

export default AddNote