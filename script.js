const connectDB = require("./config/db");
const File = require("./models/file");
const fs = require("fs");

const deleteFile = async () => {
  try {
    const deadlineTime = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const files = await File.find({
      createdAt: { $lt: deadlineTime }, // files uploaded more than 24 hours
    });

    if (files.length) {
      for (const file of files) {
        fs.unlinkSync(file.path); // removes from upload folder synchronously
        await file.remove();
        console.log(`Successfully deleted ${file.filename}`);
      }
    }
  } catch (error) {
    console.log(`Error while deleting file. ${error}`);
  }
  console.log("deleteFile Script run finished");
};

deleteFile().then(process.exit);
