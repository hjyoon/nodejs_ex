const template = require('../lib/template.js');
const client = require('../lib/db.js');
const db = require('../lib/ldb.js');
const shortid = require('shortid');
const bcrypt = require('bcrypt');

const express = require('express');
const router = express.Router();


db.defaults({users:[]}).write();

module.exports = function(passport) {
	router.get('/login', function(req, res) {
		var fmsg = req.flash();
		var feedback = '';
		if(fmsg.error) {
			feedback = fmsg.error[0];
		}
		var title = 'Login';
	    var html = template.HTML(title, req.list,
	 		'',
	 		`
	 		<div style="color:red;">${feedback}</div>
	 		<form action="/auth/login_process" method="post">
	 			<p><input type="text" name="email" placeholder="email"></p>
	 			<p><input type="password" name="password" placeholder="password"></p>
	 			<p><input type="submit" value="login"></p>
	 		</form>
	 		`
	 	);
	    return res.send(html);
	});

	router.post('/login_process', passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/auth/login',
		failureFlash: true
	}));

	router.get('/register', function(req, res) {
		var fmsg = req.flash();
		var feedback = '';
		if(fmsg.error) {
			feedback = fmsg.error[0];
		}
		var title = 'Login';
	    var html = template.HTML(title, req.list,
	 		'',
	 		`
	 		<div style="color:red;">${feedback}</div>
	 		<form action="/auth/register_process" method="post">
	 			<p><input type="text" name="email" placeholder="email"></p>
	 			<p><input type="password" name="password" placeholder="password"></p>
	 			<p><input type="password" name="confirmPassword" placeholder="confirm password"></p>
	 			<p><input type="text" name="nickname" placeholder="nickname"></p>
	 			<p><input type="submit" value="register"></p>
	 		</form>
	 		`
	 	);
	    return res.send(html);
	});

	router.post('/register_process', function(request, response) {	// post
		var post = request.body;
		var email = post.email.trim();	// 파일명 앞뒤의 공백제거
		var pwd = post.password;
		var confirmPwd = post.confirmPassword;
		var nickname = post.nickname.trim();
		if(pwd !== confirmPwd) {
			request.flash('error', 'Password must same!');
			response.redirect('/auth/register');
		}
		else {
			bcrypt.hash(pwd, 10, function(err, hash) {
				var user = {
					id:shortid.generate(),
					email:email,
					password:hash,
					nickname:nickname
				};
				db.get('users').push(user).write();
				request.login(user, function(err) {
					return response.redirect('/');
				});
			});
		}
	});

	router.get('/logout_process', function(request, response) {	// post
		request.logout();
		request.session.save(function() {
			response.redirect(302, '/');
		});
	});

	return router;
}