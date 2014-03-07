'use strict';

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

projectSchema.virtual('iconUrl').get(function() {
	return '/install/' + this._id + '/icon';
});

projectSchema.virtual('manifestUrl').get(function() {
	return '/install/' + this._id + '/manifest';
});

projectSchema.virtual('packageUrl').get(function() {
	return '/install/' + this._id + '/package';
});

projectSchema.methods.toCleanObject = function() {
	return {
		key: this.id,
		name: this.name,
		created: this.created.getTime(),
		iconUrl: this.iconUrl,
		manifestUrl: this.manifestUrl,
		packageUrl: this.packageUrl,
		version: this._version.toCleanObject()
	};
};

module.exports = mongoose.model('Project', projectSchema);