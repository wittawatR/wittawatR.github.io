var request1 = require('request');
var jsonfile = require('jsonfile');
var express = require('express');
var app = express();
var fs = require('fs');

request1.get('https://cvs.enit.kku.ac.th/cv/objectData?dep_id&name&keyword&fbclid=IwAR1fSBEBQBuTbmA4nxgv0eCxX1fo51103Rh2ss2IwqwX1bnjW9b-bNKHIlI',
	(error, response, body) => {
		if (error) {
			return console.dir(error);
		}
		var rawJson = JSON.parse(body);
		var file = 'profData.json';
		
		var newData = []

		for (i = 0; i < rawJson.length; i++) {
			var enName = rawJson[i].EMP_ENG_FIRST_NAME + " " + rawJson[i].EMP_ENG_LAST_NAME;
			var thName = rawJson[i].EMP_TH_FIRST_NAME + " " + rawJson[i].EMP_TH_LAST_NAME;
			var deptId = rawJson[i].DEP_ID;
			var deptName;

			switch (deptId) {
                case 401:
                    deptName = 'วิศวกรรมโยธา';
                    break;
                case 402:
                    deptName = 'วิศวกรรมไฟฟ้า';
                    break;
                case 403:
                    deptName = 'วิศวกรรมเกษตร';
                    break;
                case 404:
                    deptName = 'วิศวกรรมอุตสาหการ';
                    break;
                case 405:
                    deptName = 'วิศวกรรมเครื่องกล';
                    break;
                case 406:
                    deptName = 'วิศวกรรมสิ่งแวดล้อม';
                    break;
                case 407:
                    deptName = 'วิศวกรรมเคมี';
                    break;
                case 408:
                    deptName = 'วิศวกรรมคอมพิวเตอร์';
                    break;
            }

			var jsonData = {
				"profNameEN": enName,
				"profNameTH": thName,
				"deptName": deptName
			}
			newData.push(jsonData)
		}
		jsonfile.writeFile(file, newData, function (err) {
			if (err) {
				console.error(err);
			}
		})

		var server = app.listen(8081, function () {
			console.log('=== The values of the second course and the residence ===');
		})

	});

