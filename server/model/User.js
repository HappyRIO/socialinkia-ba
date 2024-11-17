const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CompanyDetailsSchema = new Schema({
  userName: { type: String, default: "" }, // Updated key to match `formData`
  logo: { type: String, default: "" }, // Binary image data or Cloudinary URL
  companyTradeName: { type: String, default: "" },
  businessSector: { type: String, default: "" },
  addressVisible: { type: String, enum: ["YES", "NO"], default: "NO" },
  country: { type: String, default: "" },
  province: { type: String, default: "" },
  locality: { type: String, default: "" },
  postalCode: { type: String, default: "" },
  webPage: { type: String, default: "" },
  webPageUrl: { type: String, default: "" },
  showContactInfo: { type: String, enum: ["YES", "NO"], default: "NO" },
  contactInfo: { type: String, default: "" },
  photos: [{ type: String }], // Array for photo URLs or binary data
  schedule: { type: String, default: "" },
  sales_channels: { type: String, default: "" },
  motto: { type: String, default: "" },
  motto_field: { type: String, default: "" },
  business_definition: [{ type: String }], // Array for multiple definitions
  business_definition_other: { type: String, default: "" },
  highlight: { type: String, default: "" },
  star_product: { type: String, default: "" },
  star_product_field: { type: String, default: "" },
  features: { type: String, default: "" },
  add_products: { type: String, enum: ["yes", "no"], default: "no" },
  add_products_field: { type: String, default: "" },
  add_features: { type: String, default: "" },
  objectives: { type: String, default: "" },
  exterior_photo: { type: String, default: "" }, // Binary image data or URL
  interior_photo: { type: String, default: "" }, // Binary image data or URL
  special_place_photo: { type: String, default: "" }, // Binary image data or URL
  staff_photo: { type: String, default: "" }, // Binary image data or URL
  area_of_influence: { type: String, default: "" },
  customer_type: [{ type: String }], // Array for customer types
  age_range: [{ type: String }], // Array for age ranges
  valuable_content: [{ type: String }], // Array for valuable content types
  valuable_content_other: { type: String, default: "" },
  communication_style: { type: String, default: "" },
  communication_style_other: { type: String, default: "" },
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
    all: { type: Boolean, default: false },
    gmb: { type: Boolean, default: false },
    insta: { type: Boolean, default: false },
    fbook: { type: Boolean, default: false },
  },
  uploaddate: { type: String }, // Use ISO 8601 format for consistency
  images: [String],
  videos: [String],
  status: {
    type: String,
    enum: ["scheduled", "published", "failed"],
    default: "scheduled",
  },
  socialPlatformIds: {
    gmb: { type: String, default: null },
    insta: { type: String, default: null },
    fbook: { type: String, default: null },
  },
});

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String },
  posts: [postSchema],
  deleted: { type: Boolean, default: false },

  gmbrefreshToken: { type: String },
  gmbAccessToken: { type: String },
  gmbRefreshToken: { type: String },
  gmbTokenExpiresAt: { type: String },
  gmbAccountId: { type: String },
  gmbLocationId: { type: String },

  facebookAccessToken: { type: String },
  instagramAccessToken: { type: String },

  subscription: SubscriptionSchema,
  createdAt: { type: Date, default: Date.now },
  sessionToken: { type: String },
  sessionExpiresAt: { type: Date },
  companyDetails: CompanyDetailsSchema,
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
