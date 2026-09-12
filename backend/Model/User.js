const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    default: "",
  },
  password: {
    type: String,
    default: "",
  },
  photo: {
    type: String,
    default: "",
  },
  resume:{
    type:String,
    default:"",
  },
  lastPasswordReset:{
    type:Date,
    default:null,
  }
});

module.exports = mongoose.model("User", UserSchema);
