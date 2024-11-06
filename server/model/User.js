const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true, // Ensure email is unique
  },
  password: {
    type: String,
    required: true,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  subscription: {
    type: Schema.Types.ObjectId,
    ref: "subscription",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  sessionToken: {
    type: String,
  },
  sessionExpiresAt: {
    type: Date,
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
