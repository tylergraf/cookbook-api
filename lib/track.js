const Track = require('../model/Track.js');


exports.list = function(req, res, next) {
  const trackerId = req.params.trackerId;

  Track.find({_tracker: trackerId, _user: req.user._id})
    .populate('_tracker')
    .then(d=>{
      res.json(d);
    })
    .catch(err=>{
      console.log(err);
    });
};

exports.get = function(req, res, next) {
  Track.findOne({_id: req.params.id, _user: req.user._id})
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
  var body = req.body;
  body.updated = new Date();

  Track.findOneAndUpdate({ _id: req.params.id, _user: req.user._id },{$set: body})
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

  Track.remove({ _id: req.params.id, _user: req.user._id })
    .then(d=>{
      res.status(204).json();
    })
    .catch(err=>{
      if(err.message.startsWith('Cast to ObjectId failed')){
        return res.status(404).end();
      }
      console.log(err);
      return res.status(500).json(err);
    });
};

exports.create = function(req, res, next) {
  var body = req.body;
  body = Object.assign(body, {_user: req.user._id});

  var track = new Track(body);

  track.save()
    .then(d=>{
      res.json(track);
    })
    .catch(err=>{
      console.log(err);
    });
};
