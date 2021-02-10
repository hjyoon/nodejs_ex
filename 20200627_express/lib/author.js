var template = require('./template.js')
const client = require('./db');
var qs = require('querystring')
var sanitizeHtml = require('sanitize-html');


exports.home = function(request, response) {
	client.query('SELECT * FROM topic', (err, res) => {
		client.query('SELECT * FROM author', (err2, res2) => {
			var title = 'author';
	    	var list = template.list(res);
	    	var html = template.HTML(title, list,
		 		``,
		 		`
		 		${template.authorTable(res2)}
		 		<style>
		 			table{
		 				border-collapse:collapse
		 			}
		 			td{
		 				border:1px solid black
		 			}
		 		</style>
		 		<form action="/author/create_process" method="post">
		 			<p>
		 				<input type="text" name="name" placeholder="name">
		 			</p>
		 			<p>
		 				<textarea name="profile" placeholder="description"></textarea>
		 			</p>
		 			<p>
		 				<input type="submit" value="submit">
		 			</p>
		 		</form>`
		 	);
	    	return response.send(html);
		});
	});
}

exports.create_process = function(request, response) {
	var body = '';
	request.on('data', function(data) {
		//console.log(data);
		body = body + data;
	});
	request.on('end', function(data) {
		var post = qs.parse(body);
		var description = post.description;
		client.query('insert into author(name, profile) values($1, $2)' , [post.name, post.profile], (err, res) => {
	    	response.redirect(302, `/author`);
		});
	});
}

exports.update = function(request, response) {
	client.query('SELECT * FROM topic', (err, res) => {
		client.query('SELECT * FROM author', (err2, res2) => {
			client.query('SELECT * FROM author WHERE id=$1', [request.query.id], (err3, res3) => {
				var title = 'author';
	    		var list = template.list(res);
	    		var html = template.HTML(title, list,
			 		``,
			 		`
			 		${template.authorTable(res2)}
			 		<style>
			 			table{
			 				border-collapse:collapse
			 			}
			 			td{
			 				border:1px solid black
			 			}
			 		</style>
			 		<form action="/author/update_process" method="post">
			 			<p>
			 				<input type="hidden" name="id" value="${request.query.id}">
			 			</p>
			 			<p>
			 				<input type="text" name="name" value="${sanitizeHtml(res3.rows[0].name)}" placeholder="name">
			 			</p>
			 			<p>
			 				<textarea name="profile" placeholder="description">${sanitizeHtml(res3.rows[0].profile)}</textarea>
			 			</p>
			 			<p>
			 				<input type="submit" value="update">
			 			</p>
			 		</form>`
		 		);
	    		return response.send(html);
			});
		});
	});
}

exports.update_process = function(request, response) {
	var body = '';
	request.on('data', function(data) {
		//console.log(data);
		body = body + data;
	});
	request.on('end', function(data) {
		var post = qs.parse(body);
		var description = post.description;
		client.query('UPDATE author SET name=$1, profile=$2 WHERE id=$3' , [post.name, post.profile, post.id], (err, res) => {
			response.redirect(302, `/author`);
		});
	});
}

exports.delete_process = function(request, response) {
	var body = '';
	request.on('data', function(data) {
		//console.log(data);
		body = body + data;
	});
	request.on('end', function(data) {
		var post = qs.parse(body);
		client.query('DELETE from topic WHERE author_id=$1', [post.id], (err, res) => {
			client.query('DELETE from author WHERE id=$1', [post.id], (err, res) => {
		    	response.redirect(302, `/author`);
			});
		});
	});
}