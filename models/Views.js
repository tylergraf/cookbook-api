var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var viewSchema = new Schema({
    created: {type: Date, default: Date.now},
    _recipe: {type: ObjectId, ref: 'Recipes'},
    _user: {type: ObjectId, ref: 'Users'},
    id: ObjectId
});


module.exports = mongoose.model('Views', viewSchema);
