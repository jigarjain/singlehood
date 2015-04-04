var shCore     = require('../core'),
    express    = require('express'),
    bodyParser = require('body-parser'),
    multer     = require('multer'),
    config     = require('../cfg'),
    app        = express();

// Set config
app.set('config', config);

// make express aware that it's sitting behind a proxy, ie trust the X-Forwarded-* header
app.enable('trust proxy');

// Set req._data = {}
app.use(function (req, res, next) {
    req._data = {};
    next();
});

// Parse POST data
app.use(bodyParser.urlencoded({
    extended: true
}));

// Parse multipart
app.use(multer({
    'dest': config.paths.tmp
}));

// INIT singleHood core
var sh = shCore(config);
app.set('sh', sh);

module.exports = app;
