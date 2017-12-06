/*
* deps
*/

const Recipe = require('../models/Recipes.js');
const Category = require('../models/Categories.js');
const Subcategory = require('../models/Subcategories.js');
const Favorite = require('../models/Favorites.js');
const Note = require('../models/Notes.js');
const _ = require('underscore');
const marked = require('marked');
const debug = require('debug')('lib:recipes');
const toMarkdown = require('to-markdown');
const renderer = new marked.Renderer();

renderer.paragraph = function (text) {
  const escapedText = text.replace(/\n/g, '<br>');

  return `<p>${escapedText}</p>`;
}

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
  var userId = req.user && req.user.id;
  var count = req.user && req.user.email === 'tylergraf@gmail.com' ? 0 : 1;

  var calls = [Recipe.findOneAndUpdate({ _id: id }, { $inc: { views: count }}).populate({ path: '_subcategory', populate: { path: '_category' }})];
  if(userId){
    calls = calls.concat([Note.findOne({_user: userId, _recipe: id})],Favorite.findOne({_user: userId, _recipe: id}))
  }
  Promise.all(calls)
    .then(([recipe,note,favorite])=>{
      if(!recipe) return res.status(404).end();
      debug('Recipe:',recipe);

      recipe.set('ingredients', marked(recipe.md_ingredients, { renderer }));
      recipe.set('directions', marked(recipe.md_directions, { renderer }));
      recipe.set('favorited', !!favorite);

      if(note){
        recipe.set('note', marked(note.md_note, { renderer }));
      }

      res.json(recipe);
    })
    .catch(err=>{
      console.log(err);
      res.json(err);
    });
};

exports.popular = function(req, res, next) {
  var userId = req.user && req.user.id;
  Promise.all([
    Favorite.find({_user: userId}),
    Recipe.find()
      .sort('-views')
      .limit(30)
      .populate({ path: '_subcategory', populate: { path: '_category' }})
  ])
    .then(([favorites,recipes])=>{
      if(!recipes.length) return res.status(404).end();
      var favoriteIds = favorites.map(f=>f._recipe.toString());
      recipes.forEach(recipe=>{
        recipe.set('favorited',favoriteIds.includes(recipe._id.toString()));
      });
      debug('Recipe:',recipes);

      res.json(recipes);
    })
    .catch(err=>{
      console.log(err);
      res.json(err);
    });
};

exports.create = function(req, res, next) {
  var recipe = req.body;

  if(!recipe) {
    return res.status('400').json({err:'No recipe sent.'})
  }

  var newRecipe = new Recipe(recipe);

  newRecipe.save()
    .then(r=>{
      res.json(r);
      return updateRecipeCounts();
    })
    .catch(err=>next({status:500, err}));


};
exports.list = function(req, res, next) {
  const userId = req.user && req.user.id;
  const subcategoryId = req.params.subcategoryId;

  Promise.all([
    Favorite.find({_user: userId}),
    Recipe.find({_subcategory: subcategoryId})
      .populate({ path: '_subcategory', populate: { path: '_category' }})
      .sort({ title: 1})
    ])
    .then(([favorites,recipes])=>{
      if(!recipes.length) return res.status(404).end();
      var favoriteIds = favorites.map(f=>f._recipe.toString());

      recipes = recipes.map(recipe=>{
        recipe.set('favorited',favoriteIds.includes(recipe._id.toString()));

        return {title,_id,subtitle,subcategory,favorites} = recipe;
      });

      debug('Recipes:',recipes);
      res.json(recipes);
    })
    .catch(err=>next(err));
};

exports.update = function(req, res, next) {
  var recipe = req.body,
      id = req.params.id;

  recipe.updated = new Date().now;

  const {md_ingredients,md_directions,_subcategory,title,subtitle,updated} = recipe;
  recipe = {md_ingredients,md_directions,_subcategory,title,subtitle,updated};

  if(recipe._subcategory){
    recipe._subcategory = (typeof recipe._subcategory === 'object') ? recipe._subcategory._id : recipe._subcategory;
  }

  Recipe.findByIdAndUpdate(id, { $set: recipe})
    .then(recipe=>{
      debug('recipe updated: ',recipe);
      res.json(recipe);
      updateRecipeCounts();
    })
    .catch(err=>next({code: 500, err}));
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
exports.delete = function(req, res, next) {
  const _id = req.params.id;

  Recipe.remove({_id})
    .then(_=>res.status(204).json())
    .catch(err=>next({code: 500, err}));

};

exports.search = function(req, res, next) {
  var searchTerm = req.params.searchTerm;
  if(!searchTerm) {
    return res.json([]);
  }
  searchTerm = searchTerm.replace('&', '&amp;');
  searchTerm = searchTerm.replace("'", '&#39;');
  debug('searchTerm',searchTerm);
  // searchText.match(/\SIce cream/im)
  var reg = new RegExp(searchTerm,'im');
  debug('reg',reg);

  Recipe.find({$text: {$search: searchTerm}}).sort({ title: 1}).limit(50).exec(function (err, searchResults) {
    if(err) return next(err);
    // debug('Recipe:',output);

    searchResults.forEach(function(recipe,i){
      searchResults[i] = _.pick(recipe, 'title','_id','subtitle');
    });

    res.json(searchResults);
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
function updateRecipeCounts(){
  var categories,
      subcategories;

  return Subcategory.find()
    .then(subcats=>{
      subcategories = subcats;
      let promises = subcategories.map(s=>{
        return Recipe.count({_subcategory: s._id});
      });
      return Promise.all(promises);
    })
    .then(counts=>{
      var saves = subcategories.map((s,i)=>{
        s.set('recipeCount',counts[i]);
        return s.save();
      });
      return Promise.all(saves);
    })
    .then(subcategories=>{

      var m = new Map();

      subcategories.forEach(s=>m.set(s._category,0));

      var counts = Array.from(m.keys()).map(id=>subcategories.filter(d=>d._category === id).reduce((a,b)=>a.recipeCount||0+b.recipeCount||0))

      var promises = Array.from(m).map((v,i)=>{
        var recipeCount;
        if(Number.isInteger(counts[i])){
          recipeCount = counts[i]
        } else {
          recipeCount = counts[i].recipeCount;
        }
        return Category.update({ _id: v[0] }, { recipeCount });
      });

      return Promise.all(promises);
    });
}
exports.updateRecipeCounts = function(req,res,next){
  updateRecipeCounts()
    .then(_=>res.send('done'))
    .catch(err=>next({status:500,err}));
}

function convertToMD(){
  Recipe.find()
    .then(recipes=>{
      var promises = recipes.map(r=>{
        r.set('md_directions',toMarkdown(r.directions));
        r.set('md_ingredients',toMarkdown(r.ingredients));
        return r.save();
      });
      return Promise.all(promises);
    })
    .then(_=>{
      console.log('all saved');
    })
}

// convertToMD();
