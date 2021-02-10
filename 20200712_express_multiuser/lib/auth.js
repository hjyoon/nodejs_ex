module.exports = {
	authIsOwner: function (request, response) {
		if(request.user) {
			return true
		}
		else {
			return false
		}
	},
	authStatusUI: function(request, response) {
		var authStatusUI = '<a href="/auth/login">login</a> | <a href="/auth/register">register</a>';
		if(this.authIsOwner(request, response)) {
			authStatusUI = `${request.user.nickname} | <a href="/auth/logout_process">logout</a>`;
		}
		return authStatusUI;
	}
}