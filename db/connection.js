///////////////////////////////////////////////
// mongoose connection
const mongoose = require("mongoose");

//getting the db path from config env
var uri = process.env.MONGODB_URI;
console.log(uri);
mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true });

const connection = mongoose.connection;

connection.once("open", function() {
  console.log("MongoDB database connection established successfully");
})
.on('error', function (err) {
  throw err;
});

module.exports = mongoose;
/////////////////////////////////////////////