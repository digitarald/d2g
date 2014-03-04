var mongoose = require('mongoose');

/**
 * App: Name
 * Build: Manifest/Redirect-Manifest/Package,
 * Tester: Version installed
 */

var projectSchema = new mongoose.Schema({
	name: String,
	users: [{
		role: String,
		_user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		}
	}],
	created: {
		type: Date,
		default: Date.now
	},
});

module.exports = mongoose.model('Project', projectSchema);
