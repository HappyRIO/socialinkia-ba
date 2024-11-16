const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();

// Nodemailer transporter setup (use your SMTP configuration here)
const transporter = nodemailer.createTransport({
  service: "gmail", // or other SMTP service
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your email password or app-specific password
  },
});

// Route to handle form data and send email
router.post("/send-contact-email", async (req, res) => {
  const { name, socialLink, email, message } = req.body;

  try {
    // Email options
    const mailOptions = {
      from: email, // Sender's email
      to: process.env.RECEIVER_EMAIL, // Receiver email address
      subject: `Contact Form Submission from ${name}`,
      text: `You have received a new message from ${name}.\n\nSocial Link: ${socialLink}\n\nEmail: ${email}\n\nMessage:\n${message}`,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Respond with success message
    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res
      .status(500)
      .json({ error: "Failed to send email. Please try again later." });
  }
});

router.post("/news-letter", function (req, res) {
  res.send("POST request to the homepage");
});

module.exports = router;
