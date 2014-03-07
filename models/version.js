'use strict';

var mongoose = require('mongoose');

var versionSchema = new mongoose.Schema({
	version: String,
	_project: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Project'
	},
	signedPackagePath: String,
	manifest: String,
	created: {
		type: Date,
		default: Date.now
	},
});


versionSchema.methods.toCleanObject = function() {
	return {
		key: this.id,
		version: this.version,
		manifest: JSON.parse(this.manifest),
		created: this.created.getTime()
	};
};



module.exports = mongoose.model('Version', versionSchema);
