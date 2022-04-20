const express = require('express');
const axios = require('axios');
const router = express.Router();
const locationURL = 'https://rest.gohighlevel.com/v1/locations/';
const calendarURL = 'https://rest.gohighlevel.com/v1/calendars/teams';
const gohighlevelBearerToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbl9pZCI6Imo4ZVdaU2ZObndSUUhkakxkVkN2IiwiY29tcGFueV9pZCI6IkJrUzZTUTF2T0k3NmQxU2ZvaW42IiwidmVyc2lvbiI6MSwiaWF0IjoxNjQ2OTgwNTMxNzk1LCJzdWIiOiJJTVhLUENlRndNQXlVNUc3TmV5TSJ9.JO8_nFUPZwyVnEd46lerAr909TXte-X4Di9iOdGq99M';
const apptBaseURL = 'https://api.leadconnectorhq.com';

router.post('/', function(req, res) {
  var intent = req.body.queryResult.intent.displayName;

  if (intent == "locationInfo"){
    axios.get(locationURL,{ headers: { 'Authorization': gohighlevelBearerToken} }).then(res => {
      let address = res.data.locations[0].address;
      let city = res.data.locations[0].city;
      let state = res.data.locations[0].state;
      let country = res.data.locations[0].country;
  
      let textResponse = `The studio is located at ${address}, ${city}, ${state}, ${country}.`;
      res.send(createTextResponse(textResponse));
  
    }).catch(err => {
      console.log(err);
    })
  }

  else if (intent == "testIntent"){
    const querystring = require('querystring');
    axios.get(calendarURL,{ headers: { 'Authorization': gohighlevelBearerToken} }).then(res => {
      let apptLink = res.data.teams[0].calendarConfig.link;
      //let apptURL = apptBaseURL + apptLink;
      let url = new URL (apptBaseURL + apptLink)
  
      let textResponse = `The link to make an appointment is ${url}.`;
      res.send(createTextResponse(textResponse));
  
    }).catch(err => {
      console.log(err);
    })
  }

  else if (intent == "contactInfo"){
    axios.get(locationURL,{ headers: { 'Authorization': gohighlevelBearerToken} }).then(res => {
      let phoneNumber = res.data.locations[0].phone;
      let email = res.data.locations[0].email;
      let website = res.data.locations[0].website;
  
      let textResponse = `Our website is ${website}, you can reach us at ${phoneNumber} or ${email}.`;
      res.send(createTextResponse(textResponse));
  
    }).catch(err => {
      console.log(err);
    })
  }

  else if (intent == 'matchLessonType'){
    var studentName = req.body.queryResult.parameters["Person"];
    var age = req.body.queryResult.parameters["age"];
    var phoneNumber = req.body.queryResult.parameters["phone-number"];
    var email = req.body.queryResult.parameters["email"];
    var data = `{\n "name": ${studentName}, \n "phone": ${phoneNumber} }`;

    axios.post("https://rest.gohighlevel.com/v1/contacts/", req_data,{ 
      headers: { 'Authorization': gohighlevelBearerToken},

    }).
    then(res => {
      console.log('res',res.data);
  
    }).catch(err => {
      console.log(err);
    })
  }

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