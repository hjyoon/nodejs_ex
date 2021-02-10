const template = require('../lib/template.js')
const client = require('../lib/db.js');
const sanitizeHtml = require('sanitize-html');
const auth = require('../lib/auth.js');

const express = require('express');
const router = express.Router();

router.get('/create', function(request, response) {
	client.query('SELECT * FROM author', (err2, res2) => {
		var title = 'Create';
	    var html = template.HTML(sanitizeHtml(title), request.list,
	 		`<a href="/topic/create">create</a>`,
	 		`<form action="/topic/create_process" method="post">
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
	 		auth.authStatusUI(request, response)
	 	);
	    return response.send(html);
	});
});

router.post('/create_process', function(request, response) {	// post
	var post = request.body;
	var title = post.title.trim();	// 파일명 앞뒤의 공백제거
	var description = post.description;
	client.query('insert into topic(title, description, created, author_id) values($1, $2, now(), $3) RETURNING id' , [title, description, post.author], (err, res) => {
    	response.redirect(302, `/topic/${res.rows[0].id}`);
	});
});

router.post('/delete_process', function(request, response) {	// post
	if(auth.authIsOwner(request, response) == false) {
		return response.send('Login required!!');
	}
	var post = request.body;
	var id = post.id;
	client.query(`DELETE from topic WHERE id=$1`, [id], (err, res) => {
	 	response.redirect(302, `/`);
	});
});

router.post('/update_process', function(request, response) {	// post
	if(auth.authIsOwner(request, response) == false) {
		return response.send('Login required!!');
	}
	var post = request.body;
	var id = post.id;
	var title = post.title;
	var description = post.description;
	client.query(`UPDATE topic SET title=$1, description=$2, author_id=$3 WHERE id=$4`, [title, description, post.author, id], (err, res) => {
	 	response.redirect(302, `/topic/${id}`);
	});
});

router.get('/update/:pageId', function(request, response) {
	client.query(`SELECT * FROM topic where id=$1`, [request.params.pageId], (err2, res2) => {
		client.query('SELECT * FROM author', (err3, res3) => {
			console.log(res2)
			console.log(res3)
			var html = template.HTML(sanitizeHtml(res2.rows[0].title), request.list,
			`<a href="/topic/create">create</a> <a href="/topic/update/${res2.rows[0].id}">update</a>`,
			`<form action="/topic/update_process" method="post">
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
			auth.authStatusUI(request, response)
			);
			return response.send(html);
		});
	});
});

router.get('/:pageId', function(request, response) {
	client.query(`SELECT * FROM topic LEFT JOIN author on topic.author_id=author.id where topic.id=$1`, [request.params.pageId], (err2, res2) => {
	    var title = res2.rows[0].title;
	    var description = res2.rows[0].description;
	    var html = template.HTML(title, request.list,
	 		`<a href="/topic/create">create</a>
	 		<a href="/topic/update/${request.params.pageId}">update</a>
 			<form action="/topic/delete_process" method="post">
 				<input type="hidden" name="id" value="${request.params.pageId}">
 				<input type="submit" value="delete">
 			</form>`,
 			`<h2>${sanitizeHtml(title)}</h2>
	 		<p>${sanitizeHtml(description)}</p>
	 		<p>by ${sanitizeHtml(res2.rows[0].name)}</p>`,
	 		auth.authStatusUI(request, response)
	 	);
	    return response.send(html);
	});
});

module.exports = router;