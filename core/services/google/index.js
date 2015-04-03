module.exports = function (cfg, db) {
    var _ = require('lodash');

    var services = [
        'oauth',
        'drive',
        'plus'
    ];

    var expose = {};

    _.each(services, function (m) {
        expose = _.extend(expose, require('./' + m)(cfg, db));
    });

    return expose;
};