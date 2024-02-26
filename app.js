var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors  = require('cors');
const passport = require('passport');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const JWT = require('./shared/jwt');

var app = express();

passport.use('jwt', JWT.strategy);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(cors());
app.use(logger('dev'));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/trading', require('./routes/trading'));
app.use('/api/users', require('./routes/api/users'));
app.use('/api/trade', require('./routes/api/trade'));
app.use('/api/tokens', require('./routes/api/tokens'));
app.use('/api/coins', require('./routes/api/coins'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  console.log('An error has occurred:', err.message);
  console.log(err.stack);

  res.status(err.status || 500);
  return res.json({ message: err.message });
});

module.exports = app;
