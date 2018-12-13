var mysql = require('mysql');
var jsonfile = require('jsonfile');
var express = require('express');
var app = express();
var fs = require('fs');

    fs.readFile(__dirname + "/" + "joinScholar.json", "utf8",
        async function (err, data) {
            var rawJson = JSON.parse(data);
            console.log("Data that haven't insert to DB :" + rawJson.length);
            for (i =0; i < rawJson.length; i++) {

                await promiseLoop(i ,rawJson)     
               
            }
        });

    function promiseLoop(i, rawJson) {
        return new Promise(resolve => {
            setTimeout(() => {
                var authorName = rawJson[i].authorName;
                var title = String((((rawJson[i].title).replace(",", " ")).replace("'", " ")).replace("'", " ")).replace("'", " ");
                var year = rawJson[i].year;

                console.log(i);

                // console.log(String(rawJson[475].title).replace(",", " "));
                // console.log(String(rawJson[476].title).replace(",", " "));

                // var test = String(("Sustainable Water Resources Development Planning for Phiang District  Sayaboury Province, Lao People's Democratic Republic").replace(",", " ")).replace("'", " ");
                // console.log(test);

                var pool = mysql.createPool({
                    connectionLimit: 10,
                    acquireTimeout: 30000,
                    host: 'localhost',
                    user: 'root',
                    password: 'pubroot',
                    database: 'pub_db_test'
                });

                pool.getConnection(function (err, conection) {
                    if (err) throw err;
                    console.log("Connected!");                        
                    
                    var sql = "INSERT INTO pub (`authorName`, `title`, `year`) VALUES ("+ "'" +  authorName +"'"+ "," + "'" + title + "'" + "," + "'" + year + "'" + ")";
                    conection.query(sql, function (err, result) {
                        if (err) throw err;
                        console.log(i + " record inserted"); 


                    });
                conection.release();
                });

                resolve()
            }, 50)
        });
        
    }


