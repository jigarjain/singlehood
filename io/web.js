var app        = require('./common'),
    express    = require('express'),
    exphbs     = require('express-handlebars'),
    session    = require('express-session'),
    flash      = require('connect-flash'),
    MongoStore = require('connect-mongo')(session),
    qs         = require('querystring'),
    compress   = require('compression'),
    _          = require('lodash');

// Use gzip compression
app.use(compress());

// serve static files
app.use('/static', express.static(app.get('config').paths.static));


// Use session
app.use(session({
    secret           : app.get('config').web.session.secret,
    resave           : true,
    saveUninitialized: true,
    store            : new MongoStore({
        url: app.get('config').web.session.mongo
    })
}));

// Use session flash vars
app.use(flash());

// Session user mods
app.use(function (req, res, next) {
    Object.defineProperties(req, {
        'user': {
            'get': function () {
                if (req.session) {
                    return req.session._user ? _.extend(new (app.get('sh')).users.User(), req.session._user) : null;
                }

                return null;
            },

            'set': function (user) {
                req.session._user = user;
            }
        }
    });

    next();
});

// Storing session in locals
app.use(function(req, res, next){
    res.locals.user = req.user;
    res.locals.version = require('../package.json').version;
    next();
});

// Set views dir
app.set('views', app.get('config').paths.templates);

// Create Express handlebar instance
var hbs = exphbs.create({
    layoutsDir:  app.get('config').paths.templates + '/layouts',
    defaultLayout: 'default',
    helpers: require('./helpers/view').helpers,
    partialsDir: [
        app.get('config').paths.templates + '/partials/'
    ]
});

// Initialize engine
app.engine('handlebars', hbs.engine);

// Set engine
app.set('view engine', 'handlebars');

// Set context in helpers
app.use(require('./helpers/view').setContext);

// common routes
require('./routes')(app);

// register 500
app.use(function (err, req, res, next) {
    if (!err) {
        return next();
    }

    console.log(err.stack);

    if (err.status === 401) {
        return res.redirect('/?' + qs.stringify({
            'r': req.originalUrl
        }));
    }

    if (err.status === 403) {
        res.status(403);
        return res.render('errors/403', {
            'title': 'This page is forbidden'
        });
    }

    if (err.status === 400) {
        res.status(400);
        return res.render('errors/400', {
            'title': 'Bad data'
        });
    }

    res.status(500);
    res.render('errors/500', {
        'title': 'Something went wronng'
    });
});

// register 404
app.use(function (req, res) {
    res.status(404);
    res.render('errors/404', {
        'title': 'Page not found'
    });
});


app.listen(app.get('config').web.port);
console.log('Listening on port: ', app.get('config').web.port);
