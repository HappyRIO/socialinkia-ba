const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
require("dotenv").config();

//init express js for server startingg
const app = express();

// config middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  session({
    secret: "deathwishmankilledbailler",
    resave: false,
    saveUninitialized: true,
  })
);

//cors set up
app.use(cors("*"));

const google = require("./routes/auth/Google");
const mainauth = require("./routes/auth/Mainauth");
const facebook = require("./routes/apps/Facebook");
const instagram = require("./routes/apps/Instagram");

//test route
app.get("/", (req, res) => {
  console.log({ request: "get info" });
  res.json({ message: "hello world" });
});

//main routes defination
app.use("/api/google", google);
app.use("/api/auth", mainauth);
app.use("/api/facebook", facebook);
app.use("/api/instagram", instagram);

app.listen(4000, () => {
  console.log({ saerver: "http://localhost:4000" });
});
