const mongoose = require("mongoose");
const SchoolingSchema = new mongoose.Schema({
    title: String,
    location: String,
    description: String,
    timepoint: String
  });
  module.exports = mongoose.model("Schooling", SchoolingSchema);