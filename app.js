var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors  = require('cors');
const passport = require('passport');
const hbs = require('express-handlebars');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const JWT = require('./shared/jwt');

var app = express();

passport.use('jwt', JWT.strategy);

// view engine setup
  // view engine setup
app.engine('hbs', hbs({
  partialsDir  : [
    //  path to your partials
    path.join(__dirname, 'views/partials'),
  ],
  extname: 'hbs',
  defaultLayout: 'silicon',
  helpers: {
    ifEquals: function(arg1, arg2, options) {
      return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
    }
  }
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(cors());
app.use(logger('dev'));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/coins', require('./routes/coins'));
app.use('/trading', require('./routes/trading'));
app.use('/api/users', require('./routes/api/users'));
app.use('/api/trade', require('./routes/api/trade'));
app.use('/api/tokens', require('./routes/api/tokens'));
app.use('/api/coins', require('./routes/api/coins'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.use(async (error, request, response, next) => {
  console.log('An error has occurred: ', error.message);

  response.status(error.status || 500);

  if (request.originalUrl.startsWith('/api')) {
    return response.json({ message: error.message });
  } else {
    return response.render('error', { title: error.status.toString(), status: error.status.toString(), message: error.message });
  }
});

module.exports = app;
