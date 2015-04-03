var _ = require('lodash');
var modules = [
    'services',
    'mixins',
    'users',
    'file',
    'sync',
];

function init(cfg) {
    var app = {};
    var db  = require('mongojs')(cfg.mongo);

    _.each(modules, function (m) {
        app[m] = require('./' + m)(cfg, db);
    });

    Object.defineProperties(app, {
        'db': {
            'get': function () {
                return db;
            }
        }
    });

    return app;
}

module.exports = init;
