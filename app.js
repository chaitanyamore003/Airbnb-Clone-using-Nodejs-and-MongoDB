// Load environment variables from .env
require("dotenv").config();

// Core Modules
const path = require("path");

// External Modules
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const helmet = require("helmet");

// Local Modules
const rootDir = require("./utils/pathUtils");
const storeRouter = require("./routes/storeRouter");
const hostRouter = require("./routes/hostRouter");
const authRouter = require("./routes/authRouter");
const errorController = require("./controller/errors");
const User = require("./models/user");

const app = express();

const dbPath = process.env.MONGODB_URI;
const PORT = process.env.PORT || 3030;

// Configure EJS
app.set("view engine", "ejs");
app.set("views", "views");

//securtiy middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],

        imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],

        scriptSrc: ["'self'", "'unsafe-inline'"],

        styleSrc: ["'self'", "'unsafe-inline'"],
      },
    },
  }),
);

// Session Store
const store = new MongoDBStore({
  uri: dbPath,
  collection: "sessions",
});

// Parse Form Data
app.use(express.urlencoded({ extended: true }));

// Static Files
app.use(express.static(path.join(rootDir, "public")));
app.use("/uploads", express.static(path.join(rootDir, "uploads")));

// Session Middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  }),
);

// Authentication Middleware
app.use(async (req, res, next) => {
  res.locals.isLoggedIn = req.session.isLoggedIn || false;
  res.locals.user = null;

  if (!req.session.userId) {
    return next();
  }

  try {
    const user = await User.findById(req.session.userId);

    if (!user) {
      return next();
    }

    req.user = user;
    res.locals.user = user;

    next();
  } catch (err) {
    next(err);
  }
});

// Public Routes
app.use(authRouter);
app.use(storeRouter);

// Protected Routes
app.use("/host", (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect("/login");
  }

  if (req.user.userType !== "host") {
    return res.redirect("/");
  }

  next();
});

app.use("/host", hostRouter);

// 404 Handler
app.use(errorController.error404);

// Global Error Handler
app.use((error, req, res, next) => {
  console.error(error);

  res.status(500).render("500", {
    pageTitle: "Server Error",
    currentPage: "",
  });
});

// Database Connection & Server Startup
mongoose
  .connect(dbPath)
  .then(() => {
    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`Server is running successfully at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB:", err);
  });
