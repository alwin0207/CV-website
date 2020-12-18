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
          if (req.isAuthenticated()){
            res.render("timeline.ejs", {timeline: {workExp: foundExp, schooling:foundSchooling, isLoggedin: true}});
          }
          else{
            res.render("timeline.ejs", {timeline: {workExp: foundExp, schooling:foundSchooling, isLoggedin: false}});
          }
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
// Not-found routes
//================================================================================

// router.get("*", function (req, res) {
//   res.render("not_existing.ejs");
// });

//================================================================================
// Middleware
//================================================================================
  
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}
//================================================================================
// Export
//================================================================================
  
module.exports = router;
  