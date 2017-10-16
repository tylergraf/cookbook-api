const s = require('../lib/subcategories.js');
const express = require('express');
const router = express.Router();
const verifyAuth = require('./middleware/verifyAuth.js');
const findOrCreateUser = require('./middleware/findOrCreateUser.js');


router.get("/subcategories/:categoryId", s.list, function(req, res, next) {
  res.json({subcategories: req.subcategories, category: req.category});
});
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
