const Track = require('../model/Track.js');


exports.list = function(req, res, next) {
  const trackerId = req.params.trackerId;

  Track.find({_tracker: trackerId})
    .populate('_tracker')
    .then(d=>{
      res.json(d);
    })
    .catch(err=>{
      console.log(err);
    });
};

exports.get = function(req, res, next) {
  Track.findOne({_id: req.params.id})
    .populate('_tracker')
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

  Track.findOneAndUpdate({ _id: req.params.id },{$set: body})
    .populate('_tracker')
    .then(d=>{
      res.json(Object.assign(d,body));
    })
    .catch(err=>{
      console.log(err);
    });
};

exports.remove = function(req, res, next) {
  const id = req.params.id;

  Track.remove({ _id: req.params.id })
    .then(d=>{
      res.status(204).json();
    })
    .catch(err=>{
      console.log(err);
    });
};

exports.create = function(req, res, next) {
  const body = req.body;

  var tracker = new Track(body);

  tracker.save()
    .then(d=>{
      res.json(tracker);
    })
    .catch(err=>{
      console.log(err);
    });
};
