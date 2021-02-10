module.exports = function(app) {
	const authData = {
		email: 'se1620236@naver.com',
		password: '123',
		nickname: 'hjyoon'
	};

	const passport = require('passport');
	const LocalStrategy = require('passport-local').Strategy;

	app.use(passport.initialize());
	app.use(passport.session());

	passport.serializeUser(function(user, done) {
		done(null, user.email);
	});

	passport.deserializeUser(function(id, done) {
		done(null, authData);
	});

	passport.use(new LocalStrategy(
		{
			usernameField: 'email',
			passwordField: 'password'
		},
		function(username, password, done) {
			if(username === authData.email) {
				if(password === authData.password) {
					return done(null, authData);	// login success
				}
				else {
					return done(null, false, { message: 'Incorrect password.' });
				}
			}
			else {
				return done(null, false, { message: 'Incorrect username.' });
			}
		}
	));
	return passport;
}

