/*
* deps
*/

var Note = require('../models/Notes.js'),
    Recipe = require('../models/Recipes.js'),
    debug = require('debug')('lib:notes');

exports.newNote = function(req, res, next) {
  console.log('hi');
  if(!req.user){return next({code: 401, message: 'No user found.'})}

  var recipeId = req.params.recipeId;

  if(typeof recipeId === 'undefined'){
    return next({code: 400, message: 'no recipe sent.'})
  }
  Recipe.findOne({ _id: recipeId })
    .then(recipe=>{
      if(!recipe){return res.status(404).end()}
      return Note.findOne({_user: req.user.id, _recipe: recipeId});
    })
    .then(note=>{
      if(note){return res.status(409).end()}

      var {note, md_note} = req.body;
      console.log(req.body);
      if(!note) return res.status(400).send('note can\'t be blank.');

      var newNote = new Note({_user: req.user.id, _recipe: recipeId, note, md_note});

      return newNote.save(savedNote=> {
        res.json(newNote);
      })
    })
    .catch(err=>{
      res.status(500).end()
    });
}
exports.update = function(req, res, next) {
  if(!req.user){return next({code: 401, message: 'No user found.'})}

  var recipeId = req.params.recipeId;

  if(typeof recipeId === 'undefined'){
    return next({code: 400, message: 'no recipe sent.'})
  }
  var {note, md_note} = req.body;
  if(!note) return res.status(400).send('note can\'t be blank.');

  Note.findOneAndUpdate({_user: req.user.id, _recipe: recipeId}, { $set: {note, md_note}})
    .then(savedNote=>{
      if(!savedNote){return res.status(404).end()}

      res.json(Object.assign(savedNote,{note, md_note}));
    })
    .catch(err=>{
      res.status(500).end()
    });
}

exports.getNote = function(req, res, next) {
  if(!req.user){return next({code: 401, message: 'No user found.'})}

  var recipeId = req.params.recipeId;

  Note.findOne({_recipe: recipeId, _user: req.user.id})
    .then(note=>{
      if(!note) return res.status(404).end();

      res.json(note);
    })
    .catch(err=>{
      console.log(err);
      res.status(500).end();
    });
}
exports.deleteNote = function(req, res, next) {
  var recipeId = req.params.recipeId;
  Note.remove({_recipe: recipeId, _user: req.user.id})
    .then(_=>{
      res.status(204).end();
    })
    .catch(err=>{
      console.log(err);
      res.status(500).end();
    });
}
