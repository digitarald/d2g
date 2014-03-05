'use strict';

/**
 * Module dependencies.
 */

var express = require('express');
var MongoStore = require('connect-mongo')(express);
var flash = require('express-flash');
var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');
var expressValidator = require('express-validator');
var webpack = require('webpack');
var webpackMiddleware = require("webpack-dev-middleware");
var webpackConfig = require('./webpack.config.js');

// Controllers

var homeController = require('./controllers/home');
var userController = require('./controllers/user');
var manageController = require('./controllers/manage');

/**
 * API keys + Passport configuration.
 */

var secrets = require('./config/secrets');
var passportConf = require('./config/passport');

/**
 * Create Express server.
 */

var app = express();

/**
 * Mongoose configuration.
 */

mongoose.connect(secrets.db);
mongoose.connection.on('error', function() {
  console.error('✗ MongoDB Connection Error. Please make sure MongoDB is running.');
});

/**
 * Express configuration.
 */

var hour = 3600000;
var day = (hour * 24);
var week = (day * 7);
var month = (day * 30);

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.locals.pretty = true;
app.use(express.compress());
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.cookieParser());
app.use(express.json());
app.use(express.urlencoded());
app.use(expressValidator());
app.use(express.methodOverride());
app.use(express.bodyParser());
app.use(express.session({
  secret: secrets.sessionSecret,
  store: new MongoStore({
    db: mongoose.connection.db,
    auto_reconnect: true
  })
}));
//app.use(express.csrf());
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
  res.locals.user = req.user;
  //res.locals.token = req.csrfToken();
  res.locals.secrets = secrets;
  next();
});
app.use(flash());
app.use(app.router);
app.use(webpackMiddleware(webpack(webpackConfig), {
  publicPath: '/' + webpackConfig.output.publicPath,
  stats: {
    colors: true
  }
}));
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: week
}));
app.use(function(req, res) {
  res.status(404).send('Not found :(');
});
app.use(express.errorHandler());


/**
 * Controller routes.
 */

// Home

app.get('/', homeController.getIndex);

// User

app.get('/login', userController.getLogin);
app.get('/logout', userController.logout);
app.get('/account', passportConf.isAuthenticated, userController.getAccount);
app.post('/account/profile', passportConf.isAuthenticated, userController.postUpdateProfile);
app.post('/account/delete', passportConf.isAuthenticated, userController.postDeleteAccount);
app.get('/account/unlink/:provider', passportConf.isAuthenticated, userController.getOauthUnlink);

// Manage

app.get('/manage', manageController.getIndex);
// app.get('/manage/project', manageController.getNewProject);
app.post('/manage/project', manageController.uploadApp);
// app.post('/manage/project', manageController.postNewProject);
// app.get('/manage/project/:id', manageController.getProject);
// app.get('/manage/project/:project_id/build', manageController.getNewBuild);
// app.get('/manage/project/:project_id/build/:build_id', manageController.getBuild);

// OAuth

app.get('/auth/github', passport.authenticate('github'));
app.get('/auth/github/callback', passport.authenticate('github', {
  successRedirect: '/',
  failureRedirect: '/login'
}));
app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback', passport.authenticate('twitter', {
  successRedirect: '/',
  failureRedirect: '/login'
}));
app.post('/auth/browserid', passport.authenticate('persona', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

/**
 * Start Express server.
 */

app.listen(app.get('port'), function() {
  console.log("✔ Express server listening on port %d in %s mode", app.get('port'), app.settings.env);
});