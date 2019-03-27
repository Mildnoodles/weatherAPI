//Libraries being used
const request = require('request');
const express = require('express');
const weather = express();

//Server Variables
const port = 8080;

//Temperature we need to report
var temp;

//The status code of the response
var statusCode;

/* Handle a proper GET request */
weather.get('/locations/:zipCode', function (req, res) {
    //
    res.statusCode = 200;
    //Zipcode
    let zipCode = req.params.zipCode;
    //Scale: Celsius or Fahrenheit. Fahrenheit by default.
    let scale = !req.query.scale ? "Fahrenheit" : req.query.scale;
    
    //Verifies the Scale is an acceptable value
    if (!(scale === "Celsius" || scale === "Fahrenheit")) {
        res.end("Invalid scale. Valid scales are \"Fahrenheit\" and \"Celsius\"");
    }
    else {
        let apiURL = 'http://api.openweathermap.org/data/2.5/weather?zip=' + zipCode + ',us&appid=089359c2f1c54e5fd5a266d6596445ac'; 
        //Executes getWeather and waits for the call to finish
        getWeather(apiURL, scale).then((temperatureVal) => {
            //Contains the information we need to report
            let myObj = {
                temperature : temp,
                scale : scale
            };
            //Assign the status code to the response statusCode field
            res.statusCode = statusCode;
            res.end(res.statusCode + "\n\n" + JSON.stringify(myObj, null, 5));
        }).catch((temperatureVal) => {
            /* This deals with all malformed GET requests */
            //Assign the status code to the response statusCode field
            res.statusCode = statusCode;
            res.end('The request resulted in an error: ' + JSON.stringify(temperatureVal));
        });
    }    
});

/* Gets the information from the weather API, apiURL */
function getWeather(URL, scale) {
    return new Promise((resolve, reject) => {
        request(URL, function(err, response, body) {
            //Parses the information supplied by the weather api
            let weatherInfo = JSON.parse(body);
            //If the cod is not 200, there was a malformed GET request
            if (weatherInfo.cod !== 200) {
                reject(weatherInfo);
            }
            else {
                //Process the information given by apiURL
                //Temp is returned in Kelvin, so this converts Temp to Celsius
                temp = Math.round(weatherInfo.main.temp - 273);
                if (scale === "Fahrenheit") {
                    temp = temp * (9/5) + 32;
                }
                resolve(temp);                
            }
            //Set the status code of the response
            statusCode = weatherInfo.cod;
        });
    });
};

/* These get's handle when the GET request is not entered in the specified format or when the page first loads */
weather.get('/*', function(req, res) {
    res.end("The proper format is: http://localhost:8080/locations/{us-zip-code}{?scale={Celcius Or Fahrenheit}");
});

/* Express listener */
weather.listen(port, function() {
    console.log('Server is listening on port: ', port);
});
