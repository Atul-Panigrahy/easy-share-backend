const File = require("./models/file");

const deleteFile = () => {
  const files = File.find({
    createdAt: {},
  });
};
