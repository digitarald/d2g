'use strict';

var _ = require('underscore');
var passport = require('passport');
var PersonaStrategy = require('passport-persona').Strategy;
var GitHubStrategy = require('passport-github').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var User = require('../models/user');
var secrets = require('../config/secrets');
var config = require('../config/config');

passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.findById(id, function(err, user) {
		done(err, user);
	});
});

/**
 * Sign in with GitHub.
 */

passport.use(new GitHubStrategy(secrets.github, function(req, accessToken, refreshToken, profile, done) {
	if (req.user) {
		User.findOne({
			$or: [{
				github: profile.id
			}, {
				email: profile.email
			}]
		}, function(err, existingUser) {
			if (existingUser) {
				req.flash('errors', {
					msg: 'There is already a GitHub account that belongs to you. Sign in with that account or delete it, then link it with your current account.'
				});
				done(err);
			} else {
				User.findById(req.user.id, function(err, user) {
					user.github = profile.id;
					user.tokens.push({
						kind: 'github',
						accessToken: accessToken
					});
					user.profile.name = user.profile.name || profile.displayName;
					user.profile.picture = user.profile.picture || profile._json.avatar_url;
					user.profile.location = user.profile.location || profile._json.location;
					user.profile.website = user.profile.website || profile._json.blog;
					user.save(function(err) {
						req.flash('info', {
							msg: 'GitHub account has been linked.'
						});
						done(err, user);
					});
				});
			}
		});
	} else {
		User.findOne({
			github: profile.id
		}, function(err, existingUser) {
			if (existingUser) return done(null, existingUser);
			User.findOne({
				email: profile._json.email
			}, function(err, existingEmailUser) {
				if (existingEmailUser) {
					req.flash('errors', {
						msg: 'There is already an account using this email address. Sign in to that account and link it with GitHub manually from Account Settings.'
					});
					done(err);
				} else {
					var user = new User();
					user.email = profile._json.email;
					user.github = profile.id;
					user.tokens.push({
						kind: 'github',
						accessToken: accessToken
					});
					user.profile.name = profile.displayName;
					user.profile.picture = profile._json.avatar_url;
					user.profile.location = profile._json.location;
					user.profile.website = profile._json.blog;
					user.save(function(err) {
						done(err, user);
					});
				}
			});
		});
	}
}));

/**
 * Sign in with Twitter.
 */

passport.use(new TwitterStrategy(secrets.twitter, function(req, accessToken, tokenSecret, profile, done) {
	if (req.user) {
		User.findOne({
			twitter: profile.id
		}, function(err, existingUser) {
			if (existingUser) {
				req.flash('errors', {
					msg: 'There is already a Twitter account that belongs to you. Sign in with that account or delete it, then link it with your current account.'
				});
				done(err);
			} else {
				User.findById(req.user.id, function(err, user) {
					user.twitter = profile.id;
					user.tokens.push({
						kind: 'twitter',
						accessToken: accessToken,
						tokenSecret: tokenSecret
					});
					user.profile.name = user.profile.name || profile.displayName;
					user.profile.location = user.profile.location || profile._json.location;
					user.profile.picture = user.profile.picture || profile._json.profile_image_url;
					user.save(function(err) {
						req.flash('info', {
							msg: 'Twitter account has been linked.'
						});
						done(err, user);
					});
				});
			}
		});

	} else {
		User.findOne({
			twitter: profile.id
		}, function(err, existingUser) {
			if (existingUser) return done(null, existingUser);
			var user = new User();
			// Twitter will not provide an email address.  Period.
			// But a person’s twitter username is guaranteed to be unique
			// so we can 'fake' a twitter email address as follows:
			user.email = profile.username + '@twitter';
			user.twitter = profile.id;
			user.tokens.push({
				kind: 'twitter',
				accessToken: accessToken,
				tokenSecret: tokenSecret
			});
			user.profile.name = profile.displayName;
			user.profile.location = profile._json.location;
			user.profile.picture = profile._json.profile_image_url;
			user.save(function(err) {
				done(err, user);
			});
		});
	}
}));

passport.use(new PersonaStrategy({
		audience: config.audience
	},
	function(email, done) {
		console.log('Strategy found', email);
		User.findOne({
			email: email
		}, function(err, existingUser) {
			console.log('Strategy user', existingUser);
      if (existingUser) return done(null, existingUser);
      var user = new User();
      user.email = email;
      console.log('Strategy saving', email);
      user.save(function(err) {
        done(err, user);
      });
    });
	}
));


/**
 * Login Required middleware.
 */

exports.isAuthenticated = function(req, res, next) {
	if (req.isAuthenticated()) return next();
	res.redirect('/login');
};

/**
 * Authorization Required middleware.
 */

exports.isAuthorized = function(req, res, next) {
	var provider = req.path.split('/').slice(-1)[0];
	if (_.findWhere(req.user.tokens, {
		kind: provider
	})) next();
	else res.redirect('/auth/' + provider);
};