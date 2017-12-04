const User = require("../../models/User.js");

module.exports = function(req, res, next){
  if(!req.uid){
    req.user = {}
    return next();
  }
  User.findOne({uid: req.uid})
    .then(user=>{
      if(!user){
        let newUser = new User(req.decodedToken);
        return newUser.save();
      }
      return user;
    })
    .then(user=>{
      req.user = user;
      next();
    })
    .catch(err=>{
      console.log('err',err);
      res.status(500).end();
    });
}
