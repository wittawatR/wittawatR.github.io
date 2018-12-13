
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');
 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    return next();
});

// connection configurations
const mc = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'pubroot',
    database: 'pub_db_test'
});
 
// connect to database
mc.connect();

// defind route
app.get('/', function (req, res) {
    return res.send({ error: true, message: 'hello!! you must use option of our api' })
});
  
app.get('/showData/:profName', function (req, res) {
    let profNameReq = req.params.profName;
    let year = req.query.year;

    if (year) {
        mc.query("SELECT title, year FROM pub WHERE authorName='" + profNameReq + "' AND year=" + year, function (error, results, fields) {
            if (error) throw error;
            return res.send(results);
        });
    } else {
        mc.query("SELECT title, year FROM pub WHERE authorName=? ORDER BY year DESC",profNameReq , function (error, results, fields) {
            if (error) throw error;
            return res.send(results);
        });
    }
});

app.get('/fail', function (req, res) {
    mc.query("SELECT b.* FROM (SELECT authorName , COUNT(authorName) as pubNum FROM pub WHERE year > 2013 GROUP BY authorName) as b WHERE pubNum < 3", function (error, results, fields) {
        if (error) throw error;
        return res.send(results);
    });
});

app.get('/scholar/:title', function (req, res) {
    let titleReq = req.params.title;
    mc.query("SELECT authorName FROM pub WHERE title=?", titleReq, function (error, results, fields) {
        if (error) throw error;
        if (results == "") {
            return res.send("NotUse");
        } else {
            return res.send(results);
        }
    });
});

app.listen(8080, function () {
    console.log('Node app is running on port 8080');
});