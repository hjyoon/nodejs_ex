const author = require('./lib/author.js')
const topic = require('./lib/topic.js')

const sanitizeHtml = require('sanitize-html');
const qs = require('querystring')

const express = require('express')
const app = express()
 
app.get('/', function(req, res) { 
	topic.home(req, res);
});
 
app.get('/page', function(req, res) {
	topic.page(req, res);
});

app.get('/create', function(req, res) {
	topic.create(req, res);
});

app.post('/create_process', function(req, res) {	// post
	topic.create_process(req, res);
});

app.get('/update', function(req, res) {
	topic.update(req, res);
});

app.post('/update_process', function(req, res) {	// post
	topic.update_process(req, res);
});

app.post('/delete_process', function(req, res) {	// post
	topic.delete_process(req, res);
});

app.get('/author', function(req, res) {
	author.home(req, res);
});

app.post('/author/create_process', function(req, res) {		// post
	author.create_process(req, res);
});

app.get('/author/update', function(req, res) {
	author.update(req, res);
});

app.post('/author/update_process', function(req, res) {		// post
	author.update_process(req, res);
});

app.post('/author/delete_process', function(req, res) {		// post
	author.delete_process(req, res);
});
 
app.listen(3000, function() {
	console.log('Example app listening on port 3000!')
});