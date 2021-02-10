const template = require('../lib/template.js')
const client = require('../lib/db.js');
const sanitizeHtml = require('sanitize-html');
const auth = require('../lib/auth.js');

const express = require('express');
const router = express.Router();

router.get('*', function(request, response, next) {
	client.query('SELECT * FROM author', (err, res) => {
		request.list2 = template.authorTable(res);
		next();
	});
});

router.get('/', function(request, response) {
	client.query('SELECT * FROM author', (err2, res2) => {
		var title = 'author';
    	var html = template.HTML(title, request.list,
	 		``,
	 		`
	 		${request.list2}
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
	 		</form>`,
	 		auth.authStatusUI(request, response)
	 	);
    	return response.send(html);
	});
});

router.post('/create_process', function(request, response) {		// post
	if(auth.authIsOwner(request, response) == false) {
		return response.send('Login required!!');
	}
	var post = request.body;
	var description = post.description;
	client.query('insert into author(name, profile) values($1, $2)' , [post.name, post.profile], (err, res) => {
    	response.redirect(302, `/author`);
	});
});

router.post('/update_process', function(request, response) {		// post
	if(auth.authIsOwner(request, response) == false) {
		return response.send('Login required!!');
	}
	var post = request.body;
	var description = post.description;
	client.query('UPDATE author SET name=$1, profile=$2 WHERE id=$3' , [post.name, post.profile, post.id], (err, res) => {
		response.redirect(302, `/author`);
	});
});

router.post('/delete_process', function(request, response) {		// post
	if(auth.authIsOwner(request, response) == false) {
		return response.send('Login required!!');
	}
	var post = request.body;
	client.query('DELETE from topic WHERE author_id=$1', [post.id], (err, res) => {
		client.query('DELETE from author WHERE id=$1', [post.id], (err, res) => {
	    	response.redirect(302, `/author`);
		});
	});
});

router.get('/update/:authorId', function(request, response) {
	client.query('SELECT * FROM author', (err2, res2) => {
		client.query('SELECT * FROM author WHERE id=$1', [request.params.authorId], (err3, res3) => {
			var title = 'author';
    		var html = template.HTML(title, request.list,
		 		``,
		 		`
		 		${request.list2}
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
		 				<input type="hidden" name="id" value="${request.params.authorId}">
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
		 		</form>`,
		 		auth.authStatusUI(request, response)
	 		);
    		return response.send(html);
		});
	});
});

module.exports = router;