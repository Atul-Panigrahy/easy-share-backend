const File = require("../models/file");
const { sendMail } = require("../services/emailService");
const { emailTemplate } = require("../services/emailTemplate");

module.exports.sendEmail = async (req, res) => {
  // console.log(req.body);
  const { uuid, emailFrom, emailTo } = req.body;

  // Validate request body
  if (!uuid || !emailFrom || !emailTo) {
    return res.status(422).send({ error: "All fields are required!" });
  }

  //get Data from Database
  const file = await File.findOne({ uuid });

  if (file.sender) {
    return res.status(422).send({ error: "Email already Sent!" });
  }

  file.sender = emailFrom;
  file.receiver = emailTo;

  const response = await file.save();
  console.log(response);

  //send Email
  sendMail({
    from: emailFrom,
    to: emailTo,
    subject: "easy-share file sharing",
    text: `${emailFrom} Shared a File With you`,
    html: emailTemplate({
      emailFrom: emailFrom,
      downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}`,
      size: parseInt(file.size / 1000),
      expires: "24 Hours",
    }),
  });

  return res.json({ message: "Success!" });
};
