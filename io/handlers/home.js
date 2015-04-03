var express   = require('express'),
    router    = express.Router(),
    wrap      = require('co-express');

router.get('/', wrap(function* (req, res, next) {
    try {
        res.send('Home');
    } catch (e) {
        return next(e);
    }
}));

module.exports = router;
