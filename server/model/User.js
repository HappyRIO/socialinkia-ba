const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CompanyDetailsSchema = new Schema({
  UserName: { type: String, default: "" },
  logo: { type: String, default: "" },
  category: { type: String, default: "" },
  CompanyTradeName: { type: String, default: "" },
  addressVisible: { type: String, enum: ["YES", "NO"], default: "NO" },
  country: { type: String, default: "" },
  province: { type: String, default: "" },
  locality: { type: String, default: "" },
  postalCode: { type: String, default: "" },
  address: { type: String, default: "" },
  website: { type: String, default: "" },
  contactMethod: { type: String, default: "" },
  phone: { type: String, default: "" },
  schedule: { type: String, default: "" },
  salesChannel: { type: String, default: "" },
  motto: { type: String, default: "" },
  businessDefinition: [{ type: String }], // Array for multiple definitions
  highlight: { type: String, default: "" },
  productService: { type: String, default: "" },
  featuresBenefits: { type: String, default: "" },
  additionalProducts: [{ type: String }], // Array for additional products
  publicationObjective: { type: String, default: "" },
  photos: [{ type: String }], // Array for photo URLs or file paths
  serviceArea: { type: String, default: "" },
  customerType: [{ type: String }], // Array for customer types
  ageRange: [{ type: String }], // Array for age ranges
  valuableContent: [{ type: String }], // Array for valuable content types
  communicationStyle: { type: String, default: "" },
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
  password: { type: String },
  post: [postSchema],
  deleted: { type: Boolean, default: false },
  instagramAccountId: { type: String },
  subscription: SubscriptionSchema,
  createdAt: { type: Date, default: Date.now },
  sessionToken: { type: String },
  sessionExpiresAt: { type: Date },
  companyDetails: CompanyDetailsSchema,
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
