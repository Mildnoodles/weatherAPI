//const http = require('http');
const request = require('request');
//Libraries being used
const express = require('express');
const weather = express();
//const fs = require('fs');

//Server Variables
const hostname = '127.0.0.1';
const port = 8080;

//Temperature we need to report
var temp;

weather.get('/', function(req, res) {
    console.log("Waiting on a weather request...");
    res.end();
});

weather.get('/locations', function(req, res) {
    console.log("The proper invocation is: /locations/{us-zip-code}");
    res.end();
});

weather.get('/locations/:zipCode', async function (req, res) {
    res.statusCode = 200;
    //Zipcode
    let zipCode = req.params.zipCode;
    //Scale
    let scale = req.query.scale;
    if (!scale) {
        //This means scale is undefined so default to Fahrenheit
        scale = "Fahrenheit";
    }
    //Verifies the scale
    if (!(scale === "Celsius" || scale === "Fahrenheit")) {
        console.log("Invalid scale. Valid scales are \"Fahrenheit\" and \"Celsius\"");
    }
    else {
        let apiURL = 'http://api.openweathermap.org/data/2.5/weather?zip=' + zipCode + ',us&appid=089359c2f1c54e5fd5a266d6596445ac';   
        //var x = getWeather(apiURL, scale);
        getWeather(apiURL, scale).then((temperatureVal) => {
            let myObj = {
                temperature : temp,
                scale : scale
            };
            res.end(res.statusCode + "\n\n" + JSON.stringify(myObj, null, 5));
        }).catch((temperatureVal) => {
            console.log(temperatureVal);
        });
    }    
});

//Gets the information from the weather API
function getWeather(URL, scale) {
    return new Promise((resolve, reject) => {
        request(URL, function(err, response, body) {
            if (err) {
                reject('The request resulted in an error: ' + err);
            }
            else {
                //Process the information given by apiURL
                let weatherInfo = JSON.parse(body);
                //Temp is returned in Kelvin, so this converts Temp to Celsius
                temp = Math.round(weatherInfo.main.temp - 273);
                if (scale === "Fahrenheit") {
                    temp = temp * (9/5) + 32;
                }
                resolve(temp);                
            }
        });
    });
};

weather.listen(port, function() {
    console.log('Server is listening on port: ', port);
});
/*
const server = http.createServer((req, res) => {
    
    res.setHeader('Content-type', 'text/html');
    res.write(html);
    res.end();
});

server.listen(port, hostname, () => {
    console.log('Server started on port ' + port);
});

*/