const monthYear = {};
monthYear.isMonthYear = function(mYString){
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

monthYear.isMonthYearCheck = function (req, res, next) {
    if(monthYear.isMonthYear(req.body.dateStart) && monthYear.isMonthYear(req.body.dateEnd)){
      return next();
    }
    res.redirect("/login");
}
    
module.exports = monthYear;