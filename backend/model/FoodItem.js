const { type } = require('@testing-library/user-event/dist/type');
const mongoose = require('mongoose');
const { Schema } = mongoose;
const NotesSchema = new Schema({
    //forign key concept
    // user:{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'user'
    // },
    CategoryName:{
        type:String
    },
    name: {
        type: String
    },
    img: {
        data:Buffer,
        contentType: String
    },
    options: [
        {
            half: String,
            full: String,
            _id:false
            }

        

    ],

    description: {
        type: String,
    },

    date: {
        type: Date,
        default: Date.now
    },
});
module.exports = mongoose.model('FoodItem', NotesSchema);

