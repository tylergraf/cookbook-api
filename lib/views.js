/*
* deps
*/

var View = require('../models/Views.js'),
    _ = require('underscore'),
    debug = require('debug')('lib:views');

exports.newView = function(req, res, next) {

  var recipeId = req.params.recipeId,
      userId = (req.user) ? req.user.id : null;

  if(!recipeId){
    return next({code: 400, message: 'No recipe id sent.'});
  }

  var newView = new View({
    _recipe: recipeId,
    _user: userId
    });

  if(!newView._user) {
    delete newView._user;
  }

  newView.save(function(err, newView) {
    if(err){return next({code: 500, message: err});}
    res.locals.newView = newView;
    next();
  });

};
exports.list = function(req, res, next) {
  var categoryId = req.params.categoryId;

  Subcategory.find({_category: categoryId}).populate('_category').exec(function (err, subcategories) {
    if(err){return next({code: 500, message: err});}

    req.category = (subcategories.length) ? subcategories[0]._category : null;


    subcategories.forEach(function(subcategory,i){
      subcategories[i] = _.pick(subcategory, 'slug','_id','name');
    });

    debug('Subcategories:',subcategories);

    req.subcategories = subcategories;
    next();
  });
};
