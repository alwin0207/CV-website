const mongoose = require("mongoose"),
  passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  isExpert: {
    type: Boolean,
    default: true,
  },
  //    projects: [{
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "ScrProject"
  //    }],
  //    comments: [{
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "Comment"
  //    }]
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
