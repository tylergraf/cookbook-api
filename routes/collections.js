const s = require('../lib/subcategories.js');
const r = require('../lib/recipes.js');
const express = require('express');
const router = express.Router();
const verifyAuth = require('./middleware/verifyAuth.js');
const findOrCreateUser = require('./middleware/findOrCreateUser.js');


router.get("/collections", s.allCollections);
router.get("/collection/:subcategoryId", s.get);
router.post("/collection/new", s.newSubcategory);
router.post("/collections/move", s.moveSubcategory, function(req, res, next) {
  res.json(204);
});
router.delete("/collection/:subcategoryId", s.deleteSubcategory, function(req, res, next) {
  res.json(204);
});

module.exports = router;
