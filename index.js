// ------ Adding dependancies ------
const express = require("express"),
  bodyParser = require("body-parser"),
  dotEnv = require("dotenv").config(),
  mongoose = require("mongoose"),
  expressSession = require("express-session"),
  passport = require("passport"),
  User = require("./models/user.js"),
  LocalStrategy = require("passport-local"),
  passportLocalMongoose = require("passport-local-mongoose");

// ------ Adding route dependancies ------

const indexRoutes = require("./routes/index_routes.js");
const timelineRoutes = require("./routes/timeline_formroutes.js");

/* ------ Setting up dependancies and connections ------ */

// ... express ...
const app = express();

// ... mongoose ...
const dbLocation = process.env.DATABASELOCATIONCLOUD; //|| "mongodb://localhost/onlineCV";
mongoose
  .connect(dbLocation, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to CV website DB");
  })
  .catch((err) => {
    console.log("ERROR:", err.message);
  });

// ... bodyparser ...
app.use(bodyParser.urlencoded({ extended: true }));

// ... passport ...
app.use(
  expressSession({
    secret: process.env.PASSPORTSECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//... adding user info to all routes ...
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

// ... static files ...
app.use(express.static("stylesheets"));
app.use(express.static("images"));
app.use(express.static(__dirname + "/public"));

// ... Using router ...
app.use(indexRoutes);
app.use(timelineRoutes);

////////////////////////////////////////////////////////////////////////////////////
// ......------ Listnening to server------......
////////////////////////////////////////////////////////////////////////////////////

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Online CV server is running");
});
