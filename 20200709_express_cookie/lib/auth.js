var self = module.exports = {
	authIsOwner: function (request, response) {
		var isOwner = false;
		console.log(request.cookies);
		if(request.cookies) {
			console.log(request.cookies.email);
			console.log(request.cookies.password);
			if(request.cookies.email === 'se1620236@naver.com' && request.cookies.password === '123') {
				isOwner = true;
			}
		}
		return isOwner;
	},
	authStatusUI: function(request, response) {
		var authStatusUI = '<a href="/login">login</a>';
		if(self.authIsOwner(request, response)) {
			authStatusUI = '<a href="/login/logout_process">logout</a>';
		}
		return authStatusUI;
	}
}