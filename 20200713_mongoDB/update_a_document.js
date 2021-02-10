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

	updateDocument(db, function() {
		client.close();
    });
});

const updateDocument = function(db, callback) {
	// Get the documents collection
	const collection = db.collection('mammals');
	// Update document where a is 2, set b equal to 1
	collection.updateOne({ a : 2 }, { $set: { b : 1 } }, function(err, result) {
		assert.equal(err, null);
		assert.equal(1, result.result.n);
		console.log("Updated the document with the field a equal to 2");
		callback(result);
	});  
}