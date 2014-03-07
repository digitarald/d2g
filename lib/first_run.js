'use strict';

var _ = require('lodash');
var path = require('path');
var fs = require('fs');
var keygen = require('./keygen');
var config = require('../config/config');

if (!fs.existsSync(config.derFilePath)) {
	console.log('Generating DER file at ' + config.derFilePath); 
	console.log('Generating Cert DB at ' + config.configCertsDir); 
	keygen.createKeypair(config.configCertsDir, config.derFilePath);
}