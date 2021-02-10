const authorRouter = require('./routes/author.js')
const topicRouter = require('./routes/topic.js')
const indexRouter = require('./routes/index.js')
const loginRouter = require('./routes/login.js')

const auth = require('./lib/auth.js');
const client = require('./lib/db.js');
const template = require('./lib/template.js');

const cookieParser = require('cookie-parser');
const express = require('express')
const app = express()

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(cookieParser());

app.get('*', function(request, response, next) {
	client.query('SELECT * FROM topic', (err, res) => {
		var isOwner = auth.authIsOwner(request, response);
		console.log(isOwner);
		request.list = template.list(res);
		next();
	});
});

app.use('/', indexRouter);
app.use('/topic', topicRouter);
app.use('/author', authorRouter);
app.use('/login', loginRouter);

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