/**
 * GET /
 * Home page.
 */

var config = require("../config/config");
var Project = require('../models/project');
var Version = require('../models/version');
var fs = require('fs');

exports.getIndex = function(req, res) {
	if (req.user) {
		return res.redirect('/manage');
	}
	res.render('home', {
		title: 'Welcome'
	});
};

exports.getInstall = function(req, res) {
	var project_id = req.params.project_id || '5317c368280b290000e8dcf8';
	Project
		.findById(project_id)
		.populate('_version')
		.exec(function(err, project) {
			if (err || !project) {
				return res.send(404);
			}
			res.render('install', {
				title: project.name,
				manifestUrl: '/install/' + project_id + '/manifest',
				version: project._version.version
			});
		});
};

exports.getManifest = function(req, res) {
	var project_id = req.params.project_id;
	Project
		.findById(project_id)
		.populate('_version')
		.exec(function(err, project) {
			if (err || !project) {
				return res.send(404);
			}
			var size = fs.statSync(project._version.signedPackagePath).size;
			var manifest = JSON.parse(project._version.manifest);
			manifest.package_path = '/install/' + project_id + '/package';
			manifest.size = size;
			res.setHeader('Content-Type', 'application/x-web-app-manifest+json');
			res.send(manifest);
		});
};

exports.getPackage = function(req, res) {
	var project_id = req.params.project_id;
	Project
		.findById(project_id)
		.populate('_version')
		.exec(function(err, project) {
			if (err || !project) {
				return res.send(404);
			}
			res.sendfile(project._version.signedPackagePath);
		});
};

exports.getPhoneCertInstructions = function(req, res) {
	// TODO provide some instructions on how to install the cert
};

exports.getPhoneCert = function(req, res) {
	res.download(config.derFilePath, 'phone-cert.der');
};

exports.getPhoneCertTools = function(req, res) {
	// TODO provide tools to install the cert.
};