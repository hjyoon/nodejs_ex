const template = require('../lib/template.js');
const auth = require('../lib/auth.js');

const express = require('express');
const router = express.Router();

router.get('/', function(req, res) { 
	var title = 'Welcome';
    var description = 'Hello, Node.js';
    var html = template.HTML(title, req.list,
 		`<a href="/topic/create">create</a>`,
 		`<h2>${title}</h2>
 		<p>${description}</p>
 		<img src="/images/logo.jpg" style="width:50%; height:50%; display:block;">`,
 		auth.authStatusUI(req, res)
 	);
    return res.send(html);
});

module.exports = router;