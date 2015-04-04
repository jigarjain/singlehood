/**
 * @module  google.drive
 */

module.exports = function (cfg) {
    var google = require('googleapis');
    var _      = require('lodash');
    var OAuth2 = google.auth.OAuth2;

    var auth = new OAuth2(
            cfg.google.clientId,
            cfg.google.clientSecret,
            cfg.baseurl + cfg.google.callbackUrl
        );

    /**
     * @class Drive
     */
    function Drive(token) {
        auth.credentials = token;

        /** @type {Object} Initialized instance of google.Drive() */
        this.drive = google.drive({
            version: 'v2',
            auth: auth
        });
    }

    Drive.prototype = {
        /**
         * Returns list of all the user files
         *
         * @param  {Object} params Additional params like search query can be passed
         *
         * @return {Object}        Returns Promise which resolves to object of
         *                         type
         *  {
         *    "kind"          : "drive#fileList",
         *    "etag"          : etag,
         *    "selfLink"      : string,
         *    "nextPageToken" : string,
         *    "nextLink"      : string,
         *    "items"         : [
         *          files Resource
         *    ]
         *  }
         *
         */
        'getAllFiles': function (params) {
            var that = this;
            if (typeof params === 'undefined') {
                params = {};
            }

            params = _.extend(params, {
                'corpus'  : 'DOMAIN',
                'trashed' : 'false'
            });

            return new Promise(function (resolve, reject) {
                that.drive.files.list(params, function (err, res) {
                    if (err) {
                        return reject (err);
                    }

                    resolve(res);
                });
            });
        },

        /**
         * Given a fileId, it fetches a file from Drive
         *
         * @param  {String} fileId
         *
         * @return {Object}        Returns a promise which resolves to file
         *                         object
         * {
         *     "kind": "drive#file",
         *     "id": string,
         *     "etag": etag,
         *     "selfLink": string,
         *     "webContentLink": string,
         *     "webViewLink": string,
         *     "alternateLink": string,
         *     "embedLink": string,
         *     "openWithLinks": {
         *       (key): string
         *     },
         *     "defaultOpenWithLink": string,
         *     "iconLink": string,
         *     "thumbnailLink": string,
         *     "thumbnail": {
         *       "image": bytes,
         *       "mimeType": string
         *     },
         *     "title": string,
         *     "mimeType": string,
         *     "description": string,
         *     "labels": {
         *       "starred": boolean,
         *       "hidden": boolean,
         *       "trashed": boolean,
         *       "restricted": boolean,
         *       "viewed": boolean
         *     },
         *     "createdDate": datetime,
         *     "modifiedDate": datetime,
         *     "modifiedByMeDate": datetime,
         *     "lastViewedByMeDate": datetime,
         *     "markedViewedByMeDate": datetime,
         *     "sharedWithMeDate": datetime,
         *     "version": long,
         *     "sharingUser": {
         *       "kind": "drive#user",
         *       "displayName": string,
         *       "picture": {
         *         "url": string
         *       },
         *       "isAuthenticatedUser": boolean,
         *       "permissionId": string,
         *       "emailAddress": string
         *     },
         *     "parents": [
         *       parents Resource
         *     ],
         *     "downloadUrl": string,
         *     "exportLinks": {
         *       (key): string
         *     },
         *     "indexableText": {
         *       "text": string
         *     },
         *     "userPermission": permissions Resource,
         *     "permissions": [
         *       permissions Resource
         *     ],
         *     "originalFilename": string,
         *     "fileExtension": string,
         *     "md5Checksum": string,
         *     "fileSize": long,
         *     "quotaBytesUsed": long,
         *     "ownerNames": [
         *       string
         *     ],
         *     "owners": [
         *       {
         *         "kind": "drive#user",
         *         "displayName": string,
         *         "picture": {
         *           "url": string
         *         },
         *         "isAuthenticatedUser": boolean,
         *         "permissionId": string,
         *         "emailAddress": string
         *       }
         *     ],
         *     "lastModifyingUserName": string,
         *     "lastModifyingUser": {
         *       "kind": "drive#user",
         *       "displayName": string,
         *       "picture": {
         *         "url": string
         *       },
         *       "isAuthenticatedUser": boolean,
         *       "permissionId": string,
         *       "emailAddress": string
         *     },
         *     "editable": boolean,
         *     "copyable": boolean,
         *     "writersCanShare": boolean,
         *     "shared": boolean,
         *     "explicitlyTrashed": boolean,
         *     "appDataContents": boolean,
         *     "headRevisionId": string,
         *     "properties": [
         *       properties Resource
         *     ],
         *     "folderColorRgb": string,
         *     "imageMediaMetadata": {
         *       "width": integer,
         *       "height": integer,
         *       "rotation": integer,
         *       "location": {
         *         "latitude": double,
         *         "longitude": double,
         *         "altitude": double
         *       },
         *       "date": string,
         *       "cameraMake": string,
         *       "cameraModel": string,
         *       "exposureTime": float,
         *       "aperture": float,
         *       "flashUsed": boolean,
         *       "focalLength": float,
         *       "isoSpeed": integer,
         *       "meteringMode": string,
         *       "sensor": string,
         *       "exposureMode": string,
         *       "colorSpace": string,
         *       "whiteBalance": string,
         *       "exposureBias": float,
         *       "maxApertureValue": float,
         *       "subjectDistance": integer,
         *       "lens": string
         *     },
         *     "videoMediaMetadata": {
         *       "width": integer,
         *       "height": integer,
         *       "durationMillis": long
         *     }
         *   }
         */
        'getFile': function (fileId) {
            var that = this;
            var params = {
                'fileId': fileId
            };

            return new Promise(function (resolve, reject) {
                that.drive.files.get(params, function (err, res) {
                    if (err) {
                        return reject (err);
                    }

                    resolve(res);
                });
            });
        },

        /**
         * Trashes a file identified by `fileId`
         *
         * @param  {String} fileId
         *
         * @return {Object}        Returns a Promise which resolves to object of
         *                         following type
         * {
         *     "kind": "drive#file",
         *     "id": string,
         *     "etag": etag,
         *     "selfLink": string,
         *     "webContentLink": string,
         *     "webViewLink": string,
         *     "alternateLink": string,
         *     "embedLink": string,
         *     "openWithLinks": {
         *       (key): string
         *     },
         *     "defaultOpenWithLink": string,
         *     "iconLink": string,
         *     "thumbnailLink": string,
         *     "thumbnail": {
         *       "image": bytes,
         *       "mimeType": string
         *     },
         *     "title": string,
         *     "mimeType": string,
         *     "description": string,
         *     "labels": {
         *       "starred": boolean,
         *       "hidden": boolean,
         *       "trashed": boolean,
         *       "restricted": boolean,
         *       "viewed": boolean
         *     },
         *     "createdDate": datetime,
         *     "modifiedDate": datetime,
         *     "modifiedByMeDate": datetime,
         *     "lastViewedByMeDate": datetime,
         *     "markedViewedByMeDate": datetime,
         *     "sharedWithMeDate": datetime,
         *     "version": long,
         *     "sharingUser": {
         *       "kind": "drive#user",
         *       "displayName": string,
         *       "picture": {
         *         "url": string
         *       },
         *       "isAuthenticatedUser": boolean,
         *       "permissionId": string,
         *       "emailAddress": string
         *     },
         *     "parents": [
         *       parents Resource
         *     ],
         *     "downloadUrl": string,
         *     "exportLinks": {
         *       (key): string
         *     },
         *     "indexableText": {
         *       "text": string
         *     },
         *     "userPermission": permissions Resource,
         *     "permissions": [
         *       permissions Resource
         *     ],
         *     "originalFilename": string,
         *     "fileExtension": string,
         *     "md5Checksum": string,
         *     "fileSize": long,
         *     "quotaBytesUsed": long,
         *     "ownerNames": [
         *       string
         *     ],
         *     "owners": [
         *       {
         *         "kind": "drive#user",
         *         "displayName": string,
         *         "picture": {
         *           "url": string
         *         },
         *         "isAuthenticatedUser": boolean,
         *         "permissionId": string,
         *         "emailAddress": string
         *       }
         *     ],
         *     "lastModifyingUserName": string,
         *     "lastModifyingUser": {
         *       "kind": "drive#user",
         *       "displayName": string,
         *       "picture": {
         *         "url": string
         *       },
         *       "isAuthenticatedUser": boolean,
         *       "permissionId": string,
         *       "emailAddress": string
         *     },
         *     "editable": boolean,
         *     "copyable": boolean,
         *     "writersCanShare": boolean,
         *     "shared": boolean,
         *     "explicitlyTrashed": boolean,
         *     "appDataContents": boolean,
         *     "headRevisionId": string,
         *     "properties": [
         *       properties Resource
         *     ],
         *     "folderColorRgb": string,
         *     "imageMediaMetadata": {
         *       "width": integer,
         *       "height": integer,
         *       "rotation": integer,
         *       "location": {
         *         "latitude": double,
         *         "longitude": double,
         *         "altitude": double
         *       },
         *       "date": string,
         *       "cameraMake": string,
         *       "cameraModel": string,
         *       "exposureTime": float,
         *       "aperture": float,
         *       "flashUsed": boolean,
         *       "focalLength": float,
         *       "isoSpeed": integer,
         *       "meteringMode": string,
         *       "sensor": string,
         *       "exposureMode": string,
         *       "colorSpace": string,
         *       "whiteBalance": string,
         *       "exposureBias": float,
         *       "maxApertureValue": float,
         *       "subjectDistance": integer,
         *       "lens": string
         *     },
         *     "videoMediaMetadata": {
         *       "width": integer,
         *       "height": integer,
         *       "durationMillis": long
         *     }
         *   }
         */
        'trashFile': function (fileId) {
            var that = this;
            var params = {
                'fileId': fileId
            };

            return new Promise(function (resolve, reject) {
                that.drive.files.trash(params, function (err, res) {
                    if (err) {
                        return reject (err);
                    }

                    resolve(res);
                });
            });
        },

        'uploadFile': function (title, content, mime) {
            var that = this;
            var params = {
                resource: {
                    title: title,
                    mimeType: mime
                },
                media: {
                    mimeType: mime,
                    body: content
                }
            };

            return new Promise(function (resolve, reject) {
                that.drive.files.insert(params, function (err, res) {
                    if (err) {
                        return reject(err);
                    }

                    resolve(res);
                });
            });
        }
    };

    return {
        'Drive': Drive
    };
};