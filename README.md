# **easy-share-backend**

### dependencies

- cors
- dotenv
- ejs
- express
- mongoose
- multer
- nodemailer
- uuid

### devDependencies

- nodemon

## **EASY-SHARE API DOCUMENTATION**

1. Entry-Point" [server.js](server.js)
   <p>
   While running in local system, the default port of running the server is 3000. 
   </p>
2. Mongodb-connection config file: [config/db.js](/config/db.js)
3. Mongoose file schema: [models/file.js](/models/file.js)
4. Routers: [routes/router.js](/routes/router.js)
5. Controllers: [controllers/](controllers/)
   1. upload file: [uploadFile.js](#uploadFile)
   2. show file: [showFile.js](#showFile)
   3. download file: [downloadFile.jdownloas](#downloadFile)
   4. send Email: [sendEmail.js](#sendEmail)


### Controller Details:

1. **<h3 id="uploadFile">uploadFile.js</h3>**

   - Triggered by POST HTTP call to "/api/files" route
   - Uploads file to destination and saves in the database. receives the file in _reqest_ and sends download link as _response_.

   1. storage:

      ```js
      let storage = multer.diskStorage({
        destination: (req, file, callback) => {
          return callback(null, "uploads/");
        },
        filename: (req, file, callback) => {
          const uniqueName = `${Date.now()}-${Math.round(
            Math.random() * 1e9
          )}${path.extname(file.originalname)}`;
          return callback(null, uniqueName);
        },
      });
      ```

      From [multer](https://www.npmjs.com/package/multer) docs:

      - The _DiskStorage_ storage engine gives full control on st oring files to disk.
      - There are two options available, _destination_ and _filename_. They are both functions that determine where the file should be stored.
      - _destination_ is used to determine within which folder the uploaded files should be stored. This can also be given as a string (e.g. '/tmp/uploads'). If no destination is given, the operating system's default directory for temporary files is used.

      - Note: You are responsible for creating the directory when providing destination as a function. When passing a string, multer will make sure that the directory is created for you.

      - _filename_ is used to determine what the file should be named inside the folder. If no filename is given, each file will be given a random name that doesn't include any file extension. In current implementation, the file will be named uniquely. The name for the file will be the _the upload data-time_, a pseudo random number (between 0 and 1), and the extension of the name of the file on the uploader's system.

      - Note: Multer will not append any file extension for you, your function should return a filename complete with an file extension.

      - Each function gets passed both the request (req) and some information about the file (file) to aid with the decision.

      - Note that req.body might not have been fully populated yet. It depends on the order that the client transmits fields and files to the server.

   2. upload

      ```js
      let upload = multer({
        storage: storage,
        limits: {
          fileSize: 1e6 * 100,
        },
      }).single("myfile");
      ```

      - Returns a Multer instance that provides several methods for generating middleware that process files uploaded in multipart/form-data format.
      - The StorageEngine specified in storage will be used to store files. If storage is not set and dest is, files will be stored in dest on the local file system with random names. If neither are set, files will be stored in memory.
      - In addition to files, all generated middleware process all text fields in the request. For each non-file field, the Request.body object will be populated with an entry mapping the field name to its string value, or array of string values if multiple fields share the same name.
      - multer(opts): multer accepts an options object. In case you omit the options object, the files will be kept in memory and never written to disk.
      - |   Key   |             Description             |
        | :-----: | :---------------------------------: |
        | storage |      Where to store the files       |
        | limits  | Limits of the uploaded data (100MB) |
      - .single(fieldname): Accept a single file with the name fieldname. The single file will be stored in req.file.

<br>

2. **<h3 id="showFile">showFile.js</h3>**

   - Triggerd by GET HTTP call to route "/files/:uuid"
   - Receives uuid in request parameter
   - if no file found in the database, enders the _download.ejs_ template with the error message "Something went Wrong!"
   - else renders the _download.ejs_ template with the uuid, fileName, fileSize and the download link for the file.

3. **<h3 id="downloadFile">downloadFile.js</h3>**

   - Triggerd by GET HTTP call to route "/files/download/:uuid"
   - Receives uuid in request parameter
   - if no file found in the database, enders the _download.ejs_ template with the error message "Link has been expired"
   - Transfers the file at path as an “attachment”. Typically, browsers will prompt the user for download

4. **<h3 id="sendEmail">sendEmail.js</h3>**
   - Triggerd by GET HTTP call to route "/api/files/send"
   - Receives _uuid, emailFrom, emailTo_ from _req.body_, throws error if any of the field is not provided
   - if the file already has a sender attribute, then throws error "Email already Sent!"
   - else saves the _sender_ and _reciever_ attribute of the file to the database. And
