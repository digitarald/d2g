var mongoose = require('mongoose');

var secrets = require('../config/secrets');
mongoose.connect(secrets.db);

var Project = require('../models/project');
var SignedPackage = require('../models/signed_package');
var User = require('../models/user');
var Version = require('../models/version');

console.log('Nuking everything... Good luck with that');
mongoose.connection.db.dropDatabase();
