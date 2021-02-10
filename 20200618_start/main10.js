var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring')
var path = require('path');

var template = require('./lib/template.js')

var sanitizeHtml = require('sanitize-html');

var app = http.createServer(function(request,response){
	var _url = request.url;
	var queryData = url.parse(_url, true).query;
	var pathname = url.parse(_url, true).pathname;
	
	if(pathname === '/') {
		if(queryData.id === undefined) {
			fs.readdir('./data', function(error, filelist) {
				console.log(filelist);
				var title = 'Welcome';
				var description = 'Hello, Node.js';
				var list = template.list(filelist);
				var html = template.HTML(title, list,
					`<h2>${title}</h2><p>${description}</p>`,
					`<a href="/create">create</a>`
				);
				response.writeHead(200);
				response.end(html);
			});
		}
		else {
			fs.readdir('./data', function(error, filelist){
				var filteredId = path.parse(queryData.id).base;
				fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
					var title = filteredId;
					var sanitizedTitle = sanitizeHtml(title);
					var sanitizeddescription = sanitizeHtml(description);
					var list = template.list(filelist);
					var html = template.HTML(sanitizedTitle, list,
						`<h2>${sanitizedTitle}</h2><p>${sanitizeddescription}</p>`,
						`
						<a href="/create">create</a>
						<a href="/update?id=${sanitizedTitle}">update</a>
						<form action="/delete_process" method="post">
							<input type="hidden" name="id" value="${sanitizedTitle}">
							<input type="submit" value="delete">
						</form>
						`
					);
					response.writeHead(200);
					response.end(html);
				});
			});
		}
	}
	else if(pathname === '/create') {
		fs.readdir('./data', function(error, filelist) {
			console.log(filelist);
			var title = 'WEB - create';
			var list = template.list(filelist);
			var html = template.HTML(title, list, `
				<form action="/create_process" method="post">
					<p><input type="text" name="title" placeholder="title"></p>
					<p>
						<textarea name="description" placeholder="description"></textarea>
					</p>
					<p>
						<input type="submit" value="제출">
					</p>
				</form>
			`,'');
			response.writeHead(200);
			response.end(html);
		});
	}
	else if(pathname === '/create_process') {
		var body = '';
		request.on('data', function(data) {
			//console.log(data);
			body = body + data;
		});
		request.on('end', function(data) {
			var post = qs.parse(body);
			var title = post.title.trim();	// 파일명 앞뒤의 공백제거
			var description = post.description;
			console.log(title);
			console.log(description);
			fs.writeFile(`data/${title}`, description, 'utf8', function(err) {
				response.writeHead(302, {Location: `/?id=${qs.escape(title)}`});
				response.end('Success');
			});
		});
	}
	else if(pathname === '/update') {
		fs.readdir('./data', function(error, filelist){
			var filteredId = path.parse(queryData.id).base;
			fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
				var title = filteredId;
				var list = template.list(filelist);
				var html = template.HTML(title, list,
					`
					<form action="/update_process" method="post">
						<input type="hidden" name="id" value="${title}">
						<p><input type="text" name="title" placeholder="title" value="${title}"></p>
						<p>
							<textarea name="description" placeholder="description">${description}</textarea>
						</p>
						<p>
							<input type="submit" value="제출">
						</p>
					</form>
					`,
					`<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
				);
				response.writeHead(200);
				response.end(html);
			});
		});
	}
	else if(pathname === '/update_process') {
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
			console.log(post);
			fs.rename(`data/${id}`, `data/${title}`, function(error) {
				fs.writeFile(`data/${title}`, description, 'utf8', function(err) {
					response.writeHead(302, {Location: `/?id=${qs.escape(title)}`});
					response.end('Success');
				});
			});
		});
	}
	else if(pathname === '/delete_process') {
		var body = '';
		request.on('data', function(data) {
			//console.log(data);
			body = body + data;
		});
		request.on('end', function(data) {
			var post = qs.parse(body);
			var id = post.id;
			var filteredId = path.parse(id).base;
			fs.unlink(`data/${filteredId}`, function(error) {
				response.writeHead(302, {Location: `/`});
				response.end('Success');
			});
			console.log(post);
		});
	}
	else {
		response.writeHead(404);
		response.end('Not found');
	}

});
app.listen(3000);