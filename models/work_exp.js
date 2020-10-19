const mongoose = require("mongoose");
const WorkExpSchema = new mongoose.Schema({
    title: String,
    location: String,
    description: String,
    timepoint: String
  });
  module.exports = mongoose.model("WorkExp", UserSchema);
  