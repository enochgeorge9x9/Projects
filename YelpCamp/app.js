if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();

const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport"); //for authentication
const LocalStrategy = require("passport-local");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const MongoStore = require("connect-mongo");

const User = require("./models/user");

const ExpressError = require("./utils/ExpressError");

const campgroundRouter = require("./routes/campgrounds");
const reviewRouter = require("./routes/reviews");
const userRouter = require("./routes/users");

const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/YelpCamp";

mongoose.connect(dbUrl, {
  useFindAndModify: false,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useNewUrlParser: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error!!"));
db.once("open", () => {
  console.log("MongoDB Connected");
});

app.engine("ejs", ejsMate);
app.set("view engine", "ejs"); //helps to render ejs format
app.set("views", path.join(__dirname, "views")); //Connects to the views dir

app.use(express.urlencoded({ extended: true })); //Parses the req.body from HTML
app.use(methodOverride("_method")); //Overriding POST method to other methods
app.use(express.static(path.join(__dirname, "public"))); //Connect to the public folder
app.use(flash());
app.use(helmet());
const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com/",
  "https://api.tiles.mapbox.com/",
  "https://api.mapbox.com/",
  "https://kit.fontawesome.com/",
  "https://cdnjs.cloudflare.com/",
  "https://cdn.jsdelivr.net",
];
//This is the array that needs added to
const styleSrcUrls = [
  "https://kit-free.fontawesome.com/",
  "https://api.mapbox.com/",
  "https://api.tiles.mapbox.com/",
  "https://fonts.googleapis.com/",
  "https://use.fontawesome.com/",
  "https://cdn.jsdelivr.net",
];
const connectSrcUrls = [
  "https://api.mapbox.com/",
  "https://a.tiles.mapbox.com/",
  "https://b.tiles.mapbox.com/",
  "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", "blob:"],
      objectSrc: [],
      imgSrc: [
        "'self'",
        "blob:",
        "data:",
        "https://res.cloudinary.com/enochyelpcamp/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
        "https://images.unsplash.com/",
      ],
      fontSrc: ["'self'", ...fontSrcUrls],
    },
  })
);

app.use(mongoSanitize({ replaceWith: "_" }));

const secret = process.env.SECRET || 'developmentmodepass'

const sessionStore = MongoStore.create({
  mongoUrl: dbUrl,
  secret,
  touchAfter: 24 * 60 * 60,
});

sessionStore.on("error", function (err) {
  console.log("SESSION STORE ERROR", err);
});

const sessionConfig = {
  store: sessionStore,
  name: "session",
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure:true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));

app.use(passport.initialize());
app.use(passport.session()); //Helps to be logged in

passport.use(new LocalStrategy(User.authenticate())); //uses LocalStrategy to authenticate User model
passport.serializeUser(User.serializeUser()); //how the user is stored in the session
passport.deserializeUser(User.deserializeUser()); //how the user is unstored from the session

app.use((req, res, next) => {
  if (!['/login', '/'].includes(req.originalUrl)) {
      req.session.returnTo = req.originalUrl;
  }
  // console.log('Sessions', req.session)
  res.locals.currentUser = req.user;
  // console.log('req.user: ', req.user, 'currentUser:', res.locals.currentUser )
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.get("/", (req, res) => {
  res.render("home");
});

app.use("/", userRouter);
app.use("/campgrounds", campgroundRouter);
app.use("/campgrounds/:id/reviews", reviewRouter);

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong";
  res.status(statusCode).render("error.ejs", { err });
});


const port = process.env.PORT || 8080;//This port will be provide by heroku by default
app.listen(port, (req, res) => {
  console.log(`listeing to port ${port}`.toUpperCase());
});
