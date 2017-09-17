const express = require('express');
const router = express.Router();
const tracker = require('../lib/tracker.js');
const track = require('../lib/track.js');
const verifyAuth = require('./middleware/verifyAuth.js');
const findOrCreateUser = require('./middleware/findOrCreateUser.js');


router.post('/tracker', verifyAuth, findOrCreateUser, tracker.create);
router.put('/tracker/:id', verifyAuth, findOrCreateUser, tracker.update);
router.delete('/tracker/:id', verifyAuth, findOrCreateUser, tracker.remove);
router.get('/tracker/:id', verifyAuth, findOrCreateUser, tracker.get);
router.get('/trackers', verifyAuth, findOrCreateUser, tracker.list);


router.post('/track', verifyAuth, findOrCreateUser, track.create);
router.put('/track/:id', verifyAuth, findOrCreateUser, track.update);
router.delete('/track/:id', verifyAuth, findOrCreateUser, track.remove);
router.get('/track/:id', verifyAuth, findOrCreateUser, track.get);
router.get('/tracks/:trackerId', verifyAuth, findOrCreateUser, track.list);


module.exports = router;
