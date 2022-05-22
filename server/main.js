// Imports
const path = require("path");
const express = require("express");
const app = express();
const fs = require("fs");
const url = require("url");

const videoFolder = "C:\\Users\\zcc\\Videos\\videos";

// Serve the index.html
app.get("/", function (req, res) {
    res.render("index");
});

// Serve the local files
app.use(express.static(path.join(__dirname, "public")));

// Example of /options?a=1&b=2
app.get("/options", function (req, res) {
    const query = url.parse(req.url, true);
    console.log(query);
    res.status(400).send(`options are ${query}`);
});

// Serve the list of mp4 files
app.get("/video-list", function (req, res) {
    const fileNames = [];
    const pa = fs.readdirSync(path.join(videoFolder));
    pa.forEach(function (ele, index) {
        console.log(index, ele);
        // fileNames[index] = ele;
        fileNames.push({ name: ele, index: index });
    });
    console.log(fileNames);

    res.status(200).json(fileNames);
});

// Serve the mp4 file
app.get("/video/:fileName", function (req, res) {
    const fileName = req.params.fileName;
    console.log(fileName);

    const range = req.headers.range;

    if (!range) {
        res.status(400).send("Requires Range header");
    }

    // const videoPath = "C:\\Users\\zcc\\Videos\\videos\\homeland.mp4";
    // const videoPath = `C:\\Users\\zcc\\Videos\\videos\\${fileName}`;
    const videoPath = path.join(videoFolder, fileName);
    // const videoPath = "Chris-Do.mp4";
    const videoSize = fs.statSync(videoPath).size;
    const CHUNK_SIZE = 10 ** 6;
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
    const contentLength = end - start + 1;

    console.log(start, end);

    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4",
    };
    res.writeHead(206, headers);
    const videoStream = fs.createReadStream(videoPath, { start, end });
    console.log(">>>>");
    videoStream.pipe(res);
    console.log("<<<<");
});

app.listen(3000, function () {
    console.log("Listening on port 3000!");
});
