/**
 * @module  google.plus
 */

module.exports = function (cfg) {
    var google = require('googleapis');
    var OAuth2 = google.auth.OAuth2;

    var auth = new OAuth2(
            cfg.google.clientId,
            cfg.google.clientSecret,
            cfg.baseurl + cfg.google.callbackUrl
        );

    /**
     * @class Plus
     */
    function Plus(token) {

        auth.credentials = token;

        /** @type {Object} Initialized instance of google.Plus() */
        this.plus = google.plus({
            version: 'v1',
            auth: auth
        });
    }

    Plus.prototype = {
        'getProfile': function (profileId) {
            var that = this;
            return new Promise(function (resolve, reject) {
                var params = {
                    'userId': profileId
                };

                that.plus.people.get(params, function(err, profile) {
                    if (err) {
                        return reject(err);
                    }

                    resolve(profile);
                });
            });
        }
    };

    return {
        'Plus': Plus
    };
};