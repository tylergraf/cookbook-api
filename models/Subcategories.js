var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var subcategorySchema = new Schema({
    created: {type: Date, default: Date.now},
    updated: {type: Date, default: Date.now},
    name: String,
    _category: {type: ObjectId, ref: 'Categories'},
    slug: String,
    id: ObjectId,
    recipeCount: {type: Number, default: 0}
});


module.exports = mongoose.model('Subcategories', subcategorySchema);
