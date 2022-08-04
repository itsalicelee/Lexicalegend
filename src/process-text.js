var fs = require("fs");

var toefl = [];
var gre = [];
var toeic = [];
var ielts = [];
var junior = [];
var senior = [];


var toeflArr = fs.readFileSync('./lib/toefl.txt').toString().split('\n');
var greArr = fs.readFileSync('./lib/gre.txt').toString().split('\n');
var toeicArr = fs.readFileSync('./lib/toeic.txt').toString().split('\n');
var ieltsArr = fs.readFileSync('./lib/ielts.txt').toString().split('\n');
var juniorArr = fs.readFileSync('./lib/junior.txt').toString().split('\n');
var seniorArr = fs.readFileSync('./lib/senior.txt').toString().split('\n');

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
for(let i = 0; i < juniorArr.length; i++){
    junior.push(juniorArr[i].split('@')[0]);
}
for(let i = 0; i < seniorArr.length; i++){
    senior.push(seniorArr[i].split('@')[0]);
}

const vocab = {TOEFL:toefl, GRE:gre, TOEIC:toeic, IELTS:ielts, JUNIOR: junior, SENIOR: senior};

fs.writeFile("./lib/vocab.json", JSON.stringify(vocab), 'utf8', function (err) {
    if (err) {
        return console.log(err);
    }
    console.log("The file is saved!");
});
