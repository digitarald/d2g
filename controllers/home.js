/**
 * GET /
 * Home page.
 */

var config = require("../config/config");
var Project = require('../models/project');
var Version = require('../models/version');
var fs = require('fs');
var connect = require('connect');

exports.getIndex = function(req, res) {
	if (req.user) {
		return res.redirect('/manage');
	}
	Project
		.find()
		.populate('_version')
		.exec(function(err, projects) {
			projects = projects.map(function(project) {
				return project.toObject();
			});
			res.render('home', {
				title: 'Projects',
				projects: projects
			});
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

			console.log('ETag', project._version._id);

			res.setHeader('ETag', '"' + project._version._id + '"');
			if (req.header['ETag'] && connect.utils.conditionalGET(req) && !connect.utils.modified(req, res)) {
				console.log('No modified');
				res.removeHeader('ETag');
				return connect.utils.notModified(res);
			}

			res.render('install', {
				title: project.name,
				manifestUrl: '/install/' + project._id + '/manifest',
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

			console.log('ETag', project._version._id);

			res.setHeader('ETag', '"' + project._version._id + '"');
			if (req.header['ETag'] && connect.utils.conditionalGET(req) && !connect.utils.modified(req, res)) {
				console.log('No modified');
				res.removeHeader('ETag');
				return connect.utils.notModified(res);
			}

			var size = fs.statSync(project._version.signedPackagePath).size;
			var manifest = JSON.parse(project._version.manifest);
			manifest.package_path = '/install/' + project._id + '/package';
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