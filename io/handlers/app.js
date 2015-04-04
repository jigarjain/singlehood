var express   = require('express'),
    router    = express.Router();

router.get('/', function (req, res, next) {
    if (req.user) {
        return res.redirect('/dashboard');
    }

    try {
        var googleAuthURL = req.app.get('sh').services.google.OAuth.getAuthUrl();
        var pageData = {
            'title': 'Singlehood',
            'headline': 'Welcome to singlehood',
            'authUrls': {
                'google': googleAuthURL
            }
        };
        res.render('home', pageData);
    } catch (e) {
        return next(e);
    }
});

router.get('/logout', function (req, res, next) {
    if (req.user) {
        req.session.destroy();
        return res.redirect('/');
    }

    var err = new Error('Already logged out');
    err.status = 400;
    return next(err);
});

module.exports = router;
