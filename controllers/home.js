/**
 * GET /
 * Home page.
 */

var config = require("../config/config");

exports.getIndex = function(req, res) {
	if (req.user) {
    return res.redirect('/manage');
  }
  res.render('home', {
    title: 'Welcome'
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