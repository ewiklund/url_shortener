this is the original index.js with the code for this project. The other existing index.js in this repository resides in /public/js directory.

'use strict';

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongo = require("mongodb");
const mongoose = require("mongoose");
const shortUrl = require("./models/shortUrl");
const cors = require("cors");

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));

/** this project needs a db !! **/
// mongoose.connect(process.env.MONGOLAB_URI);

mongoose.connect("mongodb+srv://admin-liz:Test123@cluster0-ctpuh.mongodb.net/shortUrls", {useNewUrlParser: true, useUnifiedTopology: true });

/** this project needs to parse POST bodies **/
// you should mount the body-parser here

app.use(express.static("public"));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/public/index.html");
});


// your first API endpoint...
app.get("/new/:shortenedurl(*)", function (req, res) {
  const { shortenedurl } = req.params;
  // regex for url
  const expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
    const regex = expression;

    if(regex.test(shortenedurl) === true) {
      const short = Math.floor(Math.random()*100000).toString();

      const data = new shortUrl(
        {
          original_url: shortenedurl,
          short_url: short
        }
      );

        data.save(err=> {
          if(err) {
            return res.send("Error saving to database");
          }
        });
      return res.json(data)
    }
    const data = new shortUrl({
      original_url: shortenedurl,
      short_url: "invalid URL"
    })
      return res.json(data);
});

// Query db and forward to original_url
app.get("/:forwardURL", function(req, res, next) {
// store the values of the params
const short_url = req.params.forwardURL;

shortUrl.findOne({"short_url": short_url}, function (err, data) {
  if(err) return res.send("error reading database");
  const re = new RegExp("^(http|https)://", "i");
  const strToCheck = data.original_url;
  if(re.test(strToCheck)) {
    res.redirect(301, data.original_url);
  } else {
    res.redirect(301, "http://" + data.original_url);
  }
});
});

app.listen(port, function () {
  console.log('Node.js listening ...');
});
