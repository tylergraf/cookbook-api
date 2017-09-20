const admin = require("firebase-admin");
const path = require("path");

const serviceAccount = {
  "type": "service_account",
  "project_id": "tracker-3b40b",
  "private_key_id": process.env.FB_KEY_ID,
  "private_key": process.env.FB_KEY,
  "client_email": "firebase-adminsdk-339ff@tracker-3b40b.iam.gserviceaccount.com",
  "client_id": process.env.FB_CLIENT_ID,
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://accounts.google.com/o/oauth2/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-339ff%40tracker-3b40b.iam.gserviceaccount.com"
};

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
