var mongoose = require('mongoose');

var versionSchema = new mongoose.Schema({
  version: String,
  _project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  created: {
    type: Date,
    default: Date.now
  },
});

module.exports = mongoose.model('Version', versionSchema);
