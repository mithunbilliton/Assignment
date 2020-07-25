var fs = require('fs');
var http = require('http');
var url = 'http://norvig.com/big.txt' 
var dest = 'file.txt'
let request = require('request');
const { Promise } = require('mongoose');
const { resolve } = require('path');


var download =new Promise(function(cb) {
  var file = fs.createWriteStream(dest);
  http.get(url, function(response) {
    response.pipe(file);
    file.on('finish', function() {
      file.close(cb);
      resolve()
    });
  });
});
download.then(()=>{
  readDoc()
})

function readDoc(){

fs.readFile(dest, 'utf8', function (err, data) {
  if (err) throw err;
  var wordsArray = splitByWords(data);
  var wordsMap = createWordMap(wordsArray);
  var finalWordsArray = sortByCount(wordsMap);
   for(let i =0;i<= 10;i++){
        var url1 = 'https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=dict.1.1.20170610T055246Z.0f11bdc42e7b693a.eefbde961e10106a4efa7d852287caa49ecc68cf&lang=en-ru&text='+finalWordsArray[i].name       
        request.get(url1, { json: true }, (err, res, body) => {
        if (err) { return console.log(err); }
        console.log('The word "' + finalWordsArray[i].name + '" appears in the file ' +
        finalWordsArray[i].total + ' times');//number of times the word has repeated
        console.log('Synonyms and pos of the word "' + finalWordsArray[i].name + '"',body.def);//Synonyms and pos of the word
    });


   }

});
}


function splitByWords (text) {
  var wordsArray = text.split(/\s+/);
  return wordsArray;
}


function createWordMap (wordsArray) {
  var wordsMap = {};
  wordsArray.forEach(function (key) {
    if (wordsMap.hasOwnProperty(key)) {
      wordsMap[key]++;
    } else {
      wordsMap[key] = 1;
    }
  });

  return wordsMap;

}


function sortByCount (wordsMap) {
  var finalWordsArray = [];
  finalWordsArray = Object.keys(wordsMap).map(function(key) {
    return {
      name: key,
      total: wordsMap[key]
    };
  });

  finalWordsArray.sort(function(a, b) {
    return b.total - a.total;
  });

  return finalWordsArray;

}