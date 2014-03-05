"use strict";

var _ = require("lodash"),
    path = require("path"),
    fs = require("fs"),
    keygen = require("./keygen"),
    config = require("../config/config");

if (!fs.existsSync(config.keystorePath)) {
  console.log("Generating keypair at " + config.keystorePath);
  keygen.createKeypair(config.keystorePath, function (params) {
    keygen.createDER(params, config.derFilePath);
  });
}


