const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user");
const bcrypt = require('bcryptjs');
const flash = require("express-flash");
require('dotenv').config();

const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');
const postRouter = require('./routes/post');

const app = express();

// Set up mongoose connection
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(process.env.MONGO_URI);
}


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Authentication Setup
app.use(session({ secret: "cats", resave: false, saveUninitialized: true}));
app.use(passport.initialize());
app.use(flash());
app.use(passport.session());
app.use(express.urlencoded({ extended: false}));

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({username: username})
      if (!user) {
        return done(null, false, {message: "Incorrect username"});
      };
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, {message: "Incorrect password"});
      }
      return done(null, user);
    } catch(err) {
      return done(err);
    }
  })
)

passport.serializeUser((user, done) => {
  done(null, user.id);
})

passport.deserializeUser(async (id, done) => {
  try {
      const user = await User.findById(id);
      done(null, user);
  } catch(err) {
      done(err);
  }
})

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
})

// Routes
app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/post', postRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

module.exports = app;
