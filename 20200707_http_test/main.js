var http = require('http');

var app = http.createServer(function(request,response){
    const { headers, method, url } = request;
    let body = [];
    if(url == '/'){
        request.on('error', (err) => {
            console.error(err);
        }).on('data', (chunk) => {
            body.push(chunk);
        }).on('end', () => {
            body = Buffer.concat(body).toString();
            //response.statusCode = 200;
            //response.setHeader('Content-Type', 'application/json');
            //response.setHeader('Content-Type', 'text/plain');

            //response.setHeader('Content-Type', 'text/html');
        	//response.writeHead(200, {'Content-Type': 'text/plain'});
            response.writeHead(200);
            //response.end('hello');
            //response.write('<h1>hello</h1>');

            const responseBody = { headers, method, url, body };

            //response.write('hello');
            //response.write(JSON.stringify(responseBody));
            response.write(`{"title":"hello","content":"test"}`);
            response.end();
        });
    }
    else {
        response.statusCode = 404;
        response.end('404 Not Found');
    }
});
app.listen(3000);