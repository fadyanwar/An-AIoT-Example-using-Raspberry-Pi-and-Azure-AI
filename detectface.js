'use strict';

const request = require('request');
const fs = require("fs");
const PiCamera = require('pi-camera');

const myCamera = new PiCamera({
    mode: 'photo',
    output: `${ __dirname }/photo.jpg`,
    width: 640,
    height: 480,
    nopreview: true,
  });


myCamera.snap()
  .then((result) => {
    // Your picture was captured

    // Replace <Subscription Key> with your valid subscription key.
    const subscriptionKey = '<Subscription Key> ';

    //put your endppoint url here
    const uriBase = 'https://endpoint.cognitiveservices.azure.com/face/v1.0/detect';

    
    const imageBuffer = fs.readFileSync('photo.jpg'); //I found this easier to debug
    
    // Request parameters.
    const params = {
        'returnFaceId': 'true',
        'returnFaceLandmarks': 'false',
        'returnFaceAttributes': 'age,gender,headPose,smile,facialHair,glasses,' +
            'emotion,hair,makeup,occlusion,accessories,blur,exposure,noise'
    };

    const options = {
        uri: uriBase,
        qs: params,
        body: imageBuffer,
        headers: {
            'Content-Type': 'application/octet-stream',
            'Ocp-Apim-Subscription-Key' : subscriptionKey
        }
    };

    request.post(options, (error, response, body) => {
    if (error) {
        console.log('Error: ', error);
        return;
    }
    let jsonResponse = JSON.stringify(JSON.parse(body), null, '  ');
    console.log('JSON Response\n');
    console.log(jsonResponse);
    });
  })
  .catch((error) => {
     // Handle your error
     console.log('Error: ', error)
  });


