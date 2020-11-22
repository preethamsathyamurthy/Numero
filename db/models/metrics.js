const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let metric = new Schema(
  {
    number: {
      type: Number
    }
  },
  {timestamps: true},
  { collection: "metrics" }
);

module.exports = mongoose.model("metrics", metric);