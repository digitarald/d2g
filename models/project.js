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
	created: {
		type: Date,
		default: Date.now
	}
});

projectSchema.methods.getVersions = function(done) {
	Version
		.find({
			_project: this._id
		})
		.exec(done);
};

module.exports = mongoose.model('Project', projectSchema);