/*jshint camelcase: false */
module.exports = function (cfg) {
    var dbox = require('dbox');

    var app   = dbox.app({
        'app_key'    : cfg.dropbox.appKey,
        'app_secret' : cfg.dropbox.appSecret,
        'root'       : cfg.dropbox.root,
    });

    function getAuthUrl() {
        return new Promise(function (resolve, reject) {
            app.requesttoken(function(status, requestToken) {
                if (status !== 200) {
                    return reject('Coudln\'t fetch request token');
                }

                requestToken.authorize_url = requestToken.authorize_url + '&oauth_callback=';
                requestToken.authorize_url = requestToken.authorize_url + cfg.baseurl + cfg.dropbox.callbackUrl;
                resolve(requestToken);
            });
        });
    }

    function getAccessToken(requestToken) {
        return new Promise(function (resolve, reject) {
            app.accesstoken(requestToken, function(status, accessToken) {
                if (status !== 200) {
                    return reject('Coudln\'t fetch access token');
                }

                resolve(accessToken);
            });
        });
    }

    function Client(accessToken) {
        this.client = app.client(accessToken);
    }

    Client.prototype = {
        'getFile': function (path) {
            var that = this;
            return new Promise(function (resolve, reject) {
                that.client.metadata(path, {}, function(status, data){
                    if (status !== 200) {
                        return reject('Coudln\'t fetch single file');
                    }

                    resolve(data);
                });
            });
        },

        'getAllFiles': function() {
            var that = this;
            return new Promise(function (resolve, reject) {
                that.client.readdir('/',
                    {
                        'recursive': true,
                        'details': true
                    },
                    function(status, files) {

                        if (status !== 200) {
                            return reject('Coudln\'t fetch all files');
                        }

                        resolve(files);
                });
            });
        },

        'trashFile': function(path) {
            var that = this;
            return new Promise(function (resolve, reject) {
                console.log('here');
                that.client.rm(path, function(status, res) {
                    console.log(status);
                    console.log(res);
                    if (status !== 200) {
                        return reject('Coudln\'t delete file');
                    }

                    resolve(res);
                });
            });
        },

        'uploadFile': function (filePath, content) {
            var that = this;
            return new Promise(function (resolve, reject) {
                that.client.put(filePath, content, function(status, res) {
                    console.log(status);
                    console.log(res);
                    if (status !== 200) {
                        return reject('Coudln\'t upload files');
                    }

                    resolve(res);
                });
            });
        }
    };

    return {
        'getAuthUrl'     : getAuthUrl,
        'getAccessToken' : getAccessToken,
        'Client'         : Client
    };
};