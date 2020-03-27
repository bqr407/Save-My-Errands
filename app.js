const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'pug');

app.get('/', function (req, res) {
  res.render('index');
})

app.post('/', function (req, res) {
  res.render('index');
})

app.listen(3001, function () {
  console.log('Running on port 3001')
})

module.exports = app;