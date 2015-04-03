var express   = require('express'),
    router    = express.Router(),
    _         = require('lodash'),
    wrap      = require('co-express');

router.get('/google/callback', wrap (function* (req, res, next) {
    try {
        var code = req.query.code;

        // Get auth tokens
        var token = yield req.app.get('sh').services.google.OAuth.getTokens(code);

        // TODO: Get User from plus API
        var plus = new (req.app.get('sh')).services.google.Plus(token);
        var profile = yield plus.getProfile('me');

        var email;
        _.each(profile.emails, function(e) {
            if (e.type === 'account') {
                email = e.value;
                return false;
            }
        });

        var user;
        // Check whether user already exists
        user = yield req.app.get('sh').users.Repo.getByEmail(email);
        if(user) {
            user.oauths.google = token;
            yield req.app.get('sh').users.Repo.update(user);
        } else {
            user = new (req.app.get('sh')).users.User();

            user.fname = profile.name.givenName;
            user.lname = profile.name.familyName;
            user.email = email;
            user.oauths.google = token;

            // Add User
            yield req.app.get('sh').users.Repo.add(user);
        }

        req.user = user;
        req.flash('success', 'Welcome to Singlehood');

        // Start GDrive syncing Process
        // This is async process
        yield req.app.get('sh').sync.GDrive(user._id);

        // Redirect to dashboard
        res.redirect('/dashboard');
    } catch (e) {
        next(e);
    }
}));

module.exports = router;
