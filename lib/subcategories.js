/*
* deps
*/

var Subcategory = require('../models/Subcategories.js'),
    Category = require('../models/Categories.js'),
    Recipe = require('../models/Recipes.js'),
    _ = require('underscore'),
    debug = require('debug')('lib:subcategories');

exports.newSubcategory = function(req, res, next) {
  var userId = req.user && req.user.id;

  if(!userId) return res.status(401).end();
  // if(!req.user.admin){return next({code: 403, message: 'Unauthorized!!!'});}

  var name = req.body.name;

  if(!name){
    return next({code: 400, message: 'No subcategory name sent.'});
  }

  var newSubcategory = new Subcategory(req.body);

  newSubcategory.save()
    .then(newSubcategory=>{
      res.json(newSubcategory);
    })
    .catch(err=>{
      res.status(500).send(err);
    });

};
exports.get = function(req, res, next) {
  const subcategoryId = req.params.subcategoryId;

  Subcategory.findById(subcategoryId)
    .then(result=>{
      return res.json(result);
    })
    .catch(err=>next({code: 500, message: err}));
};
exports.all = function(req, res, next) {
  Subcategory.find({isCollection: false})
    .then(results=>{
      return res.json(results);
    })
    .catch(err=>next({code: 500, message: err}));
};
exports.allCollections = function(req, res, next) {
  Subcategory.find({isCollection: true})
    .then(results=>{
      return res.json(results);
    })
    .catch(err=>next({code: 500, message: err}));
};
exports.list = function(req, res, next) {
  var categoryId = req.params.categoryId;
  var subcategories;
  Subcategory.find({_category: categoryId}).populate('_category')
    .then(results=>{
      return res.json(results);
    //   subcategories = results;
    //   let promises = results.map(s=>{
    //     return Recipe.count({_subcategory: s._id});
    //   });
    //
    //   return Promise.all(promises)
    // })
    // .then(counts=>{
    //   return res.json(subcategories);
    //
    //   var c = subcategories.map((s,i)=>{
    //     s.set('recipeCount', counts[i], {strict: false});
    //     return s;
    //   });
    //   res.json(c);
    })
    .catch(err=>next({code: 500, message: err}));
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
