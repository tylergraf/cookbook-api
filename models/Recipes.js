var mongoose = require('mongoose')
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var recipesSchema = new Schema({
    created: Date,
    updated: Date,
    title: String,
    subtitle: String,
    ingredients: String,
    directions: String,
    subcategory_id: String,
    _subcategory:  {type: ObjectId, ref: 'Subcategories'},
    id: ObjectId
    // id: ObjectId
});

module.exports = mongoose.model('Recipes', recipesSchema);
