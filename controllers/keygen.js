// utilities for creating new public / private keypairs

var crypto = require('crypto');

// see http://stackoverflow.com/questions/8520973/how-to-create-a-pair-private-public-keys-using-node-js-crypto
// see https://github.com/digitarald/d2g/issues/2

exports.createKeypair = function() {
	var prime_length = 60;
	var diffHell = crypto.createDiffieHellman(prime_length);

	diffHell.generateKeys('base64');
	console.log("Public Key : " ,diffHell.getPublicKey('base64'));
	console.log("Private Key : " ,diffHell.getPrivateKey('base64'));

	console.log("Public Key : " ,diffHell.getPublicKey('hex'));
	console.log("Private Key : " ,diffHell.getPrivateKey('hex'));	
}

exports.createKeypair();
