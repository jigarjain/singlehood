module.exports = function (cfg, db) {
    var _ = require('lodash');

    var services = [
        'gdrive',
        'paypal'
    ];

    var expose = {};

    _.each(services, function (m) {
        expose[m] = require('./' + m)(cfg, db);
    });

    return expose;
};