const authorRouter = require('./routes/author.js')
const topicRouter = require('./routes/topic.js')
const indexRouter = require('./routes/index.js')

const client = require('./lib/db.js');
const template = require('./lib/template.js');

const express = require('express')
const app = express()

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

app.get('*', function(request, response, next) {
	client.query('SELECT * FROM topic', (err, res) => {
		request.list = template.list(res);
		next();
	});
});

app.get('/author', function(request, response, next) {
	client.query('SELECT * FROM author', (err, res) => {
		request.list2 = template.authorTable(res);
		next();
	});
});

app.use('/', indexRouter);
app.use('/topic', topicRouter);
app.use('/author', authorRouter);

app.use(function(req, res, next) {
	res.status(404).send('Sorry cant find that!');
});

app.use(function(err, req, res, next) {
	console.error(err.stack);
	res.status(500).send('Something broke!');
});
 
app.listen(3000, function() {
	console.log('Example app listening on port 3000!')
});