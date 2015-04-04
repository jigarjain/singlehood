/*jshint camelcase: false */
var express   = require('express'),
    wrap      = require('co-express'),
    _         = require('lodash'),
    router    = express.Router();

router.get('/dropbox', wrap(function* (req, res, next) {
    if (! req.user) {
        var err = {};
        err.status = 401;
        return next(err);
    }

    try {
        var userId = req.app.get('sh').db.ObjectId(req.user._id);
        var pageData = {};

        if (req.user.oauths.dropbox) {
            pageData.files = yield req.app.get('sh').file.Repo.getByUserId(userId, 'dropbox');

            pageData.files = _.filter(pageData.files, function (f) {
                return  !f.is_dir;
            });
        } else {
            var dropboxAuth = yield req.app.get('sh').services.dropbox.getAuthUrl();

            req.session.dropboxRequestToken = {
                'oauth_token': dropboxAuth.oauth_token,
                'oauth_token_secret': dropboxAuth.oauth_token_secret
            };

            pageData.dropboxAuthURL = dropboxAuth.authorize_url;
        }

        pageData = _.extend(pageData, {
            'title': 'Dropbox',
            'js': [
                '/static/thirdparty/footable/dist/footable.all.min.js'
            ],
            'css': [
                '/static/thirdparty/footable/css/footable.core.min.css',
            ]
        });

        res.render('dropbox', pageData);

        // Start  Dropbox syncing
        req.app.get('sh').sync.Dropbox(userId);
    } catch (e) {
        return next(e);
    }
}));


router.get('/dropbox/callback', wrap(function* (req, res, next) {
    if (! req.user) {
        var err = {};
        err.status = 401;
        return next(err);
    }

    try {
        if (req.query.not_approved === 'true') {
            return res.redirect('/services/dropbox');
        }

        // Get AccessToken
        var requestToken = req.session.dropboxRequestToken;
        req.session.dropboxRequestToken = null;

        var accessToken = yield req.app.get('sh').services.dropbox.getAccessToken(requestToken);

        // Save AccessToken
        var userId = req.app.get('sh').db.ObjectId(req.user._id);
        var user = yield req.app.get('sh').users.Repo.getById(userId);

        user.oauths.dropbox = {
            'access_token': accessToken
        };

        yield req.app.get('sh').users.Repo.update(user);
        req.user = user;

        // Start  Dropbox syncing
        req.app.get('sh').sync.Dropbox(userId);

        res.redirect('/services/dropbox');
    } catch (e) {
        return next(e);
    }
}));

module.exports = router;
