var async = require('async');
var mongoose = require('mongoose'),
    fs = require('fs');

function rm (file) {
  if (fs.existsSync(file)) {
    fs.unlinkSync(file);
  }
}

var secrets = require('../config/secrets'),
    config = require('../config/config');
mongoose.connect(secrets.db);

var Project = require('../models/project');
var SignedPackage = require('../models/signed_package');
var User = require('../models/user');
var Version = require('../models/version');

console.log('Nuking everything... Good luck with that');

function removeCb(err) {
        if (err) console.error(err);
}

async.series([
	function(done) {
		async.parallel([
			function(cb) { Project.remove(cb) },
			function(cb) { SignedPackage.remove(cb) },
			function(cb) { User.remove(cb) },
			function(cb) { Version.remove(cb) }
		], function(err) {
                        if (err) console.error(err);
                        done(err);
                });
	},
	function(err) {
		mongoose.disconnect();
	}
]);

rm(config.derFilePath);
