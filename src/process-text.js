var fs = require("fs");

var toefl = [];
var gre = [];
var toeic = [];
var ielts = [];


var toeflArr = fs.readFileSync('../lib/toefl.txt').toString().split('\n');
var greArr = fs.readFileSync('../lib/gre.txt').toString().split('\n');
var toeicArr = fs.readFileSync('../lib/toeic.txt').toString().split('\n');
var ieltsArr = fs.readFileSync('../lib/ielts.txt').toString().split('\n');

for(let i = 0; i < toeflArr.length; i++){
    toefl.push(toeflArr[i].split('#')[0]);
}
for(let i = 0; i < greArr.length; i++){
    gre.push(greArr[i]);
}
for(let i = 0; i < toeicArr.length; i++){
    toeic.push(toeicArr[i].split('=')[0]);
}
for(let i = 0; i < ieltsArr.length; i+=2){
    ielts.push(ieltsArr[i]);
}

const vocab = {toefl:toefl, gre:gre, toeic:toeic, ielts:ielts};

fs.writeFile("../lib/vocab.json", JSON.stringify(vocab), 'utf8', function (err) {
    if (err) {
        return console.log(err);
    }
    console.log("The file is saved!");
}); 