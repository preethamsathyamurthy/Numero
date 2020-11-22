const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

//loading numbers model
const numbers = require("./db/models/metrics");
//loading mongoose db connection
const mongoose = require("./db/connection");


//////////////////////////////////////////////////
//initializing express
const app = express();
//parse the response body in json
app.use(bodyParser.json());
// cors used to remove cross origin problems and accept from any origin
app.use(cors());

/////////////////////////////////////////////////
function ReduceMinutesToDate(date,minutes) {
  return new Date(date.getTime() - minutes * 60000);
}

//check if object is empty
function isEmpty(obj) {
  for(var key in obj) {
      if(obj.hasOwnProperty(key))
          return false;
  }
  return true;
}

////////////////////////////////////////////////
app.get('/metric', (req, res) => {
const {body} = req;
console.log(body);

if(!(isEmpty(body)))
{
  res.status(422).send(['Unable to process the body. The input body should be empty or null}']);
}
else
{
   //getting time 5 minutes ago
   let date = new Date();
   let startTime5 = ReduceMinutesToDate(date,5);
   startTime5.setSeconds(0,0);
   let endTime5 = new Date(startTime5.getTime());
   endTime5.setSeconds(59,999);

   //getting time 10 minutes ago
   let startTime10 = ReduceMinutesToDate(date,10);
   startTime10.setSeconds(0,0);
   let endTime10 = new Date(startTime10.getTime());
   endTime10.setSeconds(59,999);

   //getting time 30 minutes ago
   let startTime30 = ReduceMinutesToDate(date,30);
   startTime30.setSeconds(0,0);
   let endTime30 = new Date(startTime30.getTime());
   endTime30.setSeconds(59,999);
  
   let cumulation = [];
   //getting values created in the last 5 minutes
   numbers.find({
     $or: [
       {
          createdAt: {
            $gte: startTime5,
            $lte: endTime5
          }
        },
        {
          createdAt: {
            $gte: startTime10,
            $lte: endTime10
          }
        },
        {
          createdAt: {
            $gte: startTime30,
            $lte: endTime30
          }
        }
    ]
    }, function(err, result) {
     if (err) {
       res.status(500).send(err);
     } else {
       result.forEach(Element => {
         //summarization of values
         cumulation.push(Element['number']);
       });
       res.send(cumulation);
     }
   });
  }

 });

//POST Method
app.post('/metric',async (req,res) => {
  const { data } = req.body;
  //checking if data is an array and contains only numberic values
  if((!(Array.isArray(data))) || (data.some(isNaN)))
  {
    res.status(422).send(['Unable to process the data. Please send an input of datatype {\'data\': numbers[1-5]}']);
  }
  //checking if the length of the array is 1 to 5
  else if((data.length > 5) || (data.length == 0))
  {
    res.status(422).send(['Unable to process the data. The minimum and the maximum length of the array should be 1 and 5 respectively']);
  }
  else
  {
    let numeroType = []
    //pre-processing the input to support the insert
    data.forEach(Element => {
      numeroType.push ({
        'number': Element
      })
    });
    //inserting the input
    numbers.insertMany(numeroType, function(err, result) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(201).send(result);
      }
    }); 
  }
});

/*
//getting all values from x minutes ago
app.get('/metrics', (req, res) => {
  let { minutes } = req.body;
  //default value would be 5 - if any value is passed, that value would be picked
  if(!(minutes === undefined))
  {
    if(isNaN(minutes))
    {
      res.status(422).send('The input body should be of datatype {\'minutes\' : number} or empty');
      return null;
    }
  }
  else
  {
    minutes = 5;
  }
  console.log('minutes: ' + minutes);
   //getting time 5 minutes ago
   let date = ReduceMinutesToDate(new Date(),minutes);

   //let Sum = 0;
   let cumulation = [];
   //getting values created in the last 5 minutes
   numbers.find({
     createdAt: {$gt: date}
   }, function(err, result) {
     if (err) {
       res.status(500).send(err);
     } else {
       result.forEach(Element => {
         //summarization of values
         //Sum += Element['number'];
         cumulation.push(Element['number']);
       });
       res.send(cumulation);
     }
   });
 });
*/


module.exports = {app, mongoose};
