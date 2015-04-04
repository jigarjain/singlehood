var express   = require('express'),
    wrap      = require('co-express'),
    _         = require('lodash'),
    router    = express.Router();

router.get('/', wrap(function* (req, res, next) {
    if (! req.user) {
        var err = {};
        err.status = 401;
        return next(err);
    }

    try {
        var userId = req.app.get('sh').db.ObjectId(req.user._id);

        // Get all user files
        var files = yield req.app.get('sh').file.Repo.getByUserId(userId, 'gdrive');

        files = _.filter(files, function (f) {
            return f.fileMeta.parents.length > 0;
        });

        var pageData = {
            'files': files,
            'title': 'Dashboard',
            'js': [
                '/static/thirdparty/footable/dist/footable.all.min.js'
            ],
            'css': [
                '/static/thirdparty/footable/css/footable.core.min.css',
            ]
        };

        res.render('dashboard', pageData);
    } catch (e) {
        return next(e);
    }
}));

module.exports = router;
