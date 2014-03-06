var mongoose = require('mongoose');

var versionSchema = new mongoose.Schema({
  version: String,
  _project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  signedPackagePath: String,
// TODO Figure out how binary storage in MongoDB works
// https://github.com/digitarald/d2g/issues/34
/*  _signedPackage: {
    type: mongoose.Schema.Types.Buffer,
    ref: 'SignedPackage'
  },*/
  created: {
    type: Date,
    default: Date.now
  },
});

module.exports = mongoose.model('Version', versionSchema);
