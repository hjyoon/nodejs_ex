const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = '123';
const someOtherPlaintextPassword = '456';

bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
	console.log(hash);
	bcrypt.compare(myPlaintextPassword, hash, function(err, result) {
		console.log('my password', result);
	});
	bcrypt.compare(someOtherPlaintextPassword, hash, function(err, result) {
		console.log('my password', result);
	});
});