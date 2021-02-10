const { Client } = require('pg');
const client = new Client({
    user : 'postgres',
    host : 'localhost',
    database : 'userchat',
    password : 'jeonhyo251',
    port : 5432,
});

client.connect();

client.query('SELECT * FROM chat', (err, res) => {
    console.log(err)
    console.log(res)
    client.end()
});

//client.end()

// var pg = require('pg');
// var conString = "postgres://postgres:jeonhyo251@localhost:5432/userchat";

// 비밀번호는 별도의 파일로 분리해서 버전관리에 포함시키지 않아야 합니다. 
// var connection = pg.createConnection({
//   host     : 'localhost',
//   user     : 'postgres',
//   password : 'jeonhyo251',
//   database : 'opentutorials'
// });

// var client = new pg.Client(conString);
// client.connect();

// var query = client.query("SELECT * FROM chat");
// console.log(query);
  
// client.query('SELECT * FROM user', function (error, results, fields) {
//     if (error) {
//         console.log(error);
//     }
//     console.log(results);
// });
  
// client.end();