'use strict';

var passport = require('passport');
var _ = require('underscore');

var owaReader = require('../lib/owa_reader');
var Project = require('../models/project');
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
		.exec(function(err, projects) {
			res.send(projects.map(function(project) {
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
	owaReader(req.files.zip.path, function(err, projectName, version) {
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
			console.log('newProject', newProject);
			console.log('newVersion', newVersion);
			// TODO Issue#25 compare version to newVersion.version

			var project = newProject.toObject();
			project.version = newVersion.toObject();
			res.send(project);
		});
	});
};

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