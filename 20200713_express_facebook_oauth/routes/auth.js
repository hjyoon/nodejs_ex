const template = require('../lib/template.js');
const client = require('../lib/db.js');
const db = require('../lib/ldb.js');
const shortid = require('shortid');
const bcrypt = require('bcrypt');
const auth = require('../lib/auth.js');

const express = require('express');
const router = express.Router();


db.defaults({users:[]}).write();

module.exports = function(passport) {
	router.get('/login', function(request, response) {
		var fmsg = request.flash();
		var feedback = '';
		if(fmsg.error) {
			feedback = fmsg.error[0];
		}
		var title = 'Login';
	    var html = template.HTML(title, request.list,
	 		'',
	 		`
	 		<div style="color:red;">${feedback}</div>
	 		<form action="/auth/login_process" method="post">
	 			<p><input type="text" name="email" placeholder="email"></p>
	 			<p><input type="password" name="password" placeholder="password"></p>
	 			<p><input type="submit" value="login"></p>
	 		</form>
	 		`,
	 		auth.authStatusUI(request, response)
	 	);
	    return response.send(html);
	});

	router.post('/login_process', passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/auth/login',
		failureFlash: true
	}));

	router.get('/register', function(request, response) {
		var fmsg = request.flash();
		var feedback = '';
		if(fmsg.error) {
			feedback = fmsg.error[0];
		}
		var title = 'Login';
	    var html = template.HTML(title, request.list,
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
	 		`,
	 		auth.authStatusUI(request, response)
	 	);
	    return response.send(html);
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
				var puser = db.get('users').find({email:email}).value();
				if(puser) {
					puser.password = hash;
					puser.nickname = nickname;
					db.get('users').find({id:puser.id}).assign(puser).write();
				}
				else {
					var user = {
						id:shortid.generate(),
						email:email,
						password:hash,
						nickname:nickname
					};
					db.get('users').push(user).write();
				}
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