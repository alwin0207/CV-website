//================================================================================
// Dependancies.
//================================================================================

const express = require("express"),
  bodyParser = require("body-parser"),
  passport = require("passport"),
  User = require("../models/user.js"),
  Schooling = require("../models/schooling.js"),
  WorkExp = require("../models/work_exp.js"),
  authentication = require("../controllers/authentication.js");

//================================================================================
// Setting up dependancies
//================================================================================

const router = express.Router();

//================================================================================
// Index Routes
//================================================================================

router.get("/", function (req, res) {
  res.render("main_page.ejs");
});

router.get("/test", function (req, res) {
  WorkExp.find(function (err, foundExp) {
    if (err) {
      return console.error(err);
    }
    else{
      Schooling.find(function (err, foundSchooling) {
        if (err) {
          return console.error(err);
        }
        else{
          res.render("timeline.ejs", {timeline: {workExp: foundExp, schooling:foundSchooling}});
        }
      });
    }
  });
});

  //================================================================================
  // Under construction route
  //================================================================================
  
router.get("/under_construction", function (req, res) {
  res.render("under_construction.ejs");
});

  //================================================================================
// Register routes
//================================================================================

// ------ Get ------ //
router.get("/register", function (req, res) {
  res.render("registerpage.ejs");
});
  
  // ------ Post ------ //
router.post("/register", function (req, res) {
  if (req.body.register === process.env.REGISTERSECRET){
    let newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, function (err, user) {
      if (err) {
       console.log(err);
       res.redirect("/register");
      } 
      else {
       passport.authenticate("local")(req, res, function () {
          res.redirect("back");
        });
      }
    });
  }
  else{
    res.redirect("back");
  }
});
  
//================================================================================
// Login routes
//================================================================================
  
// ------ Get ------ //
  
router.get("/login", function (req, res) {
  res.render("loginpage.ejs");
});
  
// ------ Post ------ //
  
router.post("/login",
  passport.authenticate("local", {
    successRedirect: "back",
    failureRedirect: "/register",
  }),
  function (req, res) {}
);
  
//================================================================================
// Logout routes
//================================================================================
  
router.get("/logout", function (req, res) {
  req.logout();
  res.redirect("back");
});

//================================================================================
// Invul form routes
//================================================================================
  
// Niet beschermd, dat moet nog door connecties binnen de database te leggen.

router.get("/addstuff", isLoggedIn, function (req, res) {
  res.render("addstuff.ejs");
});

router.post("/addschool", isLoggedIn, isMonthYearCheck, function (req, res) {// need error handling in case input is wrong  
  var newSchooling = new Schooling({
    education: req.body.education,
    track: req.body.track,
    institute: req.body.institute,
    location: req.body.location,
    startDate: req.body.dateStart,
    endDate: req.body.dateEnd,
    timepoint: req.body.timepoint,
    finished: req.body.finished
  });
  newSchooling.save(function (err, schoolingSaved) {
    if (err) {
      return console.error(err);
    }
    else{
      console.log(schoolingSaved);
      res.redirect("/test");
    }
  });
});

router.post("/addwork", isLoggedIn, isMonthYearCheck, function (req, res) {// need error handling in case input is wrong
  var newWorkExp = new WorkExp({
    startDate: req.body.dateStart,
    endDate: req.body.dateEnd,
    jobdescription: [req.body.description],
    timepoint: req.body.timepoint,
    company: req.body.company,
    jobFunction: req.body.jobfunction,
    location: req.body.location
  });
  newWorkExp.save(function (err, workExpSaved) {
    if (err) {
      return console.error(err);
    }
    else{
      console.log(workExpSaved);
      res.redirect("/test");
    }
  });   
});

//================================================================================
// Middleware
//================================================================================
  
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

function isMonthYear(mYString){
  if(mYString.length !== 7){
    console.log("not the right length");
    return false;
  }
  else if(mYString.charAt(4) !== "-"){
    console.log("no - at the right spot");
    return false;
  }
  else if((isNaN(mYString.split("-")[0])) || (mYString.split("-")[0].length !== 4)){
    console.log("No number before -");
    return false;
  }
  else if((isNaN(mYString.split("-")[1])) || mYString.split("-")[1].length !== 2){
    console.log("No number after -");
    return false;
  }
  else{
    return true;
  }
}

function isMonthYearCheck(req, res, next) {
  if(isMonthYear(req.body.dateStart) && isMonthYear(req.body.dateEnd)){
    return next();
  }
  res.redirect("/login");
}
  
  //================================================================================
  // Export
  //================================================================================
  
  module.exports = router;
  