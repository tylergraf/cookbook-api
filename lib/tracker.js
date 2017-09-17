const Tracker = require('../model/Tracker.js');


exports.list = function(req, res, next) {
  Tracker.find({_user: req.user._id})
    .then(d=>{
      res.json(d);
    })
    .catch(err=>{
      console.log(err);
    });
};

exports.get = function(req, res, next) {
  Tracker.findOne({_id: req.params.id, _user: req.user._id})
    .then(d=>{
      res.json(d);
    })
    .catch(err=>{
      console.log(err);
    });
};

exports.update = function(req, res, next) {
  const id = req.params.id;
  const body = req.body;
  body.updated = new Date();

  Tracker.findOneAndUpdate({ _id: req.params.id, _user: req.user._id },{$set: body})
    .then(d=>{
      res.json(Object.assign(d,body));
    })
    .catch(err=>{
      console.log(err);
    });
};

exports.remove = function(req, res, next) {
  const id = req.params.id;

  Tracker.remove({ _id: req.params.id, _user: req.user._id })
    .then(d=>{
      res.status(204).json();
    })
    .catch(err=>{
      console.log(err);
    });
};

exports.create = function(req, res, next) {
  var body = req.body;
  body = Object.assign(body, {_user: req.user._id});

  var tracker = new Tracker(body);

  tracker.save().then(d=>{
    res.json(tracker);
  })
  .catch(err=>{
    console.log(err);
  });
};
