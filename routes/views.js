const v = require('../lib/views.js');
const express = require('express');
const router = express.Router();
const verifyAuth = require('./middleware/verifyAuth.js');
const findOrCreateUser = require('./middleware/findOrCreateUser.js');


router.post("/view/:recipeId", v.newView, function(req, res, next) {
  res.json();
});

module.exports = router;
