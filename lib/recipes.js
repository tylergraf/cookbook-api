/*
* deps
*/

var Recipe = require('../models/Recipes.js'),
    _ = require('underscore'),
    debug = require('debug')('lib:recipes');

exports.newSubcategory = function(req, res, next) {
  if(!req.user){return next({code: 401, message: 'No user found.'});}
  if(!req.user.admin){return next({code: 403, message: 'Unauthorized!!!'});}

  var categoryId = req.body.categoryId,
      subcategory = req.body.subcategory;

  if(!subcategory){
    return next({code: 400, message: 'No subcategory sent.'});
  }

  var newSubcategory = new Recipe({_id: subcategory.toLowerCase(), name: subcategory, category_id: categoryId});

  newSubcategory.save(function(err, newSubcategory) {
    if(err){return next({code: 500, message: err});}
    req.newSubcategory = newSubcategory;
    next();
  });

};

exports.get = function(req, res, next) {
  var id = req.params.id;

  debug('id','ObjectId("'+id+'")');

  Recipe.findOne({_id: id}).populate('_subcategory').exec(function(err, recipe){
    if(err) return next(err);

    req.subcategory = (recipe) ? recipe._subcategory : null;

    debug('Recipe:',recipe);

    req.recipe = recipe;
    next();
  });
};
exports.list = function(req, res, next) {
  var subcategoryId = req.params.subcategoryId;
  Recipe.find({_subcategory: subcategoryId}).populate('_subcategory').sort({ title: 1})
    .then(recipes=>{

    recipes = recipes.map(recipe=>{
      return {title,_id,subtitle,subcategory} = recipe;
      // recipes[i] = _.pick(recipe, 'title','_id','subtitle');
    });

    debug('Recipes:',recipes);
    res.json(recipes);
  })
  .catch(err=>next(err));
};

exports.move = function(req, res, next) {
  var subcategoryId = req.body.subcategoryId,
      recipeIds = req.body.recipeIds;

  Recipe.update({ _id: { $in: recipeIds } },{ $set: { _subcategory: subcategoryId } }).exec(function (err, recipes) {
    if(err){return next({code: 500, message: err});}
    debug('recipes updated: ',recipes);
    next();
  });
};

exports.search = function(req, res, next) {
  var searchTerm = req.params.searchTerm;
  searchTerm = searchTerm.replace('&', '&amp;');
  searchTerm = searchTerm.replace("'", '&#39;');
  debug('searchTerm',searchTerm);
  // searchText.match(/\SIce cream/im)
  var reg = new RegExp(searchTerm,'im');
  debug('reg',reg);


  Recipe.find({'title': reg}).sort({ title: 1}).limit(50).exec(function (err, searchResults) {
    if(err) return next(err);
    // debug('Recipe:',output);

    searchResults.forEach(function(recipe,i){
      searchResults[i] = _.pick(recipe, 'title','_id','subtitle');
    });

    req.recipes = searchResults;
    next();
  });
};

exports.deleteRecipe = function(req, res, next) {
  if(!req.user){return next({code: 401, message: 'No user found.'});}
  if(!req.user.admin){return next({code: 403, message: 'Unauthorized!!!'});}

  var subcategoryId = req.params.subcategoryId;

  Recipe.remove({_id: subcategoryId}, function(err) {
    if(err){return next({code: 500, message: err});}
    next();
  });
};
