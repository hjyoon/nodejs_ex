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

	insertDocuments(db, function() {
		client.close();
	});
});

const insertDocuments = function(db, callback) {
	// Get the documents collection
	const collection = db.collection('mammals');
	// Insert some documents
	collection.insertMany([{a : 1}, {a : 2}, {a : 3}], function(err, result) {
	    assert.equal(err, null);
	    assert.equal(3, result.result.n);
	    assert.equal(3, result.ops.length);
	    console.log("Inserted 3 documents into the collection");
	    callback(result);
	});
}