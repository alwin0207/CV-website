//================================================================================
// Dependancies.
//================================================================================

const express = require("express"),
  bodyParser = require("body-parser"),
  passport = require("passport"),
  User = require("../models/user.js"),
  // Schooling = require("../models/schooling.js"),
  // WorkExp = require("../models/work_exp.js"),
  Schooling = require("../models/schooling copy.js"),
  WorkExp = require("../models/work_exp copy.js"),
  authentication = require("../controllers/authentication.js");

//================================================================================
// Setting up dependancies
//================================================================================

const router = express.Router();

//================================================================================
// Index Routes
//================================================================================
var myTimeline = {
  workExp: [
    {
      title: "dit is een test (nr 1)" ,
      location: "groningen" ,
      description: "blak kslkdj kdeiek ki iki ben alwin en dit is een test" ,
      timePoint: "Ba"
    },
    {
      title: "dit is een test (nr 2)" ,
      location: "groningen" ,
      description: "blak kslkdj kdeiek ki iki ben alwin en dit is een test" ,
      timePoint: "Cb"
    }
  ],
  schooling:[
    {
      title: "dit is een test (nr 1 schooling)" ,
      location: "groningen" ,
      description: "blak kslkdj kdeiek ki iki ben alwin en dit is een test" ,
      timePoint: "Dc"
    },
    {
      title: "dit is een test (nr 2 schooling)" ,
      location: "groningen" ,
      description: "blak kslkdj kdeiek ki iki ben alwin en dit is een test" ,
      timePoint: "Ed"
    }
  ]
};

router.get("/", function (req, res) {
    res.render("main_page.ejs");
  });

  router.get("/test", function (req, res) {
    var workExp=[];
    var schooling=[];
    WorkExp.find(function (err, foundExp) {
      if (err) {return console.error(err);}
      else{
        workExp=foundExp;
        Schooling.find(function (err, foundSchooling) {
          if (err) {return console.error(err);}
          else{
            schooling=foundSchooling;
            console.log(workExp);
            console.log(schooling);
            //res.render("timeline.ejs", {timeline: {workExp: workExp, schooling:schooling}});
            res.render("timeline copy.ejs", {timeline: {workExp: workExp, schooling:schooling}});
          }
        });
      }
    });
  });

  router.post("/test", isLoggedIn, function (req, res) {
    if(req.body.choice === "schooling"){
      var newSchooling = new Schooling({
        title: req.body.title,
        location: req.body.location,
        description: req.body.description,
        timepoint: req.body.timepoint
      });
      newSchooling.save(function (err, schoolingSaved) {
        if (err) return console.error(err);
        console.log(schoolingSaved);
        res.redirect("/test");
      });
    }
    if(req.body.choice === "work"){
      var newWorkExp = new WorkExp({
        title: req.body.title,
        location: req.body.location,
        description: req.body.description,
        timepoint: req.body.timepoint
      });
      newWorkExp.save(function (err, workExpSaved) {
        if (err) return console.error(err);
        console.log(workExpSaved);
        res.redirect("/test");
      });
    }
    
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
       } else {
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
  
  router.post(
    "/login",
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
    res.render("addstuff copy.ejs");
  });

  router.post("/addschool", isLoggedIn, function (req, res) {// need error handling in case input is wrong
    console.log(req.body.dateStart);
    if(isMonthYear(req.body.dateStart) && isMonthYear(req.body.dateEnd) ){
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
    }
    
  });

  router.post("/addwork", isLoggedIn, function (req, res) {// need error handling in case input is wrong
    if(isMonthYear(req.body.dateStart) && isMonthYear(req.body.dateEnd)){
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
    }
    
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
  
  //================================================================================
  // Export
  //================================================================================
  
  module.exports = router;
  