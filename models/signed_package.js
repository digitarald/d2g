var mongoose = require('mongoose');

// TODO: https://github.com/digitarald/d2g/issues/34
var signedPackageSchema = new mongoose.Schema({
    signedPackage: Buffer
});

module.exports = mongoose.model('SignedPackage', signedPackageSchema);