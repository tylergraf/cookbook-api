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
  Recipe.findOneAndUpdate({ _id: recipeId }, { $inc: { favorites: 1 }})
    .then(recipe=>{
      if(!recipe){return next({code: 400, message: 'No recipe found.'})}
      return Favorite.findOne({_user: req.user.id, _recipe: recipeId});
    })
    .then(favorite=>{
      console.log('favorite',favorite);
      if(favorite){return res.status(409).send()}

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
  Favorite.find({_user: id}).lean().populate('_recipe')
    .then(favorites=> {
      var recipes = favorites.filter(f=>f._recipe)
        .map(f=>{
        f._recipe.favorited = true;
        return f._recipe;
      });

      res.json(recipes);
    })
    .catch(err=>{
      console.log(err);
      res.status(500).end();
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
  Favorite.remove({_recipe: recipeId, _user: req.user.id})
  .then(_=>{
    return Recipe.findOneAndUpdate({ _id: recipeId }, { $inc: { favorites: -1 }});
  })
  .then(_=>{
    next();
  });
}
exports.resetFavoriteCount = function(req, res, next) {
  var recipeId = req.params.recipeId;
  var count;
  Favorite.find({_recipe: recipeId})
    .then(favorites=>{
      count = favorites.length || 0;
      return Recipe.findOneAndUpdate({ _id: recipeId }, { $set: { favorites: count }});
    })
    .then(recipe=>{
      recipe.set('favorites', count);
      res.json(recipe);
    })
    .catch(err=>{
      console.log(err);
      res.status(500).send(err);
    });
}
