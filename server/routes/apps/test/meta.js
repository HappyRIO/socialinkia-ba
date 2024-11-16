const express = require("express");
const session = require("express-session");
const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const InstagramStrategy = require("passport-instagram").Strategy;

const app = express();
const router = express.Router();

// Configure session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Configure Facebook Strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: "/auth/facebook/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      // Handle user authentication and store user details
      return done(null, profile);
    }
  )
);

// Configure Instagram Strategy
passport.use(
  new InstagramStrategy(
    {
      clientID: process.env.INSTAGRAM_CLIENT_ID,
      clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
      callbackURL: "/auth/instagram/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      // Handle user authentication and store user details
      return done(null, profile);
    }
  )
);

// Serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// Define Facebook authentication routes
router.get("/auth/facebook", passport.authenticate("facebook"));

router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/"); // Redirect to home or dashboard after successful login
  }
);

// Define Instagram authentication routes
router.get("/auth/instagram", passport.authenticate("instagram"));

router.get(
  "/auth/instagram/callback",
  passport.authenticate("instagram", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/"); // Redirect to home or dashboard after successful login
  }
);

// Define routes for posting, getting posts, and analyzing posts
router.post("/facebook/post", (req, res) => {
  // Logic to create a Facebook post
  res.send("Post created on Facebook");
});

router.get("/facebook/posts", (req, res) => {
  // Logic to get Facebook posts
  res.send("List of Facebook posts");
});

router.get("/facebook/analysis", (req, res) => {
  // Logic to analyze Facebook posts
  res.send("Facebook posts analysis");
});

router.post("/instagram/post", (req, res) => {
  // Logic to create an Instagram post
  res.send("Post created on Instagram");
});

router.get("/instagram/posts", (req, res) => {
  // Logic to get Instagram posts
  res.send("List of Instagram posts");
});

router.get("/instagram/analysis", (req, res) => {
  // Logic to analyze Instagram posts
  res.send("Instagram posts analysis");
});

module.exports = router;
