//================================================================================
// Dependancies.
//================================================================================

const express = require("express"),
  bodyParser = require("body-parser"),
  passport = require("passport"),
  User = require("../models/user.js"),
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
    res.render("gameprototype.ejs");
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
  