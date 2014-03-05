'use strict';

var passport = require('passport');
var _ = require('underscore');

var owaReader = require('../lib/owa_reader');
var Project = require('../models/project');
var User = require('../models/User');
var Version = require('../models/version');

exports.getIndex = function(req, res) {
  res.render('manage/index', {
    title: 'Dashboard'
  });
};

exports.getNewProject = function(req, res) {
  res.render('manage/new-project', {
    title: 'New Project'
  });
};

exports.uploadApp = function(req, res) {
  if (! req.files ||
      ! req.files.zip ||
      ! req.files.zip.path) {
    return res.send(400, 'Bad upload');
  }
  owaReader(req.files.zip.path, function(err, name, version) {
    if (err) {
      console.log(err);
      console.error(err);
      return res.send(404, 'Unable to read app zip');
    }
    // TODO this should be based on Mongo
    if (! version) {
      version = new Date().getTime();
    }

  res.send('Great! ' + name + ' ' + version);
  });
};

var _createProject = function(name, users, version, cb) {
  users = user || [];
  var aProject = new Project({
    name: name,
    users: users
  });

  aProject.save(function(err, newProject) {
    if (err) {
      return cb(err);
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
