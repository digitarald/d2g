'use strict';
/**
 * GET /
 * Home page.
 */

var config = require('../config/config');
var Project = require('../models/project');
var Version = require('../models/version');
var fs = require('fs');
var connect = require('connect');
var fresh = require('fresh');
var mongoose = require('mongoose');
var moment = require('moment');
var prettyBytes = require('pretty-bytes');
var spawn = require('child_process').spawn;

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

			var size = fs.statSync(project._version.signedPackagePath).size;

			res.render('install', {
				title: project.name,
				created: project._version.created.toUTCString(),
				createdAgo: moment(project._version.created).fromNow(),
				size: prettyBytes(size),
				manifestUrl: '/install/' + project._id + '/manifest',
				packageUrl: '/install/' + project._id + '/package',
				iconUrl: '/install/' + project._id + '/icon',
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

			if (setCacheFromIdAndVerifyFreshness(project._version.id, req, res)) {
				return;
			}

			var size = fs.statSync(project._version.signedPackagePath).size;
			var manifest = JSON.parse(project._version.manifest);
			manifest.package_path = '/install/' + project._id + '/package';
			manifest.size = size;
			var icons = manifest.icons || {
				256: ''
			};

			for (size in icons) {
				if (icons.hasOwnProperty(size)) {
					icons[size] = '/install/' + project_id + '/icon/' + size;
				}
			}
			manifest.icons = icons;

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

			if (setCacheFromIdAndVerifyFreshness(project._version.id, req, res)) {
				return;
			}

			res.sendfile(project._version.signedPackagePath);
		});
};

exports.getIcon = function(req, res) {
	var project_id = req.params.project_id;
	var icon_size = req.params.icon_size;
	Project
		.findById(project_id)
		.populate('_version')
		.exec(function(err, project) {
			if (err || !project) {
				return res.send(404);
			}

			if (setCacheFromIdAndVerifyFreshness(project._version.id, req, res)) {
				return;
			}

			var manifest = JSON.parse(project._version.manifest);

			var icons = manifest.icons;
			var biggestSize = 0,
				biggestPath = '';
			if (!icon_size) {
				for (var size in icons) {
					if (icons.hasOwnProperty(size)) {
						if (biggestSize < +size) {
							biggestSize = +size;
							biggestPath = icons[size];
						}
					}
				}
			} else {
				biggestSize = +icon_size;
				biggestPath = icons[icon_size];
			}

			if (!biggestPath) {
				res.sendfile(__dirname + '/../public/images/favicon.png');
				return;
			}

			biggestPath = biggestPath.replace(/^\//, '');

			res.setHeader('Content-Type', 'image/png');
			var child = spawn('unzip', ['-j', '-p', project._version.signedPackagePath, biggestPath], {
				encoding: 'binary'
			});
			child.stdout.pipe(res);

		});
};

exports.getPhoneCertInstructions = function(req, res) {
	// TODO provide some instructions on how to install the cert
	res.send(404, 'TODO');
};

exports.getPhoneCert = function(req, res) {
	res.download(config.derFilePath, 'phone-cert.der');
};

exports.getPhoneCertTools = function(req, res) {
	// TODO provide tools to install the cert.
	res.send(404, 'TODO');
};


/**
 * Set etag and last-modified from mongo id
 *
 * @param {Number} id
 * @param {Object} req
 * @param {Object} res
 * @return {Boolean}
 */
function setCacheFromIdAndVerifyFreshness(id, req, res) {
	var id = mongoose.Types.ObjectId(id);
	var headers = {
		'etag': id.toString(),
		'last-modified': id.getTimestamp().toUTCString()
	}
	for (var key in headers) {
		res.setHeader(key, headers[key]);
	}
	// Cache is stale
	if (!fresh(req.headers, headers)) {
		return false;
	}
	// Freshness!
	connect.utils.notModified(res);
	return true;
}