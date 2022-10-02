const http = require("http");
const formidable = require("formidable");
const fs = require("fs");
const path = require("path");
const { error } = require("console");
const { receiveMessageOnPort } = require("worker_threads");

http
  .createServer((req, res) => {
    if (req.url === "/") {
      res.end("Hello world");
    }
    if (req.url === "/about") {
      res.end("About");
    }
    if (req.url === "/home") {
      //   res.end("Home");
      if (req.method.toLowerCase() === "post") {
        const form = formidable({ multiples: true });
        form.parse(req, (error, fields, files) => {
          if (error) {
            res.writeHead(error.httpCode);
            res.write(error.message);
            res.end();
          }
          sendRes(files.file.originalFilename, files.file.mimetype, res);
          //   res.end(JSON.stringify({ fields, files }, null, 2));
        });
      }
    }
  })
  .listen(3000, () => {
    console.log("Server is running");
  });

function sendRes(url, contentType, res) {
  let file = path.join(__dirname, url);
  fs.readFile(file, (error, content) => {
    if (error) {
      res.writeHead(404);
      res.write("File not found");
      res.end();
      throw new Error("File not found");
    }
    res.writeHead(200, { "Content-Type": contentType });
    res.write(content);
    res.end();
  });
}
