var _ = require('lodash');

var cfg = {
    'baseurl'     : 'http://singlehood.io',
    'mongo'       : process.env.MONGO || 'singlehood',
    'defaultUser': {
        'email'   : 'jigar@sample.com',
        'password': 'test'
    },
    'paths': {
        'tmp'      : __dirname + '/../io/_tmp',
        'static'   : __dirname + '/../io/static',
        'templates': __dirname + '/../io/static/views'
    },
    'web': {
        'port': 8765,
        'session': {
            'secret': 's1ng13h00d',
            'mongo' : 'mongodb://127.0.0.1/sess_singlehood'
        },
    },
    'google': {
        'clientId'     : '410523462361-a8a84thfc2bdana2dc1uvgm5gbj8sntg.apps.googleusercontent.com',
        'clientSecret' : '9YNj43Qs9Q8blZArF64cZS22',
        'callbackUrl'  : '/login/google/callback',
        'scope'        : [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/drive'
        ]
    },
    'dropbox': {
        'appKey'      : 'iq7e4ucco5y6ust',
        'appSecret'   : 'c565erpm7v07ay0',
        'callbackUrl' : '/services/dropbox/callback',
        'root'        : 'dropbox'
    }
};

var env = process.env.NODE_ENV;
module.exports = env ? _.extend(cfg, require('./' + env)) : cfg;

