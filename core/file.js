/**
 * @module file
 */

module.exports = function (cfg, db) {
    var _        = require('lodash'),
        mixins   = require('./mixins')(cfg, db),
        Storable = mixins.Storable,
        coll     = db.collection('files');

    /**
     * @constructor
     * @class file.File
     * @uses mixins.Storable
     */
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

    /**
     * @constructor
     * @class file.Repo
     */
    function Repo () {}

    /**
     * Add a file to db
     *
     * @static
     * @method add
     * @for    file.Repo
     * @param  {file.File} file
     * @return {Promise}   Inserted doc id
     */
    Repo.add = function (file) {
        var source, key;
        if (file.source === 'gdrive') {
            source = 'gdrive';
            key     = file.fileMeta.id;
        } else {
            source = 'dropbox';
            key     = file.fileMeta.path;
        }


        return Repo.getBySourceKey(source, key)
            .then(function (res) {
                if (res) {
                    return Repo.update(file);
                } else {
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
                }
            });

    };

    /**
     * Update an file in db
     *
     * @static
     * @method update
     * @for    file.Repo
     * @param  {file.File} event
     * @return {Promise}      Boolean acknowledgment
     */
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

    /**
     * Gets all file of a user
     *
     * @static
     * @method getByUserId
     * @for    file.Repo
     * @param  {Object} User Id
     * @return {Promise} {{#crossLink "file.File"}}file{{/crossLink}}
     */
    Repo.getByUserId = function (userId, source) {
        var searchParam = {};
        searchParam.userId = userId;

        if (source) {
            searchParam.source = source;
        }

        return new Promise(function (resolve, reject) {
            coll.find(searchParam, function (err, docs) {
                if (err) {
                    reject(err);
                }

                var files = docs ? docs.map(function (doc) {
                    return _.create(new File(), doc);
                }) : [];

                resolve(files);
            });
        });
    };

    /**
     * Gets a file by id
     *
     * @static
     * @method getById
     * @for    file.Repo
     * @param  {Object} FileId
     * @return {Promise} {{#crossLink "file.File"}}file{{/crossLink}}
     */
    Repo.getById = function (id) {
        return new Promise(function (resolve, reject) {
            coll.findOne({
                '_id': id
            }, function (err, doc) {
                if (err) {
                    reject(err);
                }

                resolve(doc ? _.create(new File(), doc) : null);
            });
        });
    };

    /**
     * Gets a file by id
     *
     * @static
     * @method getById
     * @for    file.Repo
     * @param  {Object} FileId
     * @return {Promise} {{#crossLink "file.File"}}file{{/crossLink}}
     */
    Repo.getBySourceKey = function (src, key) {
        return new Promise(function (resolve, reject) {
            var searchParam;
            if (src === 'gdrive') {
                searchParam = {
                    'source': 'gdrive',
                    'fileMeta.id': key
                };
            } else {
                searchParam = {
                    'source': 'dropbox',
                    'fileMeta.path': key
                };
            }

            coll.findOne(searchParam, function (err, doc) {
                if (err) {
                    reject(err);
                }

                resolve(doc ? _.create(new File(), doc) : null);
            });
        });
    };


    /**
     * Delete a file
     *
     * @static
     * @method delete
     * @for    file.Repo
     * @param  {Object} File Id
     * @return {Promise} Boolean acknowledgement
     */
    Repo.delete = function (id) {
        return new Promise(function (resolve, reject) {
            coll.remove({
                '_id': id
            }, function (err) {
                if (err) {
                    reject(err);
                }

                resolve(true);
            });
        });
    };

    return {
        'File': File,
        'Repo': Repo
    };
};