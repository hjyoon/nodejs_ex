const MongoClient = require('mongodb').MongoClient
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017/';

// Database Name
const dbName = 'animals';

// Create a new MongoClient
const client = new MongoClient(url, {useUnifiedTopology: true});

// Use connect method to connect to the Server
client.connect(function(err) {
	assert.equal(null, err);
	console.log("Connected successfully to server");

	const db = client.db(dbName);

	client.close();
});




// MongoClient.connect(url, {useUnifiedTopology: true}, function (err, client) {
// 	if (err) {
// 		throw err
// 	}
// 	console.log("Connected successfully to server");
// 	var db = client.db('animals')
// 	db.collection('mammals').find().toArray(function (err, result) {
// 		if (err) {
// 			throw err
// 		}
// 		console.log(result)
// 	})
// });