'use strict';

var _ = require('lodash');
var path = require('path');
var fs = require('fs');
var keygen = require('./keygen');
var config = require('../config/config');

if (!fs.existsSync(config.keystorePath)) {
	console.log('Generating keypair at ' + config.keystorePath);
	keygen.createKeypair(config.keystorePath, function(params) {
		keygen.createDER(params, config.derFilePath);
	});
}