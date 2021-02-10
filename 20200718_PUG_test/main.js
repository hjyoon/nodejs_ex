var express = require('express');
var pug = require('pug');
var app = express();

app.set('view engine','pug');
app.set('views','./views');

app.get('/', function (req, res) {   
    res.render('test',{MyData:'안녕!!'});
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
