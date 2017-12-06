var mongoose = require('mongoose')
    ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;

var noteSchema = new Schema({
    id: ObjectId,
    _user: {type: ObjectId, ref: 'Users'},
    _recipe: {type: ObjectId, ref: 'Recipes'},
    note: String,
    md_note: String,
});


module.exports = mongoose.model('Notes', noteSchema);
