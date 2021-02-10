const db = require('../lib/ldb.js');
const bcrypt = require('bcrypt');
const shortid = require('shortid');

module.exports = function(app) {
	const passport = require('passport');
	const LocalStrategy = require('passport-local').Strategy;
	const FacebookStrategy = require('passport-facebook').Strategy;

	app.use(passport.initialize());
	app.use(passport.session());

	passport.serializeUser(function(user, done) {
		console.log('serializeUser', user);
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		var user = db.get('users').find({id:id}).value();
		done(null, user);
	});

	passport.use(new LocalStrategy(
		{
			usernameField: 'email',
			passwordField: 'password'
		},
		function(email, password, done) {
			var user = db.get('users').find({
				email:email
			}).value();
			if(user) {
				bcrypt.compare(password, user.password, function(err, result) {
					if(result) {
						return done(null, user);	// login success
					}
					else {
						return done(null, false, { message: 'Something is incorrect.' });
					}
				});
			}
			else {
				return done(null, false, { message: 'Something is incorrect.' });
			}
		}
	));

	var facebookCredentials = require('../config/facebook.json');
	console.log(facebookCredentials);
	passport.use(new FacebookStrategy(facebookCredentials,
		function(accessToken, refreshToken, profile, done) {
		  	console.log('FacebookStrategy', accessToken, refreshToken, profile);
		  	var email = profile.emails[0].value;
		  	var user = db.get('users').find({email:email}).value();
		  	if(user) {
		  		user.facebookId = profile.id;
		  		db.get('users').find({email:email}).assign(user).write();
		  	}
		  	else {
		  		user = {
		  			id:shortid.generate(),
		  			email:email,
		  			nickname:profile.displayName,
		  			facebookId:profile.id
		  		}
		  		db.get('users').push(user).write();
		  	}
		  	done(null, user);
		}
	));

	app.get('/auth/facebook', passport.authenticate('facebook', {
		scope:'email'
	}));

	app.get('/auth/facebook/callback', passport.authenticate('facebook', {
		successRedirect: '/',
		ailureRedirect: '/auth/login' 
	}));

	return passport;
}

