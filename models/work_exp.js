const mongoose = require("mongoose");
const WorkExpSchema = new mongoose.Schema({
  company: String,
  jobFunction: String,
  location: String,
  jobdescription: [String],
  startDate: String,
  endDate: String,
  timepoint: String
});
module.exports = mongoose.model("WorkExpv2", WorkExpSchema);