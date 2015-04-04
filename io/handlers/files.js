/* jshint camelcase: false */
var express   = require('express'),
    wrap      = require('co-express'),
    fs        = require('fs'),
    router    = express.Router();

router.post('/:id/delete/', wrap(function* (req, res, next) {
    if (! req.user) {
        var err = {};
        err.status = 401;
        return next(err);
    }

    try {
        var result = {
            'status': false,
            'msg': null
        };

        var fileId = req.app.get('sh').db.ObjectId(req.params.id);
        var userId = req.app.get('sh').db.ObjectId(req.user._id);

        // Get all user files
        var file = yield req.app.get('sh').file.Repo.getById(fileId);

        // Check file exists or not
        if (! file) {
            result.msg = 'File does not exist';
            return res.jsonp(result);
        }

        // Check whether current user is owner of the file or not
        if (String(file.userId) !== String(userId)) {
            result.msg = 'You are not authorized to delete the file';
            return res.jsonp(result);
        }

        // Delete the file from service
        if (file.source === 'gdrive') {
            var drive = new (req.app.get('sh')).services.google.Drive(req.user.oauths.google);
            yield drive.trashFile(file.fileMeta.id);
        } else {
            console.log(req.user.oauths.dropbox);
            var dropbox = new (req.app.get('sh')).services.dropbox.Client(req.user.oauths.dropbox.access_token);
            yield dropbox.trashFile(file.fileMeta.path);
        }

        // Delete the file from local
        yield req.app.get('sh').file.Repo.delete(file._id);

        result = {
            status: 'true',
            msg: 'File successfully deleted'
        };

        res.jsonp(result);
    } catch (e) {
        var result = {
            'status': false,
            'msg': e
        };
        res.jsonp(result);
        return next(e);
    }
}));

router.post('/upload', function (req, res, next) {
    try {
        if ('file' in req.files) {
            var title = req.files.file.originalname;
            var mime = req.files.file.mimetype;

            fs.readFile(req.files.file.path, function (err, data) {
                if (err) {
                    return next(err);
                }

                if (req.body.source === 'gdrive') {
                    var drive = new (req.app.get('sh')).services.google.Drive(req.user.oauths.google);
                    drive.uploadFile(title, data, mime);
                    res.redirect('/dashboard');
                } else {
                    var dropbox = new (req.app.get('sh')).services.dropbox.Client(req.user.oauths.dropbox.access_token);
                    dropbox.uploadFile(title, data);
                    res.redirect('/services/dropbox');
                }
            });
        }
    } catch (e) {
        next(e);
    }
});

module.exports = router;
