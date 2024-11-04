const mongoose = require("mongoose");
const Shcema = mongoose.Schema;

const UserSchema = new Shcema({
  email: {
    type: String,
    required: true,
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
    type: Shcema.Types.ObjectId,
    ref: "subscription",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("user", UserSchema);

module.exports = User;
