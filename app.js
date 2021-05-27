
var express = require('express');
var path = require('path');
const url = require('url');
const querystring = require('querystring');
const cors = require('cors')
var monk = require('monk');

//Create a database reference to MongoDB running on RasbpberryPi
var db = monk('192.168.50.238:27017/HomeAutomation');

var indexRouter = require('./routes/index');

var app = express();
app.use(cors())
app.use(express.json());       
app.use(express.urlencoded()); 

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

// Make our db accessible to our router
app.use(function(req,res,next){
  req.db = db;
  next();
 });

app.use('/', indexRouter);

module.exports = app;
