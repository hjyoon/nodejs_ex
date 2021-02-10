var template = require('./template.js')
const client = require('./db');
var url = require('url');
var qs = require('querystring')
var sanitizeHtml = require('sanitize-html');

exports.home = function(request, response) {
	client.query('SELECT * FROM topic', (err, res) => {
	    var title = 'Welcome';
	    var description = 'Hello, Node.js';
	    var list = template.list(res);
	    var html = template.HTML(title, list,
	 		`<h2>${title}</h2><p>${description}</p>`,
	 		`<a href="/create">create</a>`
	 	);

	    response.writeHead(200);
	    response.end(html);
	    //client.end()
	});
}

exports.page = function(request, response) {
	var _url = request.url;
	var queryData = url.parse(_url, true).query;
	client.query('SELECT * FROM topic', (err, res) => {
		if(err) {
			//console.log(err.stack)
			throw err;
		}
		client.query(`SELECT * FROM topic LEFT JOIN author on topic.author_id=author.id where topic.id=$1`, [queryData.id], (err2, res2) => {
			if(err2) {
				//console.log(err2.stack)
				throw err2;
			}
			//console.log(res2)
		    var title = res2.rows[0].title;
		    var description = res2.rows[0].description;
		    var list = template.list(res);
		    var html = template.HTML(title, list,
		 		`<h2>${sanitizeHtml(title)}</h2
		 		<p>${sanitizeHtml(description)}</p>
		 		<p>by ${sanitizeHtml(res2.rows[0].name)}</p>`,
		 		`<a href="/create">create</a>
		 		<a href="/update?id=${queryData.id}">update</a>
	 			<form action="/delete_process" method="post">
	 				<input type="hidden" name="id" value="${queryData.id}">
	 				<input type="submit" value="delete">
	 			</form>`
		 	);

		    response.writeHead(200);
		    response.end(html);
		    //client.end()
		});
	});
}

exports.create = function(request, response) {
	client.query('SELECT * FROM topic', (err, res) => {
		client.query('SELECT * FROM author', (err2, res2) => {
			var title = 'Create';
		    var list = template.list(res);
		    var html = template.HTML(sanitizeHtml(title), list,
		 		`<form action="/create_process" method="post">
		 			<p><input type="text" name="title" placeholder="title"></p>
		 			<p>
		 				<textarea name="description" placeholder="description"></textarea>
		 			</p>
		 			<p>
		 				${template.authorSelect(res2)}
		 			</p>
		 			<p>
		 				<input type="submit" value="submit">
		 			</p>
		 		</form>`,
		 		`<a href="/create">create</a>`
		 	);

		    response.writeHead(200);
		    response.end(html);
		    //client.end()
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
		var title = post.title.trim();	// 파일명 앞뒤의 공백제거
		var description = post.description;
		client.query('insert into topic(title, description, created, author_id) values($1, $2, now(), $3) RETURNING id' , [title, description, post.author], (err, res) => {
			if(err) {
				//console.log(err.stack)
				throw err;
			}
			//console.log(res);
	    	response.writeHead(302, {Location: `/?id=${res.rows[0].id}`});
			response.end('Success');
	    	//client.end()
		});
	});
}

exports.update = function(request, response) {
	var _url = request.url;
	var queryData = url.parse(_url, true).query;
	client.query('SELECT * FROM topic', (err, res) => {
		if(err) {
			//console.log(err.stack)
			throw err;
		}
		client.query(`SELECT * FROM topic where id=$1`, [queryData.id], (err2, res2) => {
			if(err2) {
				//console.log(err.stack)
				throw err2;
			}
			client.query('SELECT * FROM author', (err3, res3) => {
				console.log(res2)
				console.log(res3)
				var list = template.list(res);
				var html = template.HTML(sanitizeHtml(res2.rows[0].title), list,
				`<form action="/update_process" method="post">
					<input type="hidden" name="id" value="${res2.rows[0].id}">
					<p><input type="text" name="title" placeholder="title" value="${sanitizeHtml(res2.rows[0].title)}"></p>
					<p>
						<textarea name="description" placeholder="description">${sanitizeHtml(res2.rows[0].description)}</textarea>
					</p>
					<p>
						${template.authorSelect(res3, res2.rows[0].author_id)}
					</p>
					<p>
						<input type="submit" value="제출">
					</p>
				</form>`,
				`<a href="/create">create</a> <a href="/update?id=${res2.rows[0].id}">update</a>`
				);
				response.writeHead(200);
				response.end(html);
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
		var id = post.id;
		var title = post.title;
		var description = post.description;
		client.query(`UPDATE topic SET title=$1, description=$2, author_id=$3 WHERE id=$4`, [title, description, post.author, id], (err, res) => {
			if(err) {
				//console.log(err.stack)
				throw err;
			}
			response.writeHead(302, {Location: `/?id=${id}`});
		 	response.end('Success');
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
		var id = post.id;
		client.query(`DELETE from topic WHERE id=$1`, [id], (err, res) => {
			if(err) {
				//console.log(err.stack)
				throw err;
			}
			response.writeHead(302, {Location: `/`});
		 	response.end('Success');
		});
	});
}