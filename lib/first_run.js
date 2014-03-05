"use strict";

var _ = require("lodash"),
    path = require("path"),
    keygen = require("./keygen"),
    config = require("../config/config");


console.log("Generating keypair at " + config.keystorePath);
keygen.createKeypair(config.keystorePath, function (params) {
  keygen.createDER(params, config.derFilePath);
});
