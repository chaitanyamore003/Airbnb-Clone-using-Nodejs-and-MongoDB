const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First Name is required"],
  },

  lastName: {
    type: String,
    required: [true, "Last Name is required"],
  },

  email: {
    type: String,
    required: [true, "Email is required"],
  },

  password: {
    type: String,
    required: [true, "Password is required"],
  },

  userType: {
    type: String,
    enum: ["guest", "host"],
    default: "guest",
  },

  favourites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Home",
    },
  ],

  bookings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Home",
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
