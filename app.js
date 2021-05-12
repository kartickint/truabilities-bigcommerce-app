// App Routes ============================================
const auth = require("./routes/auth");
const load = require("./routes/load");
const uninstall = require("./routes/uninstall");
const validateEmail = require("./routes/validateEmail");
// ========================================================
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');


const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// App Routes ============================================+
app.use("/auth", auth);
app.use("/load", load);
app.use("/uninstall", uninstall);
app.use("/validateEmail", validateEmail);
// ========================================================

// catch 404 and forward to error handler
/*app.use(function(req, res, next) {
  next(createError(404));
});*/

// catch 404 and forward to error handler
/*app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});*/

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const listener = app.listen(3000, function () {
  console.log("Listening on port on " + listener.address().port);
});

module.exports = app;
