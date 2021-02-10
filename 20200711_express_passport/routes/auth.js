const template = require('../lib/template.js');
const client = require('../lib/db.js');

const express = require('express');
const router = express.Router();

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
	 			<p><input type="submit" value="submit"></p>
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

	router.get('/logout_process', function(request, response) {	// post
		request.logout();
		request.session.save(function() {
			response.redirect(302, '/');
		});
	});

	return router;
}