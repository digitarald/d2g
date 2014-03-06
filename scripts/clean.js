var mongoose = require('mongoose');

var secrets = require('../config/secrets');
mongoose.connect(secrets.db);

var Project = require('../models/project');
var SignedPackage = require('../models/signed_package');
var User = require('../models/user');
var Version = require('../models/version');

console.log('Nuking everything... Good luck with that');

var models = [Project, SignedPackage, User, Version];
var total = models.length - 1;
models.forEach(function(model, i) {
        model.remove({}, function(err) {
                total--;
                console.log((i + 1) + '/' + models.length  + ': Mongo Collection removed');
                if (0 === total) {
                        mongoose.disconnect();
                }
        });
});
