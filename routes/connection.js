var express = require('express');
var axios = require('axios');
var router = express.Router();
const locationURL = 'https://rest.gohighlevel.com/v1/locations/';
const calendarURL = 'https://rest.gohighlevel.com/v1/calendars/teams';
const gohighlevelBearerToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbl9pZCI6Imo4ZVdaU2ZObndSUUhkakxkVkN2IiwiY29tcGFueV9pZCI6IkJrUzZTUTF2T0k3NmQxU2ZvaW42IiwidmVyc2lvbiI6MSwiaWF0IjoxNjQ2OTgwNTMxNzk1LCJzdWIiOiJJTVhLUENlRndNQXlVNUc3TmV5TSJ9.JO8_nFUPZwyVnEd46lerAr909TXte-X4Di9iOdGq99M';

router.post('/', function(req, res, next) {

  axios.get(locationURL,{ headers: { 'Authorization': gohighlevelBearerToken} }).then(aRes => {
    let address = aRes.data.locations[0].address;
    let city = aRes.data.locations[0].city;
    let state = aRes.data.locations[0].state;
    let country = aRes.data.locations.country;

    let textResponse = `The studio is located at ${address}, ${city}, ${state}, ${country}.`;
    res.send(createTextResponse(textResponse));

  }).catch(err => {
    console.log(err);
  })

});

router.post('/', function(req, res, next) {

  axios.get(calendarURL,{ headers: { 'Authorization': gohighlevelBearerToken} }).then(aRes => {
    let apptLink = aRes.data.teams[0].calendarConfig.link;

    let textResponse = `The link to make an appointment is ${apptLink}.`;
    res.send(createTextResponse(textResponse));

  }).catch(err => {
    console.log(err);
  })

});

function createTextResponse(textResponse){
  let response = {
    "fulfillmentText": "This is a text response",
    "fulfillmentMessages": [
      {
        "text": {
          "text": [
            textResponse
          ]
        }
      }
    ],
    "source": "example.com",
    "payload": {
      "google": {
        "expectUserResponse": true,
        "richResponse": {
          "items": [
            {
              "simpleResponse": {
                "textToSpeech": "this is a simple response"
              }
            }
          ]
        }
      },
      "facebook": {
        "text": "Hello, Facebook!"
      },
      "slack": {
        "text": "This is a text response for Slack."
      }
    }
  }
  return response;
}

module.exports = router;