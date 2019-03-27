const expect = require('chai').expect;
const weather = require('../weather.js');
const request = require('supertest');

 
/*
  Test Cases:
  Good Zip
  Bad Zip
  Good Zip, bad scale
  Good Zip, celcius Scale
  Good Zip, Fahrenheit Scale
  Same cases, but with a bad zip
  Then additional malformed GET requests
 */ 

//Good Zip
describe("First Test", function() {
  it("Tests a good Zip code", function(done) {
    request(weather).get("/locations/24060")
        .expect(200)
        .expect(/200/, done)
  })
})

//Bad Zip
describe("Second Test", function() {
  it("Tests a bad Zip code", function(done) {
    request(weather).get("/locations/240")
        .expect(404)
        .expect(/The request resulted in an error: {"cod":"404","message":"city not found"}/, done)
  })
})

//Good Zip, bad scale
describe("Third Test", function() {
  it("Tests a good Zip code with a bad scale", function(done) {
    request(weather).get("/locations/24060?scale=c")
        .expect(404)
        .expect(/Invalid scale. Valid scales are "Fahrenheit" and "Celsius"/, done)
  })
})

//Good Zip, scale fahrenheit
describe("Fourth Test", function() {
  it("Tests a good Zip code with scale as Fahrenheit", function(done) {
    request(weather).get("/locations/24060?scale=Fahrenheit")
        .expect(200)
        .expect(/200 { "temperature": **, "scale": "Fahrenheit"} /, done)
  })
})

//Good Zip, scale Celsius
describe("Fifth Test", function() {
  it("Tests a good Zip code with scale as Celsius", function(done) {
    request(weather).get("/locations/24060?scale=Celsius")
        .expect(200)
        .expect(/200 { "temperature": **, "scale": "Fahrenheit"} /, done)
  })
})

//Bad Zip, bad scale
describe("Sixth Test", function() {
  it("Tests a bad Zip code and a bad scale", function(done) {
    request(weather).get("/locations/24060")
        .expect(200)
        .expect(/200/, done)
  })
})

//Bad Zip, scale Fahrenheit
describe("First Test", function() {
  it("Tests a good Zip code", function(done) {
    request(weather).get("/locations/24060")
        .expect(200)
        .expect(/200/, done)
  })
})

//Bad Zip, scale Celsius
describe("First Test", function() {
  it("Tests a good Zip code", function(done) {
    request(weather).get("/locations/24060")
        .expect(200)
        .expect(/200/, done)
  })
})