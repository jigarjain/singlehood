module.exports = function (cfg, db) {
    var _ = require('lodash');

    var services = [
        'google',
        'dropbox'
    ];

    var expose = {};

    _.each(services, function (m) {
        expose[m] = require('./' + m)(cfg, db);
    });

    return expose;
};