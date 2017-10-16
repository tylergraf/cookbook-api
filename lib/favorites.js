/*
* deps
*/

var Favorite = require('../models/Favorites.js'),
    Recipe = require('../models/Recipes.js'),
    debug = require('debug')('lib:favorites');

exports.newFavorite = function(req, res, next) {
  if(!req.user){return next({code: 401, message: 'No user found.'})}

  var recipeId = req.params.recipeId;

  if(typeof recipeId === 'undefined'){
    return next({code: 400, message: 'no recipe sent.'})
  }
  Recipe.findOne({_id: recipeId}, function(err, recipe) {
    if(err){return next({code: 500, message: err})}
    if(!recipe){return next({code: 400, message: 'No recipe found.'})}

    var newFavorite = new Favorite({_user: req.user.id, _recipe: recipeId});

    newFavorite.save(function(err, newFavorite) {
      if(err){return next({code: 500, message: err})}
      req.newFavorite = newFavorite;
      next();
    });
  });
}

exports.list = function(req, res, next) {
  if(!req.user){return next({code: 401, message: 'No user found.'})}

  var id = req.user.id;
  Favorite.find({_user: id}).populate('_recipe').exec(function(err, favorites) {
    if(err){return next({code: 500, message: err})}
    req.favorites = favorites;
    next();
  })
}

exports.getFavorite = function(req, res, next) {
  if(!req.user){return next({code: 401, message: 'No user found.'})}

  var recipeId = req.params.recipeId;

  Favorite.findOne({_recipe: recipeId, _user: req.user.id}, function(err, favorite) {
    if(err){return next({code: 500, message: err})}
    if(!favorite){return next({code: 404, message: 'No recipe found.'})}
    req.favorite = favorite;
    next();
  })
}
exports.deleteFavorite = function(req, res, next) {
  var recipeId = req.params.recipeId;
  Favorite.remove({_recipe: recipeId, _user: req.user.id}, function(err) {
    if(err){return next({code: 500, message: err})}
    next();
  })
}
