'use strict';

// var User = require('../models/User');
// var Project = require('../models/project');

exports.getIndex = function(req, res) {
  res.render('manage/index', {
    title: 'Dashboard',
    standalone: true
  });
};