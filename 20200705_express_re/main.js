const author = require('./lib/author.js')
const topic = require('./lib/topic.js')
const client = require('./lib/db.js');
const template = require('./lib/template.js');

const sanitizeHtml = require('sanitize-html');

//const bodyParser = require('body-parser');

const express = require('express')
const app = express()

// parse application/x-www-form-urlencoded
//app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

// app.use(function(request, response, next) {
// 	next();
// });

app.get('*', function(request, response, next) {
	client.query('SELECT * FROM topic', (err, res) => {
		request.list = template.list(res);
		next();
	});
});
 
app.get('/', function(req, res) { 
	topic.home(req, res);
});

app.get('/topic/create', function(req, res) {
	topic.create(req, res);
});

app.post('/topic/create_process', function(req, res) {	// post
	topic.create_process(req, res);
});

app.post('/topic/delete_process', function(req, res) {	// post
	topic.delete_process(req, res);
});

app.post('/topic/update_process', function(req, res) {	// post
	topic.update_process(req, res);
});

app.get('/topic/update/:pageId', function(req, res) {
	topic.update(req, res);
});

app.get('/topic/:pageId', function(req, res) {
	topic.page(req, res);
});

app.get('/author', function(req, res) {
	author.home(req, res);
});

app.post('/author/create_process', function(req, res) {		// post
	author.create_process(req, res);
});

app.post('/author/update_process', function(req, res) {		// post
	author.update_process(req, res);
});

app.post('/author/delete_process', function(req, res) {		// post
	author.delete_process(req, res);
});

app.get('/author/update/:authorId', function(req, res) {
	author.update(req, res);
});

app.use(function(req, res, next) {
	res.status(404).send('Sorry cant find that!');
});
 
app.listen(3000, function() {
	console.log('Example app listening on port 3000!')
});