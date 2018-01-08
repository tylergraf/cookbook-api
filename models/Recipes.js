var mongoose = require('mongoose')
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var recipesSchema = new Schema({
    created: {type: Date, default: Date.now},
    updated: {type: Date, default: Date.now},
    title: String,
    subtitle: String,
    ingredients: String,
    md_ingredients: String,
    directions: String,
    md_directions: String,
    _subcategory:  {type: ObjectId, ref: 'Subcategories'},
    _user:  {type: ObjectId, ref: 'User'},
    id: ObjectId,
    views: {type: Number, default: 0},
    favorites: {type: Number, default: 0},
    favorited: {type: Boolean, default: false},
    note: String,
    image: String
});

recipesSchema.index({title: 'text', 'subtitle': 'text', md_ingredients: 'text', md_directions: 'text'});

module.exports = mongoose.model('Recipes', recipesSchema);
