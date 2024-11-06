const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CompanyDetailsSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  companyCreationDate: {
    type: Date,
  },
  slogan: {
    type: String,
  },
  numEmployees: {
    type: Number,
  },
  contactInfo: {
    type: String,
  },
  businessPurpose: {
    type: String,
  },
  photos: [
    {
      type: String, // URL or file path to uploaded photos
    },
  ],
  preferredLanguage: {
    type: String,
    default: "en",
  },
});

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
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
  companyDetails: CompanyDetailsSchema, // Add nested company details schema
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
