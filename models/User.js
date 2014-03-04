var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');

var userSchema = new mongoose.Schema({
	email: {
		type: String,
		unique: true,
		lowercase: true
	},
	password: String,

	twitter: {
		type: String,
		unique: true,
		sparse: true
	},
	github: {
		type: String,
		unique: true,
		sparse: true
	},
	tokens: Array,

	profile: {
		name: {
			type: String,
			default: ''
		},
		location: {
			type: String,
			default: ''
		},
		website: {
			type: String,
			default: ''
		},
		picture: {
			type: String,
			default: ''
		}
	}
});

/**
 * Get URL to a user's gravatar.
 */

userSchema.methods.gravatar = function(size, defaults) {
	if (!size) size = 200;
	if (!defaults) defaults = 'retro';

	if (!this.email) {
		return 'https://gravatar.com/avatar/?s=' + size + '&d=' + defaults;
	}

	var md5 = crypto.createHash('md5').update(this.email);
	return 'https://gravatar.com/avatar/' + md5.digest('hex').toString() + '?s=' + size + '&d=' + defaults;
};

module.exports = mongoose.model('User', userSchema);