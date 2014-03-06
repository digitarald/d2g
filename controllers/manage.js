'use strict';

var passport = require('passport');
var _ = require('underscore');

var processor = require('../lib/app_processor');
var Project = require('../models/project');
var SignedPackage = require('../models/signed_package');
var User = require('../models/user');

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

	processor(userId, unsignedPackagePath, function(err, project) {
		if (err) {
			console.log(err);
			console.log(err.stack);
			console.error(err);
			return res.send(404, 'Unable to read app zip');
		}
		res.send(project);
	});
}
