/**
 * @module File
 */

module.exports = function (cfg, db) {
    var _        = require('lodash'),
        mixins   = require('../mixins')(cfg, db),
        Storable = mixins.Storable,
        coll     = db.collection('files');

    function File () {
        Storable.call(this);

        /**
         * The file belongs to which service
         * Possible values: gdrive, dropbox, onedrive
         *
         * @type {String}
         */
        this.source = null;

        /**
         * The id of User to whom the file belongs
         *
         * @type {Object}
         */
        this.userId = null;

        /**
         * The file resource which is received from various service provider
         * Cannot be a standard type
         *
         * @type {Object}
         */
        this.fileMeta = {};
    }

    File.prototype = _.extend({}, Storable.prototype);

    function Repo () {}

    Repo.add = function (file) {
        return new Promise(function (resolve, reject) {
            file.touch();
            coll.insert(file, function (err, doc) {
                if (err) {
                    return reject(err);
                }

                file._id = doc._id;
                resolve(file._id);
            });
        });
    };

    Repo.update = function (file) {
        return new Promise(function (resolve, reject) {
            file.touch();
            coll.update({
                '_id': file._id
            }, file, function (err) {
                if (err) {
                    reject(err);
                }

                resolve(true);
            });
        });
    };
};