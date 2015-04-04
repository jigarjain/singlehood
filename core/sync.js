/* jshint camelcase: false */
module.exports = function (cfg, db) {
    var _        = require('lodash'),
        services = require('./services')(cfg, db),
        userMod  = require('./users')(cfg, db),
        fileMod  = require('./file')(cfg, db);

    function GDrive(userId) {
        return userMod.Repo.getById(userId)
            .then(function (user) {
                var drive = new services.google.Drive(user.oauths.google);

                // Make API call for listing all files
                return drive.getAllFiles();
            })
            .then(function (res) {
                var files = res.items;

                // Collect tasks for adding multiple files to DB
                var fileTasks = _.collect(files, function (f) {
                    var file = new fileMod.File();
                    file.source = 'gdrive';
                    file.userId = userId;
                    file.fileMeta = {
                        'id'                   : f.id,
                        'selfLink'             : f.selfLink,
                        'alternateLink'        : f.alternateLink,
                        'iconLink'             : f.iconLink,
                        'title'                : f.title,
                        'createdDate'          : f.createdDate,
                        'modifiedDate'         : f.modifiedDate,
                        'lastViewedByMeDate'   : f.lastViewedByMeDate ,
                        'markedViewedByMeDate' : f.markedViewedByMeDate,
                        'parents'              : f.parents,
                    };

                    return fileMod.Repo.add(file);
                });

                return Promise.all(fileTasks);
            })
            .catch(function (e) {
                throw new Error(e);
            });
    }

    function Dropbox(userId) {
        return userMod.Repo.getById(userId)
            .then(function (user) {
                var dropbox = new services.dropbox.Client(user.oauths.dropbox.access_token);
                // Make API call for listing all files
                return dropbox.getAllFiles();
            })
            .then(function (files) {
                // Collect tasks for adding multiple files to DB
                var fileTasks = _.collect(files, function (f) {
                    var file = new fileMod.File();
                    file.source = 'dropbox';
                    file.userId = userId;
                    file.fileMeta = {
                        'path'      : f.path,
                        'modified'  : f.modified,
                        'size'      : f.size,
                        'is_dir'    : f.is_dir,
                        'mime_type' : f.mime_type,
                    };

                    return fileMod.Repo.add(file);
                });

                return Promise.all(fileTasks);
            })
            .catch(function (e) {
                throw new Error(e);
            });
    }

    return {
        'GDrive'  : GDrive,
        'Dropbox' : Dropbox
    };
};