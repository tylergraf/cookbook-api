const c = require('../lib/categories.js');
const express = require('express');
const router = express.Router();
const verifyAuth = require('./middleware/verifyAuth.js');
const findOrCreateUser = require('./middleware/findOrCreateUser.js');

router.get("/categories", c.list, function(req, res, next) {
  res.json(req.categories);
});
router.get("/category/:categoryId", c.get, function(req, res, next) {
  res.json(req.category);
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
