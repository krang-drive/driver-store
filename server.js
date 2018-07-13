//----------------------------------------------------------------------------//
//                               Imports & Constants                          //
//----------------------------------------------------------------------------//

//Importing express module
const express = require('express');

//Setting express to a constant
const app = express();

//Importing mongoose module
var mongoose = require('mongoose');

//Importing body-parser module.
var bodyParser = require('body-parser');

//Setting up constant values for connecting to the database.
const host = process.env.DATABASE_HOST || "driver-store-db";
const port = process.env.DATABASE_PORT || 27017;
const database = process.env.DATABASE_NAME || "driverdb";
const user = process.env.DATABASE_USER || 'nodejs';
const pass = process.env.DATABASE_PASS || 'nodejs';
const url = `mongodb://${user}:${pass}@${host}:${port}/${database}`;

//Connecting mongoose to MongoDB
mongoose.connect(url);

//Setting the schema to use mongoose.
var Schema = mongoose.Schema;

//----------------------------------------------------------------------------//
//                               Schema & Model Creation                      //
//----------------------------------------------------------------------------//

//Creating a driverSchema.
var driverSchema = new Schema({

    driverId: String,
    routeId: String,
    curentLocation: String,
    online: Boolean,
    carSize: String,
    money: Number

})

//Create a model that uses the schema.
var driver = mongoose.model('driver', driverSchema);

//Make this available to Node app users.
module.exports = driver;

//----------------------------------------------------------------------------//
//                               Function Calls                               //
//----------------------------------------------------------------------------//

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

//----------------------------------------------------------------------------//

app.get('/', function (req, res) {

  res.send("Hello, World!");

});

//----------------------------------------------------------------------------//

app.get('/drivers', function (req, res) {

    driver.find( {$and:[{routeId: null}, {online: true}]}, function (err, docs) {

      if(!err){

          res.send(docs);

          console.log("Online drivers found.");

      }
      else {

          res.send(err);

          console.log("Error, no drivers found!");

      }

    });

});

//----------------------------------------------------------------------------//

app.post('/drivers', function(req, res){

  let driverId = req.body.driverId;

  driver.findOneAndUpdate({driverId: req.body.driverId}, req.body.online , {upsert:true}, function(err, doc) {

    //Writing out the post information to console.
    if (!err) {

      res.send(doc);

      console.log('POST -> driverID: ' + req.body.driverId + ', online: ' + req.body.online);

    }
    else {

      res.send(err);

      console.error("Error, no drivers updated!")

    }

  });

});

//----------------------------------------------------------------------------//

app.get('/drivers/:id', function(req, res){

    var id = req.params['id'];

    driver.find({driverId: id}, function (err, doc){

        if(!err){

            res.send(doc);

            console.log('Success! Driver found!');

        }
        else{

            res.send(err);

            console.error("Error, no drivers found!")

        }

    });



});

//----------------------------------------------------------------------------//

app.listen(8080, function() {

  console.log('Listening on port 8080!')

});
