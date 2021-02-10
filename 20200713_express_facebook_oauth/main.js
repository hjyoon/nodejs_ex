const authorRouter = require('./routes/author.js');
const topicRouter = require('./routes/topic.js');
const indexRouter = require('./routes/index.js');

const auth = require('./lib/auth.js');
const client = require('./lib/db.js');
const template = require('./lib/template.js');

const session = require('express-session');
const FileStore = require('session-file-store')(session);
const flash = require('connect-flash');

const cookieParser = require('cookie-parser');
const express = require('express')
const app = express()

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(cookieParser());
app.use(session({
	secret: 'asdfghkljafklgjhaklfg',
	resave: false,
	saveUninitialized: true,
	store: new FileStore()
}));
app.use(flash());

const passport = require('./lib/passport.js')(app);
const authRouter = require('./routes/auth.js')(passport);

app.get('*', function(request, response, next) {
	client.query('SELECT * FROM topic', (err, res) => {
		var isOwner = auth.authIsOwner(request, response);
		request.list = template.list(res);
		next();
	});
});

app.use('/', indexRouter);
app.use('/topic', topicRouter);
app.use('/author', authorRouter);
app.use('/auth', authRouter);

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