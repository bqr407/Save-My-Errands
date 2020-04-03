const express = require('express');
var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const app = express();
var mysql = require('mysql');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.set('view engine', 'pug');

// Main page that has the map with user location and visible errand requests
app.get('/', function (req, res) {

  res.redirect("https://www.savemyerrands.com/main");

});

app.get('/main', function (req, res) {
  var connection = mysql.createConnection({
    socketPath: '/cloudsql/white-rapids:us-central1:errand-helper',
    //host: '35.239.35.171',
    user: 'user',
    password: 'pass',
    database: 'db'
  });

  connection.connect(function(error) {
    if(!!error) {
      console.log('Error');
    } else {
      console.log('Connected');
    }
  });

  // This will hold any existing errand request entries so our map displays them
  let rowsort = [];
  let rowdata = [];
  let errandarray = [];
  let mapstring = '{';

  connection.query("SELECT * from requests",
      function(error, rows){
        if(!!error) {
          console.log('Query Error');
          console.log(error);
        } else {
          for (let i = 0; i < rows.length; i++) {
            rowdata.push([{ID: rows.ID, time: rows.time, name: rows.name,
              email: rows.email, errandtitle: rows.errandtitle, description:
              rows.description, contactinfo: rows.contactinfo, location: rows.location}]);
          }

          // Make the JSON indexable to convert to our array
          for (let x in rows) {
            rowsort.push(x);
          }

          rowsort.sort(function (a, b) {
            return a == b ? 0 : (a > b ? 1 : -1);
          });

          // Push the JSON from the SQL Query into an array and pass it to the map page
          for (let i = 0; i < rowsort.length; i++) {
            errandarray.push({ID: rows[rowsort[i]].ID, time: rows[rowsort[i]].time, name: rows[rowsort[i]].name, email: rows[rowsort[i]].email, errandtitle: rows[rowsort[i]].errandtitle, description: rows[rowsort[i]].description, contactinfo: rows[rowsort[i]].contactinfo, location: rows[rowsort[i]].location});
          }
          for (let x = 0; x < errandarray.length; x++) {
            mapstring = mapstring + '"' + x.toString() + '":' + JSON.stringify(errandarray[x]);
            if (x+1 === errandarray.length) {
              mapstring = mapstring + '}';
            } else {
              mapstring = mapstring + ',';
            }
          }
        }
      }
  );

  function setMapCookie() {
    res.cookie('mapdata', mapstring, { maxAge: 900000, httpOnly: false });
  }

  setTimeout(setMapCookie, 250);

  function render() {
    res.render('index');
  }
  setTimeout(render, 250);
});

// Future page for user to manage their post through the email link
app.get('/manage', function (req, res) {
  res.render('manage');
});

// Form to request an errand and place on map
app.get('/request', function (req, res) {
  res.render('request');
});

// Submit action after user fills out form
app.post('/postrequest', function (req, res) {
  var name = req.body.name;
  var email = req.body.email;
  var errandtitle = req.body.errandtitle;
  var description = req.body.description;
  var usercontact = req.body.usercontact;
  let date_ob = new Date();

  let date = ("0" + date_ob.getDate()).slice(-2);
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  let year = date_ob.getFullYear();
  let hours = date_ob.getHours();
  let minutes = date_ob.getMinutes();
  let seconds = date_ob.getSeconds();
  let timestamp = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;

  var connection = mysql.createConnection({
    socketPath: '/cloudsql/white-rapids:us-central1:errand-helper',
    //host: '35.239.35.171',
    user: 'user',
    password: 'pass',
    database: 'db'
  });

  connection.connect(function(error) {
    if(!!error) {
      console.log('Error');
    } else {
      console.log('Connected');
    }
  });

  // Grabs the location cookie
  let location = req.cookies['location'];

  connection.query("INSERT INTO requests (ID, time, name, email, errandtitle, " +
      "description, contactinfo, location) VALUES (null, '" + timestamp + "', '" + connection.escape(name) + "', '" + connection.escape(email) +
      "', '" + connection.escape(errandtitle) + "', '" + connection.escape(description) + "', '" + connection.escape(usercontact) + "', '" + connection.escape(location) + "')",
      function(error, rows){
        if(!!error) {
          console.log('Query Error');
          console.log(error);
        } else {
        }
      }
  );

  res.redirect('/');
});

app.get('/about', function (req, res) {
  res.render('about');
});

app.post('/', function (req, res) {
  res.render('index');
});

app.listen(3001, function () {
  console.log('Running on port 3001')
});

module.exports = app;