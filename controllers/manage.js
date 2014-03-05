'use strict';

var fs = require('fs');
var os = require('os');
var path = require('path');

var passport = require('passport');
var _ = require('underscore');

var keygen = require('../lib/keygen');
var owaReader = require('../lib/owa_reader');
var Project = require('../models/project');
var SignedPackage = require('../models/signed_package');
var User = require('../models/user');
var Version = require('../models/version');

exports.getIndex = function(req, res) {
	res.render('manage/index', {
		title: 'Dashboard',
		standalone: true
	});
};

exports.getProjects = function(req, res) {
	Project
		.find({
			_user: req.user.id
		})
		.populate('_version')
		.exec(function(err, projects) {
			res.send(projects.map(function(project) {
				// TODO: Remove this dirty migration hack
				if (!project._version) {
					project.getLatestVersion();
				}
				return project.toObject();
			}));
		});
};

//TODO uploadApp should accept a project id
// and do either createProject or _updateProject
exports.uploadApp = function(req, res) {
	if (!req.files || !req.files.zip || !req.files.zip.path) {
		return res.send(400, 'Bad upload');
	}
	var userId = req.user;
	var unsignedPackagePath = req.files.zip.path;
	owaReader(unsignedPackagePath, function(err, projectName, version) {
		if (err) {
			console.log(err);
			console.error(err);
			return res.send(404, 'Unable to read app zip');
		}
		_createProject(projectName, userId, version, function(err, newProject, newVersion) {
			if (err) {
				console.log(err);
				console.error(err);
				return res.send(500, 'Unable to save to Mongo');
			}
			// TODO Issue#25 compare version to newVersion.version
			fs.mkdir(path.join(os.tmpdir(), 'd2g-signed-packages'), function(err) {
				// Error is fine, dir exists

				var signedPackagePath = path.join(os.tmpdir(), 'd2g-signed-packages', newProject.id + '.zip');

				keygen.signAppPackage(unsignedPackagePath, signedPackagePath, function(exitCode) {
					if (0 !== exitCode) {
						return res.send(500, 'Unable to sign app');
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
						res.send(project);

					});
				});
			});
		});
	});
}

var _createProject = function(projectName, userId, version, cb) {
	console.log(typeof userId, userId);
	var aProject = new Project({
		name: projectName,
		_user: userId
	});

	aProject.save(function(err, newProject) {
		if (err) {
			return cb(err);
		}
		if (!version) {
			version = aProject._id + '.' + new Date().getTime();
		}
		var aVersion = new Version({
			version: version,
			_project: aProject._id
		});
		aVersion.save(function(err, newVersion) {
			if (err) {
				return cb(err);
			}
			cb(null, newProject, newVersion);
		});
	});
}