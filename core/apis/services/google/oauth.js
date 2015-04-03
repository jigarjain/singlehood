/**
 * @module  google.oauth
 */

module.exports = function (cfg) {
    var google = require('googleapis');
    var OAuth2 = google.auth.OAuth2;

    var auth = new OAuth2(
            cfg.google.clientId,
            cfg.google.clientSecret,
            cfg.google.callbackUrl
        );

    function OAuth() {}

    /**
     * Returns a authentication URL where user needs to be redirected
     *
     * @return {[type]} [description]
     */
    OAuth.getAuthUrl = function () {
        return auth.generateAuthUrl({ scope: cfg.google.scope });
    };

    /**
     * Returns Oauth tokens which are required for further requests
     *
     * @param  {String} code Code which is passed when user was redirected back
     *
     * @return {Object}      Returns promise which resolves to Oauth tokens
     */
    OAuth.getTokens = function (code) {
        return new Promise(function (resolve, reject) {
            auth.getToken(code, function(err, tokens) {
                if (err) {
                  return reject(err);
                }

                resolve(tokens);
            });
        });
    };

    return {
        'Oauth': OAuth
    };
};