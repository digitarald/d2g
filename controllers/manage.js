'use strict';

var passport = require('passport');
var _ = require('underscore');
var User = require('../models/user');
// var Project = require('../models/project');

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
