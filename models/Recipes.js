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
    id: ObjectId
});

recipesSchema.index({title: 'text', 'subtitle': 'text', md_ingredients: 'text', md_directions: 'text'});

module.exports = mongoose.model('Recipes', recipesSchema);
