const nodemailer = require("nodemailer");

module.exports.sendMail = async ({ from, to, subject, text, html }) => {
  let tranporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  let info = await tranporter.sendMail({
    from: `easy-share <${from}>`,
    to,
    cc: from,
    subject,
    text,
    html,
  });

  // console.log(info);
};
