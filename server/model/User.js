const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CompanyDetailsSchema = new Schema({
  name: { type: String, required: true },
  companyCreationDate: { type: Date },
  slogan: { type: String },
  numEmployees: { type: Number },
  contactInfo: { type: String },
  businessPurpose: { type: String },
  photos: [{ type: String }], // URL or file path to uploaded photos
  preferredLanguage: { type: String, default: "en" },
});

const PaymentHistorySchema = new Schema({
  amount: { type: Number, required: true },
  currency: { type: String, default: "usd" },
  date: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["succeeded", "failed", "pending"],
    default: "succeeded",
  },
});

const SubscriptionSchema = new Schema({
  id: { type: String }, // Stripe subscription ID
  active: { type: Boolean, default: false }, // Subscription status
  plan: { type: String }, // Plan type (e.g., 'basic', 'standard', 'premium')
  trialEnd: { type: Date }, // End date of trial period if any
  amount: { type: Number }, // Amount per billing period
  currency: { type: String, default: "usd" },
  renewalDate: { type: Date }, // Next billing date
  paymentHistory: [PaymentHistorySchema], // Array of past payments
});

const postSchema = new Schema({
  text: { type: String },
  platform: {
    both: { type: Boolean, default: false },
    insta: { type: Boolean, default: false },
    fbook: { type: Boolean, default: false },
  },
  uploaddate: { type: String },
  images: [],
});

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  post: [postSchema],
  deleted: { type: Boolean, default: false },
  subscription: SubscriptionSchema,
  createdAt: { type: Date, default: Date.now },
  sessionToken: { type: String },
  sessionExpiresAt: { type: Date },
  companyDetails: CompanyDetailsSchema,
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
