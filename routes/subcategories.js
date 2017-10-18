const s = require('../lib/subcategories.js');
const r = require('../lib/recipes.js');
const express = require('express');
const router = express.Router();
const verifyAuth = require('./middleware/verifyAuth.js');
const findOrCreateUser = require('./middleware/findOrCreateUser.js');


router.get("/subcategories/:categoryId", s.list);
router.get("/subcategory/:subcategoryId", r.list);
router.post("/subcategory/new", s.newSubcategory, function(req, res, next) {
  res.json(req.newSubcategory);
});
router.post("/subcategories/move", s.moveSubcategory, function(req, res, next) {
  res.json(204);
});
router.delete("/subcategory/:subcategoryId", s.deleteSubcategory, function(req, res, next) {
  res.json(204);
});

module.exports = router;
