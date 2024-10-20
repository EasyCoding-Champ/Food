const { type } = require('@testing-library/user-event/dist/type');
const mongoose = require('mongoose');
const { Schema } = mongoose;
const NotesSchema = new Schema({
    //forign key concept
    foodCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'foodCategory'
    },
    CategoryName:{
        type:String
    }
});
module.exports = mongoose.model('foodCategory', NotesSchema);