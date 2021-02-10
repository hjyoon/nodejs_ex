const MongoClient = require('mongodb').MongoClient
const assert = require('assert');

const user = encodeURIComponent('se1620236');
const password = encodeURIComponent('jeonhyo251');
const authMechanism = 'DEFAULT';

// Connection URL
const url = `mongodb://${user}:${password}@localhost:27017/?authMechanism=${authMechanism}`;

// Database Name
const dbName = 'animals';

// Create a new MongoClient
const client = new MongoClient(url, {useUnifiedTopology: true});

// Use connect method to connect to the Server
client.connect(function(err) {
	assert.equal(null, err);
	console.log("Connected successfully to server");

	const db = client.db(dbName);

	removeDocument(db, function() {
		client.close();
    });
});

const removeDocument = function(db, callback) {
	// Get the documents collection
	const collection = db.collection('mammals');
	// Delete document where a is 3
	collection.deleteOne({ a : 3 }, function(err, result) {
		assert.equal(err, null);
		assert.equal(1, result.result.n);
		console.log("Removed the document with the field a equal to 3");
		callback(result);
	});    
}