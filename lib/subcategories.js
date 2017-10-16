/*
* deps
*/

var Subcategory = require('../models/Subcategories.js'),
    Category = require('../models/Categories.js'),
    _ = require('underscore'),
    debug = require('debug')('lib:subcategories');

exports.newSubcategory = function(req, res, next) {
  if(!req.user){return next({code: 401, message: 'No user found.'});}
  if(!req.user.admin){return next({code: 403, message: 'Unauthorized!!!'});}

  var categoryId = req.body.categoryId,
      subcategory = req.body.subcategory;

  if(!subcategory){
    return next({code: 400, message: 'No subcategory sent.'});
  }

  var newSubcategory = new Subcategory({slug: subcategory.replace(' ','-').toLowerCase(), name: subcategory, _category: categoryId});

  newSubcategory.save(function(err, newSubcategory) {
    if(err){return next({code: 500, message: err});}
    req.newSubcategory = newSubcategory;
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

exports.moveSubcategory = function(req, res, next) {
  var categoryId = req.body.categoryId,
      subcategoryIds = req.body.subcategoryIds;

  Subcategory.update({ _id: { $in: subcategoryIds } },{ $set: { _category: categoryId } }).exec(function (err, subcategories) {
    if(err){return next({code: 500, message: err});}
    debug('subcategories updated: ',subcategories);
    next();
  });
};

exports.deleteSubcategory = function(req, res, next) {
  if(!req.user){return next({code: 401, message: 'No user found.'});}
  if(!req.user.admin){return next({code: 403, message: 'Unauthorized!!!'});}

  var subcategoryId = req.params.subcategoryId;

  Subcategory.remove({_id: subcategoryId}, function(err) {
    if(err){return next({code: 500, message: err});}
    next();
  });
};
