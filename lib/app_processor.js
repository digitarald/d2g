var fs = require('fs');
var os = require('os');
var path = require('path');

var keygen = require('../lib/keygen');
var owaReader = require('../lib/owa_reader');
var owaWriter = require('../lib/owa_writer');
var Project = require('../models/project');
var Version = require('../models/version');

module.exports = function(userId, unsignedPackagePath, cb) {
	owaReader(unsignedPackagePath, function(err, manifest, extractionDir) {
		if (err) return cb(err);		
		_createProject(manifest, userId, function(err, newProject, newVersion, originalVersion) {
			console.log('We _created package', err);
			if (err) return cb(err);
			// TODO Issue#25 compare version to newVersion.version
			console.log('===========================');
			console.log('AOK originalVersion=', originalVersion, 'newVersion=', newVersion.version);
			if (originalVersion !== newVersion.version) {
				// Update manifest, package app, overwrite uploaded app
                                var updates = {
                                        version: newVersion.version
                                };
                                owaWriter(extractionDir, updates, function(err) {
                                        console.log('AOK coming back from owaWriter err=', err);
                                        if (err) return cb(err);
                                        signPackage(unsignedPackagePath, newProject, newVersion, cb);
                                });
			} else {
                                signPackage(unsignedPackagePath, newProject, newVersion, cb);
                        }
		});
	});
};


function _createProject(manifest, userId, cb) {
	console.log(typeof userId, userId);
	var aProject = new Project({
		name: manifest.name,
		_user: userId
	});
	var originalVersion = manifest.version;
	var version = originalVersion;

	aProject.save(function(err, newProject) {
		if (err) {
			return cb(err);
		}
		if (!version) {
			version = aProject._id + '.' + Date.now();
		}
		var aVersion = new Version({
			version: version,
			manifest: manifest,
			_project: aProject._id
		});
		aVersion.save(function(err, newVersion) {
			if (err) {
				return cb(err);
			}
			aProject._version = aVersion._id;
			aProject.save(function() {
				// version is the original version
				cb(null, newProject, newVersion, originalVersion);
			});
		});
	});
}

function signPackage(unsignedPackagePath, newProject, newVersion, cb) {
        console.log('===========================');
	fs.mkdir(path.join(os.tmpdir(), 'd2g-signed-packages'), function(err) {
		console.log('making s2g signed packagages', err);
		//if (err) return cb(err);
		// Error is fine, dir exists

		var signedPackagePath = path.join(os.tmpdir(), 'd2g-signed-packages', newProject.id + '.zip');

		keygen.signAppPackage(unsignedPackagePath, signedPackagePath, function(exitCode) {
			if (0 !== exitCode) {
				console.log('Problem signing');
				return cb(new Error('Unable to sign app ' + exitCode));
			}

			// https://github.com/digitarald/d2g/issues/34
			//var signedPackage = new SignedPackage();
			//signedPackage.signedPackage = fs.readFileSync(signedPackage);
			//signedPackage.save(function(err, newSignedPackage) {
			//newVersion._signedPackage = newSignedPackage.id;
			newVersion.signedPackagePath = signedPackagePath;
			newVersion.save(function(err, updatedVersion) {
				console.log('saved after package err=', err, 'updatedVersion=', updatedVersion);
				var project = newProject.toObject();
				project.version = newVersion.toObject();
				cb(null, project);

			})
		});
	});
}
