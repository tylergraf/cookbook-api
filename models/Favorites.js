var mongoose = require('mongoose')
    ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;

var favoriteSchema = new Schema({
    id: ObjectId,
    _user: {type: ObjectId, ref: 'Users'},
    _recipe: {type: ObjectId, ref: 'Recipes'}
});


module.exports = mongoose.model('Favorites', favoriteSchema);
