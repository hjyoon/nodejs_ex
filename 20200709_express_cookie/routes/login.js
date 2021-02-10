const template = require('../lib/template.js');
const client = require('../lib/db.js');

const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
	var title = 'Login';
    var html = template.HTML(title, req.list,
 		`<a href="/topic/create">create</a>`,
 		`
 		<form action="login/login_process" method="post">
 			<p><input type="text" name="email" placeholder="email"></p>
 			<p><input type="password" name="password" placeholder="password"></p>
 			<p><input type="submit" value="submit"></p>
 		</form>
 		`
 	);
    return res.send(html);
});

router.post('/login_process', function(request, response) {	// post
	var post = request.body;
	if(post.email === 'se1620236@naver.com' && post.password === '123') {
		response.cookie('email', post.email, '');
		response.cookie('password', post.password, '');
		response.cookie('nickname', 'hjyoon', '');
		response.redirect(302, '/');
	}
	else {
		response.status(200).send('Who?');
	}
});

router.get('/logout_process', function(request, response) {	// post
	response.clearCookie('email');
	response.clearCookie('password');
	response.clearCookie('nickname');
	response.redirect(302, '/');
});

module.exports = router;