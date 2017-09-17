const admin = require("firebase-admin");
const path = require("path");
const serviceAccount = require(path.join(__dirname,"../../trackerCerts.json"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = function(req, res, next){
  const authHeader = req.headers && req.headers.authorization;
  const idToken = authHeader && authHeader.split('Bearer ')[1];

  if(!authHeader || !idToken){
    return res.status(401).end();
  }

  admin.auth().verifyIdToken(idToken)
    .then(function(decodedToken) {
      const uid = decodedToken.uid;

      req.decodedToken = decodedToken;
      req.uid = uid;

      next();
    }).catch(function(error) {
      console.log(error);
      return res.status(401).end();
    });
}
