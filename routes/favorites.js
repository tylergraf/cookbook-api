const f = require('../lib/favorites.js');
const express = require('express');
const router = express.Router();
const verifyAuth = require('./middleware/verifyAuth.js');
const findOrCreateUser = require('./middleware/findOrCreateUser.js');

router.get("/favorite/:recipeId", f.getFavorite, function(req, res, next) {
  res.json(req.favorite);
});
router.get("/favorites", f.list, function(req, res, next) {
  res.json(req.favorites);
});
router.post("/favorite/:recipeId", f.newFavorite, function(req, res, next) {
  res.json(req.newFavorite);
});
router.delete("/favorite/:recipeId", f.deleteFavorite, function(req, res, next) {
  res.json(204);
});

module.exports = router;
