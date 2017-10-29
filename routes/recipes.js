const r = require('../lib/recipes.js');
const express = require('express');
const router = express.Router();
const verifyAuth = require('./middleware/verifyAuth.js');
const findOrCreateUser = require('./middleware/findOrCreateUser.js');

router.get("/recipes/:subcategoryId", r.list, function(req, res, next) {
  res.json({recipes: req.recipes, subcategory: req.subcategory});
});
router.get("/recipe/:id", r.get);
router.put("/recipe/:id", r.update);
router.delete("/recipe/:id", r.delete);
router.post("/recipes/move", r.move, function(req, res, next) {
  res.json(204);
});
router.post("/recipe/new", r.create);
// router.delete("/subcategory/:subcategoryId", r.deleteSu, function(req, res, next) {
//   res.json(204);
// });

router.get(["/search","/search/:searchTerm"], r.search);
router.get("/popular", r.popular);
router.put("/updateCounts", r.updateRecipeCounts);

module.exports = router;
