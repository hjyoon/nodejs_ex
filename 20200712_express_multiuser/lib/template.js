const sanitizeHtml = require('sanitize-html');

module.exports = {
	HTML: function(title, list, control, body, authStatusUI = '<a href="/auth/login">login</a> | <a href="/auth/register">register</a>') {
		return `
		<!doctype html>
		<html>
			<head>
				<title>WEB2 - ${title}</title>
				<meta charset="utf-8">
			</head>
			<body>
				${authStatusUI}
				<h1><a href="/">WEB</a></h1>
				<a href="/author">author</a>
				${list}
				${control}
				${body}
			</body>
		</html>
		`;
	},
	list: function(topics) {
		//topics = 
		var list = '<ul>';
		var i = 0;
		while(i < topics.rowCount) {
			list = list + `<li><a href="/topic/${topics.rows[i].id}">${sanitizeHtml(topics.rows[i].title)}</a></li>`;
			i = i + 1;
		}
		list = list + '</ul>';
		return list;
	},
	authorSelect: function(authors, author_id) {
		var tag = '';
		var i=0;
		while(i < authors.rowCount) {
			var selected = '';
			if(authors.rows[i].id === author_id) {
				selected = ' selected';
			}
			tag += `<option value="${authors.rows[i].id}"${selected}>${sanitizeHtml(authors.rows[i].name)}</option>`;
			i++;
		}
		return `
			<select name="author">
				${tag}
			</select>
		`;
	},
	authorTable:function(authors) {
		var tag = '';
		var i = 0;
		tag += '<table>';
		while(i < authors.rowCount) {
			tag += `
			<tr>
				<td>${sanitizeHtml(authors.rows[i].name)}</td>
				<td>${sanitizeHtml(authors.rows[i].profile)}</td>
				<td><a href="/author/update/${authors.rows[i].id}">update</a></td>
				<td>
					<form action="/author/delete_process" method="post">
						<input type="hidden" name="id" value="${authors.rows[i].id}">
						<input type="submit" value="delete">
					</form>
				</td>
			</tr>
			`;
			i++;
		}
		tag += '</table>';
		return tag;
	}
}