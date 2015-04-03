/**
 * @module users
 */
module.exports = function (cfg, db) {
    var mixins   = require('./mixins')(cfg, db),
        _        = require('lodash'),
        Contact  = mixins.Contact,
        Storable = mixins.Storable,
        coll     = db.collection('users');


    /**
     * @constructor
     * @class users.User
     * @uses mixins.Contact
     * @uses mixins.Storable
     */
    function User() {
        Contact.call(this);
        Storable.call(this);
        this._password = null;

        /**
         * The user's access level in the system. Options:
         * - admin
         * - user
         *
         * @property role
         * @type {String}
         * @default 'user'
         */
        this.role = 'user';

        /**
         * @property emailVerified
         * @type {Boolean}
         * @default false
         */
        this.emailVerified = false;

        /**
         * Contains associated oauth accounts.
         * Where `fbOauthData` is an
         * {{crossLink 'users.OauthData'}}OauthData{{/crossLink}} object
         *
         * @property oauths
         * @type {Object}
         */
        this.oauths = {};
    }
    User.prototype = _.extend({}, Contact.prototype);
    User.prototype = _.extend(User.prototype, Storable.prototype);

    /**
     * Oauth provider data for a user
     * @constructor
     * @class users.OauthData
     */
    function OauthData() {
        /**
         * Provider's unique user ID
         * @property id
         * @type {String}
         */
        this.id           = null;

        /**
         * Access token
         * @property token
         * @type {String}
         */
        this.token        = null;

        /**
         * Refresh token
         * @property refreshToken
         * @type {String}
         */
        this.refreshToken = null;

        /**
         * Access token expiry time
         * @property tokenExpiry
         * @type {Date}
         */
        this._tokenExpiry  = null;

        Object.defineProperties(this, {
            'tokenExpiry': {
                'set': function (time) {
                    this._tokenExpiry = time.getTime();
                },
                'get': function () {
                    return new Date(this._tokenExpiry);
                }
            }
        });
    }

    /**
     * @constructor
     * @class users.Repo
     */
    function Repo() {}

    Repo.add = function (user) {
        return this.getByEmail(user.email)
            .then(function (fetched) {
                return new Promise(function (resolve, reject) {
                    if (fetched) {
                        return reject(new Error(
                            'A user with this email already exists'
                        ));
                    }

                    user.touch();
                    // Proceed with insert
                    coll.insert(user, function (err, doc) {
                        if (err) {
                            reject(err);
                        }

                        user._id = doc._id;
                        resolve(user._id);
                    });
                });
            });
    };


    /**
     * Get user from database by ID
     *
     * @static
     * @method getById
     * @for    users.Repo
     * @param  {Object}  id
     * @return {Promise} A {{#crossLink "users.User"}}user{{/crossLink}}
     *                   object if found, else `null`
     */
    Repo.getById = function (id) {
        return new Promise(function (resolve, reject) {
            coll.findOne({
                '_id': id
            }, function (err, doc) {
                if (err) {
                    reject(err);
                }

                resolve(doc ? _.create(new User(), doc) : null);
            });
        });
    };


    /**
     * Get user from database by email address
     *
     * @static
     * @method getByEmail
     * @for    users.Repo
     * @param  {String}  email
     * @return {Promise} A {{#crossLink "users.User"}}user{{/crossLink}}
     *                   object if found, else `null`
     */
    Repo.getByEmail = function (email) {
        return new Promise(function (resolve, reject) {
            coll.findOne({
                'email': email
            }, function (err, doc) {
                if (err) {
                    reject(err, null);
                }

                resolve(doc ? _.create(new User(), doc) : null);
            });
        });
    };


    /**
     * Update a user. This will not update the following:
     * - email address
     *
     * @static
     * @method update
     * @for    users.Repo
     * @param  {users.User} user
     * @return {Promise} Boolean result
     */
    Repo.update = function (user) {
        return new Promise(function (resolve, reject) {
            user.touch();

            coll.update({
                '_id': user._id
            }, {'$set': user}, function (err) {
                if (err) {
                    return reject(err);
                }

                resolve(true);
            });
        });
    };


    return {
        'User'     : User,
        'OauthData': OauthData,
        'Repo'     : Repo
    };
};
