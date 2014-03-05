var mongoose = require('mongoose');
var Version = require('./version');

/**
 * App: Name
 * Build: Manifest/Redirect-Manifest/Package,
 * Tester: Version installed
 */
var projectSchema = new mongoose.Schema({
	name: String,
	_user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	_version: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Version'
	},
	created: {
		type: Date,
		default: Date.now
	}
});

projectSchema.methods.getLatestVersion = function(done) {
	Version
		.findOne({
			_project: this._id
		})
		.exec(function(err, version) {
			this._version = version._id;
			this.save(done);
		}.bind(this));
};

module.exports = mongoose.model('Project', projectSchema);