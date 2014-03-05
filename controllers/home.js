/**
 * GET /
 * Home page.
 */

var config = require("../config/config");
var Project = require('../models/project');

exports.getIndex = function(req, res) {
	if (req.user) {
    return res.redirect('/manage');
  }
  res.render('home', {
    title: 'Welcome'
  });
};

exports.getManifest = function(req, res) {

};

exports.getInstall = function(req, res) {
	var project_id = req.params.project_id;
	Project
		.findById(project_id)
		.populate('_version')
		.exec(function(err, project) {
			if (err) {
				return res.send(404);
			}
			res.render('install', {
		    title: project.name
		  });
		});
};

exports.getPhoneCertInstructions = function (req, res) {
  // TODO provide some instructions on how to install the cert
};

exports.getPhoneCert = function (req, res) {
  res.download(config.derFilePath, 'phone-cert.der');
};

exports.getPhoneCertTools = function (req, res) {
  // TODO provide tools to install the cert.
};