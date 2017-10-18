const c = require('../lib/categories.js');
const s = require('../lib/subcategories.js');
const express = require('express');
const router = express.Router();
const verifyAuth = require('./middleware/verifyAuth.js');
const findOrCreateUser = require('./middleware/findOrCreateUser.js');

router.get("/categories", c.list, function(req, res, next) {
  res.json(req.categories);
});
router.get("/category/:categoryId", s.list, function(req, res, next) {
  res.json(req.subcategories);
});
router.post("/category/:category", c.newCategory, function(req, res, next) {
  res.json(req.newCategory);
});
router.get("/addIds", c.addIds, function(req, res, next) {
  res.json(204);
});
router.delete("/category/:categoryId", c.deleteCategory, function(req, res, next) {
  res.json(204);
});

module.exports = router;
