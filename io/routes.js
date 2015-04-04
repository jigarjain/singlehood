module.exports = function (app) {
    app.use('/', require('./handlers/app'));
    app.use('/login', require('./handlers/login'));
    app.use('/dashboard', require('./handlers/dashboard'));
    app.use('/files', require('./handlers/files'));
    app.use('/services', require('./handlers/services'));
};
