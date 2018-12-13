var fs = require('fs')
var jsonfile = require('jsonfile')

var newData = []

var promise1 = new Promise(function(resolve, reject) {
    fs.readFile('./scholar/getScholar0-4.json', 'utf8', async (err, data) => {
        if(err) {
            console.log(err)
        }
        newData = [...newData, ...JSON.parse(data)]
    
        for(var i = 5; i < 42; i++) {
            await joinJson(i)
        }
        resolve();
    })  
});

function joinJson(index) {
    return new Promise(resolve => {
        var url = './scholar/getScholar' + index + '.json'
        fs.readFile(url, 'utf8', (err, data) => {
            if(!err) {
                console.log('Get getScholar' + index + '.json')
                newData = [...newData, ...JSON.parse(data)]
            }
            resolve()
        })
    })
}

// #######################################################
// ###################### Main Here ######################
// #######################################################

promise1.then(() => {
    jsonfile.writeFile('./joinScholar.json', newData, function (err) {
        if (err) {
            console.error(err);
        }
    })
})