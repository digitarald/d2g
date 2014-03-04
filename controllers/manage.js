'use strict';

var passport = require('passport');
var _ = require('underscore');
var User = require('../models/User');
var Project = require('../models/project');
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
