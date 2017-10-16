const express = require('express');
const router = express.Router();
const verifyAuth = require('./middleware/verifyAuth.js');
const findOrCreateUser = require('./middleware/findOrCreateUser.js');
const categories = require('./categories.js');
const subcategories = require('./subcategories.js');
const favorites = require('./favorites.js');
const recipes = require('./recipes.js');
const views = require('./views.js');

// router.all(verifyAuth, findOrCreateUser);
router.use(categories);
router.use(subcategories);
router.use(favorites);
router.use(recipes);
router.use(views);

module.exports = router;
