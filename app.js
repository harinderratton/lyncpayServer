var express = require("express"),
  app = express(),
  port = 3001,
  mongoose = require("mongoose"),
  bodyParser = require("body-parser"),
  multer = require("multer");

const users = require("./api/models/UsersModel"),
  groups = require("./api/models/groupModel"),
  payMethod = require("./api/models/payMethodModel"),
  adminMethod = require("./api/models/adminModel"),
  dynamicData = require("./api/models/dynamicDataModel"),
  friends = require("./api/models/friendsModel"),
  CreditCard = require("./api/models/payMethodModel"),
  transaction = require("./api/models/transactionModel"),
  paymentRequest = require("./api/models/paymentRequestModel");

//mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/"); // live
mongoose.connect("mongodb://localhost/lyncpay", { useMongoClient: true }); // local
var path = __dirname;
app.use("/server/data", express.static(path + "/data"));

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type,Auth_Token"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("port", port);

var routes = require("./api/routes/Routes");
routes(app);

app.listen(port);
module.exports = app;

console.log("todo list RESTful API server started on: " + port);
