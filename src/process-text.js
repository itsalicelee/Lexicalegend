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


// check if text is valid
function checkEnglish(text){
    let pattern = /^[A-Za-z .]*[A-Za-z.][A-Za-z -.]*$/;
    let match = pattern.test(text);
    // if(match === false){
    //     console.log(text);
    // }
    return match
}

for(let i = 0; i < toeflArr.length; i++){
    text = toeflArr[i].split('#')[0];
    if(checkEnglish(text) === true){
        toefl.push(text);
    }
}
for(let i = 0; i < greArr.length; i++){
    text = greArr[i];
    if(checkEnglish(text) === true){
        gre.push(text);
    }
}
for(let i = 0; i < toeicArr.length; i++){
    text = toeicArr[i].split('=')[0];
    if(checkEnglish(text) === true){
        toeic.push(text);
    }
}
for(let i = 0; i < ieltsArr.length; i+=2){
    text = ieltsArr[i];
    if(checkEnglish(text) === true){
        ielts.push(text);
    }
}
for(let i = 0; i < juniorArr.length; i++){
    text = juniorArr[i].split('@')[0];
    if(checkEnglish(text) === true){
        junior.push(text);
    }
}
for(let i = 0; i < seniorArr.length; i++){
    text = seniorArr[i].split('@')[0]
    if(checkEnglish(text) === true){
        senior.push(text);
    }
}

const vocab = {TOEFL:toefl, GRE:gre, TOEIC:toeic, IELTS:ielts, JUNIOR: junior, SENIOR: senior};

fs.writeFile("./lib/vocab.json", JSON.stringify(vocab), 'utf8', function (err) {
    if (err) {
        return console.log(err);
    }
    console.log("The file is saved!");
    console.log("TOEFL:", toefl.length);
    console.log("GRE:", gre.length);
    console.log("IELTS:", ielts.length);
    console.log("JUNIOR:", junior.length);
    console.log("SENIOR:", senior.length);
});
