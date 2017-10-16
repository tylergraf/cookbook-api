/*
* deps
*/

var Category = require('../models/Categories.js'),
    Subcategory = require('../models/Subcategories.js'),
    Recipe = require('../models/Recipes.js'),
    debug = require('debug')('lib:favorites'),
    moment = require('moment');

exports.newCategory = function(req, res, next) {
  if(!req.user){return next({code: 401, message: 'No user found.'});}
  if(!req.user.admin){return next({code: 403, message: 'Unauthorized!!!'});}

  var category = req.params.category;

  if(!category){
    return next({code: 400, message: 'No category sent.'});
  }

  var newCategory = new Category({slug: category.replace(' ','-').toLowerCase(), name: category});

  newCategory.save(function(err, newCategory) {
    if(err){return next({code: 500, message: err});}
    req.newCategory = newCategory;
    next();
  });

};

exports.addIds = function(req, res, next) {
  // Category.find(function(err, cats){
  //   cats.forEach(function(cat, i){
  //     cat.slug = cat.name.replace(' ','-').toLowerCase();
  //     cat.save();
  //   });
  //     next();
  // });
  Recipe.find(function(err, recipes){
    if(err){return next({code: 500, message: err});}
      // console.log(recipes);
      recipes.forEach(function(s,i){
        // console.log(s.subcategory_id);
        // return next();
        Subcategory.findOne({slug: s.subcategory_id.replace(' ',' ').toLowerCase()}, function(err, subcategory){
          // console.log(subcategory);
          if(subcategory){

            s._subcategory = subcategory._id;
            // s.save();
          } else {
            // s.subcategory_id = 'waffles';
            // s.save();
            // console.log(s);
            // console.log(s.subcategory_id.replace(' ','-').toLowerCase());
            // console.log(s);
          }
        });
      });
      // subcategory.save();
    next();
  });
  // Category.find(function(err, categories) {
  //   if(err){return next({code: 500, message: err});}
  //
  //
  //
  //   next();
  // });
};

exports.get = function(req, res, next) {
  var categoryId = req.params.categoryId;

  Category.findOne({_id: categoryId},function(err, category) {
    if(err){return next({code: 500, message: err});}

    debug('Category:',category);

    req.category = category;
    next();
  });
};

exports.list = function(req, res, next) {
  Category.find(function(err, categories) {
    if(err){return next({code: 500, message: err});}

      debug('Categories:',categories);
    req.categories = categories;
    next();
  });
};

exports.getCategory = function(req, res, next) {
  if(!req.user){return next({code: 401, message: 'No user found.'});}

  var categoryId = req.params.recipeId;

  Category.findOne({_recipe: recipeId, _user: req.user.id}, function(err, favorite) {
    if(err){return next({code: 500, message: err});}
    if(!favorite){return next({code: 404, message: 'No recipe found.'});}
    req.favorite = favorite;
    next();
  });
};

exports.deleteCategory = function(req, res, next) {
  if(!req.user){return next({code: 401, message: 'No user found.'});}
  if(!req.user.admin){return next({code: 403, message: 'Unauthorized!!!'});}

  var categoryId = req.params.categoryId;
  console.log(categoryId);
  Category.remove({_id: categoryId}, function(err) {
    if(err){return next({code: 500, message: err});}
    next();
  });
};
