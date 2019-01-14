const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require("http");

const index = require('./routes/index');
const api = require('./routes/api');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// mongoose.connect('mongodb://localhost/cookbook', {useMongoClient: true})
mongoose.connect(`mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}${process.env.MONGO_STITCH_URL}`, {useMongoClient: true})
  .then((db)=>{
    console.log('Connected to mongodb');
  })
  .catch(err=>{
    console.log('Could not connect to mongodb');
    throw err;
  });

const app = express();
app.use(cors())
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/api', api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// setInterval(function() {
//   http.get("https://gretchenscookbook-api.herokuapp.com/");
// }, 300000); // every 5 minutes (300000)

module.exports = app;
