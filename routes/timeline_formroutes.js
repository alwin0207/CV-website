//================================================================================
// Dependancies.
//================================================================================

const express = require("express"),
  bodyParser = require("body-parser"),
  passport = require("passport"),
  User = require("../models/user.js"),
  Schooling = require("../models/schooling.js"),
  WorkExp = require("../models/work_exp.js"),
  authentication = require("../controllers/authentication.js"),
  monthYear = require("../controllers/monthyear.js");

//================================================================================
// Setting up dependancies
//================================================================================

const router = express.Router();

router.get("/timeline", function (req, res) {
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

router.get("/addstuff", isLoggedIn, function (req, res) {
  res.render("addstuff.ejs");
});

//================================================================================
// Invul form routes
//================================================================================
  
router.post("/addschool", isLoggedIn, monthYear.isMonthYearCheck, function (req, res) {
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
  
router.post("/addwork", isLoggedIn, monthYear.isMonthYearCheck, function (req, res) {// need error handling in case input is wrong
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

module.exports = router;