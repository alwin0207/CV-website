const mongoose = require("mongoose");
const SchoolingSchema = new mongoose.Schema({
  education: String,
  track: String,
  institute: String,
  location: String,
  startDate: String,
  endDate: String,
  timepoint: String,
  finished: String
});
module.exports = mongoose.model("Schoolingv2", SchoolingSchema);