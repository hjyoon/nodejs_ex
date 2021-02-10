const express = require('express');
const ejs = require('ejs');
const app = express();

app.set('view engine','ejs');
//app.set('views','./views');

app.get('/', function (req, res) {
  //res.send('Hello World!');
  res.render('Sample',{MyData:'안녕!!'});
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
