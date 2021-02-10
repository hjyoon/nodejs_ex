module.exports = {
	HTML: function(title, body) {
		return `
		<!doctype html>
		<html>
			<head>
				<title>WEB2 - ${title}</title>
				<meta charset="utf-8">
			</head>
			<body>
				<h1><a href="/">WEB</a></h1>
				${body}
			</body>
		</html>
		`;
	}
}