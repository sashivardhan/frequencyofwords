var express = require('express'),
    bodyParser = require("body-parser"),
    rp = require('request-promise');
    


var app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

var requiredCount;
//Get Home Page
app.get("/", function(req, res) {
    var countOfWords;
    res.render(__dirname + "/views/index.ejs", {
        countOfWords: countOfWords
    });
});

//Post to root url
app.post("/", function(req, res) {
    requiredCount = req.body.count;
    finalWordsArray(res);

});

//reads file asyncronously and renders the view with result
var finalWordsArray = function(res) {

        rp.get('http://terriblytinytales.com/test.txt')
            .then(function(result) {
                return count(result);
            })
            .then(function(countOfWords) {
                res.render(__dirname + "/views/index.ejs", {
                    countOfWords: countOfWords,
                    requiredCount: requiredCount
                });
         });
    }

//handles the word count logic
var count = function(body) {
    var text = body;
    var text = text.replace(/[\t\n]+/g, ' ', '\xa0');
    var arrayOfWords = text.split(' ');
    var mapOfWords = {};

    arrayOfWords.forEach(function(key) {
        if (mapOfWords.hasOwnProperty(key)) {
            mapOfWords[key]++;
        } else {
            mapOfWords[key] = 1;
        }
    });

    var finalWordsArray = Object.keys(mapOfWords).map(function(key) {
        return {
            word: key,
            count: mapOfWords[key]
        };
    });

    finalWordsArray.sort(function(a, b) {
        return b.count - a.count;
    });

    return finalWordsArray;
};


app.listen(8080, function() {
    console.log("The server Has Started on port 8080!");
});