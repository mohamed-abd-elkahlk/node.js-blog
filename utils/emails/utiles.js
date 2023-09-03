const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      // OPTIMIZE: be aware you nead to active to factor auth in gmail account before send a email and make password for this services
      user: process.env.EMAIL_USER, // your gmail account
      pass: process.env.EMAIL_PASSWORD, // your password
    },
  });

  await transporter.sendMail({
    from: "TODO app",
    to: options.email,
    subject: options.subject,
    html: options.message,
  });
};

module.exports = sendEmail;
