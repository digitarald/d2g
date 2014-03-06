var mongoose = require('mongoose'),
    fs = require('fs');

function rm (file) {
  if (fs.existsSync(file)) {
    fs.unlinkSync(file);
  }
}

var secrets = require('../config/secrets'),
    config = require('../config/config');
mongoose.connect(secrets.db);

var Project = require('../models/project');
var SignedPackage = require('../models/signed_package');
var User = require('../models/user');
var Version = require('../models/version');

console.log('Nuking everything... Good luck with that');

mongoose.connection.db.dropDatabase();
rm(config.keystorePath);
rm(config.derFilePath);