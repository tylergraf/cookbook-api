const n = require('../lib/notes.js');
const express = require('express');
const router = express.Router();

router.get("/note/:recipeId", n.getNote);
router.post("/note/:recipeId", n.newNote);
router.put("/note/:recipeId", n.update);
router.delete("/note/:recipeId", n.deleteNote);

module.exports = router;
