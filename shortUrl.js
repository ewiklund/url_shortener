// Template with a structure of the shortUrl Schema.
//Require mongoose

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const urlSchema = new Schema({
  original_url: String,
  short_url: String
}, {timestamps: true});

const ModelClass = mongoose.model("shortUrl", urlSchema);

module.exports = ModelClass;
