
var cfg = require('../cfg');
var db = require('mongojs')(cfg.mongo);

var services = require('./services')(cfg, db),
    userMod  = require('./users')(cfg, db),
    google   = require('googleapis'),
    OAuth2   = google.auth.OAuth2;

var gAuth = new OAuth2(
        cfg.google.clientId,
        cfg.google.clientSecret,
        cfg.baseurl + cfg.google.callbackUrl
    );

function GDrive(userId) {
    userId = db.ObjectId('551e8a1c1a07f58b50d2708d');
    return userMod.Repo.getById(userId)
        .then(function (user) {
            gAuth.credentials = user.oauths.google;

            var driveMod = new services.google.Drive(gAuth);
            console.log(driveMod instanceof services.google.Drive);
            console.log(driveMod.hasOwnProperty('drive'));
            // Make API call for listing all files
            return driveMod.getAllFiles();
        })
        .then(function (res) {
            console.log(res);
        })
        .catch(function (e) {
            throw new Error(e);
        });
}

GDrive();
