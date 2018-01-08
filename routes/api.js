const express = require('express');
const router = express.Router();
const verifyAuth = require('./middleware/verifyAuth.js');
const findOrCreateUser = require('./middleware/findOrCreateUser.js');
const categories = require('./categories.js');
const subcategories = require('./subcategories.js');
const favorites = require('./favorites.js');
const recipes = require('./recipes.js');
const views = require('./views.js');
const notes = require('./notes.js');
const collections = require('./collections.js');

router.use(verifyAuth);
router.use(findOrCreateUser);
router.use(categories);
router.use(subcategories);
router.use(favorites);
router.use(recipes);
router.use(views);
router.use(notes);
router.use(collections);

module.exports = router;
