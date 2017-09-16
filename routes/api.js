const express = require('express');
const router = express.Router();
const tracker = require('../lib/tracker.js');
const track = require('../lib/track.js');


router.post('/tracker', tracker.create);
router.put('/tracker/:id', tracker.update);
router.delete('/tracker/:id', tracker.remove);
router.get('/tracker/:id', tracker.get);
router.get('/trackers', tracker.list);


router.post('/track', track.create);
router.put('/track/:id', track.update);
router.delete('/track/:id', track.remove);
router.get('/track/:id', track.get);
router.get('/tracks/:trackerId', track.list);


module.exports = router;
