var jsonfile = require('jsonfile');
var fs = require('fs')

var newData = []

var currentPublish = 0
var offset = 6 // err: 46
var author = "";
var file = './scholar/getScholar' + offset + '.json' 

var url = './advisor.json'


// Main here

fs.readFile(url, 'utf8', async (err, data) => {
	if(err) {
		console.log(err)
	}
	var advisors = JSON.parse(data)
	author = advisors[offset].EMP_ENG_FIRST_NAME + ' ' + advisors[offset].EMP_ENG_LAST_NAME
	
	getPublis()
	
	// var jsonlength = advisors.length
	// for(var k = offset; k < (offset+1) && k < jsonlength; k++) {

	// 	await getPublis(advisors, k)
	
	// }
	// jsonfile.writeFile(file, newData, function (err) {
	// 	if (err) {
	// 		console.error(err);
	// 	}
	// })
});



async function getPublis() {

	console.log('Get publish from ' + author)

	for(var nextAuthor = false; nextAuthor == false; ) {	
		nextAuthor = await getPublisPage(author)		
	}
	console.log('Get success')
	console.log()
	if(newData != []) {
		jsonfile.writeFile(file, newData, function (err) {
			if (err) {
				console.error(err);
			}
		})
	}
}


// sub function to get data

function getPublisPage(author) {
	return new Promise(resolve => {
		console.log('Current :' + currentPublish)
		nextAuthor = false
		var spawn = require("child_process").spawn;		
		var process = spawn('python',["./scholar.py-master/scholar.py", "-a", author, "-c", currentPublish]);

		process.stdout.on('data', function(data) {
			var stringData = data.toString('utf8')
			if(stringData.search("MarkUp_Tag") != 0) {
				sliceData(stringData, author)
			} else {
				nextAuthor = true
			}
		
			setTimeout(() => {
				
				resolve(nextAuthor)
				
			}, 3000);
		})
	})
}

// slice data to create obj

async function sliceData(data, author) {
	var bufferString = data
	var firstPoint = bufferString.search("Title")

	if(firstPoint != -1) {
		for(; firstPoint != -1; firstPoint = bufferString.search("Title")) {

			currentPublish++
			bufferString = await cutText(bufferString, firstPoint, author)
			
		}

	}
	console.log('Page success')
}


// sub function of sliceData for cut string to create obj

function cutText(bufferString, firstPoint, author) {	
	
	return new Promise(resolve => {
		
		var newBufferString = bufferString
		var endPoint = newBufferString.search("Excerpt")
		var slicePublish = newBufferString.slice(firstPoint, endPoint)

		var yearPoint = slicePublish.search("Year")

		if(yearPoint != -1) {

			var urlPoint = slicePublish.search("URL")

			var title = slicePublish.slice(6, urlPoint-13)
			var year = slicePublish.slice(yearPoint+5, yearPoint+9)

			var obj = {
				authorName: author,
				title: title,
				year: year
			}

			newData.push(obj)

		}		
		newBufferString = newBufferString.replace("Title", " ")
		newBufferString = newBufferString.replace("Excerpt", " ")
		resolve(newBufferString)
	})
}





// // loop for get data (1 loop per page) 
// function getPublis(advisors, index) {
// 	author = advisors[index].EMP_ENG_FIRST_NAME + ' ' + advisors[index].EMP_ENG_LAST_NAME
// 	console.log('Get publish from ' + author)
// 	return new Promise(async (resolve) => {
// 		for(nextAuthor = false, i = 0; nextAuthor == false; i++) {	

// 			nextAuthor = await getPublisPage(author, i)
			
// 		}
// 		console.log('Get success')
// 		console.log()
// 		resolve()
// 	})
// }


// // sub function to get data 
// function getPublisPage(author, page) {
// 	return new Promise(resolve => {
// 		var spawn = require("child_process").spawn;			
// 		var process = spawn('python',["./scholar.py-master/scholar.py", "-a", author, "-c", 10*page]);
// 		// process.stderr.on('data', (data) => {
// 		// 	if( `${data}`.search("_parse_article") != -1) {		
// 		// 		nextAuthor = true
// 		// 		setTimeout(() => {
// 		// 			resolve(nextAuthor)
// 		// 		}, 5000);
// 		// 	}
// 		// });
// 		process.stdout.on('data', function(data) {
// 			var stringData = data.toString('utf8')
// 			nextAuthor = sliceData(stringData, author)
// 			setTimeout(() => {
// 				resolve(nextAuthor)
// 			}, 5000);
// 		})
// 	})
// }


// // slice data to create obj

// async function sliceData(data, author) {

// 	bufferString = data

// 	for(var j = 0; j < 10; j++) {
// 		var firstPoint = bufferString.search("Title")

// 		if(firstPoint == -1) {
// 			nextAuthor = true
// 			break;
// 		} else {
// 			bufferString = await cutText(firstPoint, author)
// 			nextAuthor = false
// 		}
// 	}
// 	console.log('Page success')
// 	return (nextAuthor)
// }


// // sub function of sliceData for cut string to create obj

// function cutText(firstPoint, author) {	
// 	return new Promise(resolve => {

// 		var endPoint = bufferString.search("Excerpt")
// 		var slicePublish = bufferString.slice(firstPoint, endPoint)

// 		var yearPoint = slicePublish.search("Year")

// 		if(yearPoint != -1) {

// 			var urlPoint = slicePublish.search("URL")

// 			var title = slicePublish.slice(6, urlPoint-13)
// 			var year = slicePublish.slice(yearPoint+5, yearPoint+9)

// 			var obj = {
// 				authorName: author,
// 				title: title,
// 				year: year
// 			}

// 			newData.push(obj)

// 		}		
// 		bufferString = bufferString.replace("Title", " ")
// 		bufferString = bufferString.replace("Excerpt", " ")
// 		resolve(bufferString)
// 	})
// }