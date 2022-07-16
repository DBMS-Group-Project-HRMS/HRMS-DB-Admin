require('dotenv').config();
const fs = require('fs');

var mysql = require('mysql');

// var con = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_DATABASE,
//   multipleStatements: true
// });

var config =
{
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: 3306,
    multipleStatements: true,
    ssl: {ca: fs.readFileSync(__dirname +'/DigiCertGlobalRootCA.crt.pem')}
};

const con = new mysql.createConnection(config);

con.connect(
    function (err) { 
    if (err) { 
        console.log("!!! Cannot connect !!! Error:");
        throw err;
    }
    else
    {
       console.log("Connection established.");
    }
});

module.exports = con;