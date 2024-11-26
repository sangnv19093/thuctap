var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var bodyParser = require("body-parser");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var resRouter = require("./routes/restaurant");
var apiRouter = require("./routes/api");
const moment = require("moment-timezone");
const session = require("express-session");

var app = express();
moment.tz.setDefault("Asia/Ho_Chi_Minh");
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static("public"));

app.use(
  session({
    secret: "nhvhi3432j492j35nfdshfuasfjanuhas1249jasjcnydfy2h3nksjdfh9", // chuỗi kí tự đặc biệt để mã hoá
    resave: true,
    saveUninitialized: true,
  })
);

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/res", resRouter);
app.use("/api", apiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});
module.exports = app;
