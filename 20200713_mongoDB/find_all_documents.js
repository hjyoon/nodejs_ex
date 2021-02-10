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

	findDocuments(db, function() {
		client.close();
    });
});

const findDocuments = function(db, callback) {
	// Get the documents collection
	const collection = db.collection('mammals');
	// Find some documents
	collection.find({}).toArray(function(err, docs) {
		assert.equal(err, null);
		console.log("Found the following records");
		console.log(docs)
		callback(docs);
	});
}