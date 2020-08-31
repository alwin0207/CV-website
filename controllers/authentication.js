const authentication = {};

authentication.isExpert = function (req, res, next) {
  if (req.isAuthenticated()) {
    if (req.user.isExpert === true) {
      next();
    } else {
      console.log("You don't have permission to do that");
      res.redirect("back");
    }
  } else {
    console.log("need to login");
    res.redirect("/login");
  }
};

module.exports = authentication;
