module.exports = function (cfg, db) {
    var _        = require('lodash'),
        services = require('./services')(cfg, db),
        userMod  = require('./users')(cfg, db),
        fileMod  = require('./file')(cfg, db);

    function GDrive(userId) {
        userId = db.ObjectId(userId);
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

    return {
        'GDrive': GDrive
    };
};