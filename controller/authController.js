const { check, validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Login",
    currentPage: "login",
    errorMessages: [],
    oldInput: [],
  });
};

exports.postLogin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(422).render("auth/login", {
        pageTitle: "Login",
        currentPage: "login",
        isLoggedIn: false,
        errorMessages: ["User does not exist!"],
        oldInput: { email },
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(422).render("auth/login", {
        pageTitle: "Login",
        currentPage: "login",
        isLoggedIn: false,
        errorMessages: ["Invalid password!"],
        oldInput: { email },
      });
    }

    req.session.isLoggedIn = true;
    req.session.userId = user._id.toString();
    res.redirect("/");
  } catch (err) {
    console.error(err);

    return res.status(500).render("auth/login", {
      pageTitle: "Login",
      currentPage: "login",
      isLoggedIn: false,
      errorMessages: ["Something went wrong. Please try again."],
      oldInput: { email },
    });
  }
};
exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
};

exports.getSignUp = (req, res, next) => {
  res.render("auth/signUp", {
    pageTitle: "Sign Up",
    currentPage: "signup",
    errorMessages: [],
    oldInput: {},
  });
};

exports.postSignUp = [
  check("firstName")
    .trim()
    .isLength({ min: 2 })
    .withMessage("First name must be at least 2 characters long.")
    .matches(/^[A-Za-z]+$/)
    .withMessage("First name must contain only alphabets."),

  check("lastName")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Last name must be at least 2 characters long.")
    .matches(/^[A-Za-z]+$/)
    .withMessage("Last name must contain only alphabets."),

  check("email")
    .trim()
    .isEmail()
    .withMessage("Please enter a valid email address.")
    .normalizeEmail(),

  check("password")
    .trim()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long.")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter.")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter.")
    .matches(/\d/)
    .withMessage("Password must contain at least one number.")
    .matches(/[@$!%*?&]/)
    .withMessage(
      "Password must contain at least one special character (@, $, !, %, *, ?, &).",
    ),

  check("confirmPassword")
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match.");
      }
      return true;
    }),

  check("userType")
    .notEmpty()
    .withMessage("User type is required.")
    .isIn(["guest", "host"])
    .withMessage("Invalid user type."),

  check("terms").custom((value) => {
    if (value !== "on") {
      throw new Error("You must accept the terms and conditions.");
    }
    return true;
  }),

  (req, res, next) => {
    const { firstName, lastName, email, userType, password } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).render("auth/signUp", {
        pageTitle: "Sign Up",
        currentPage: "signup",
        errorMessages: errors.array().map((err) => err.msg),
        oldInput: {
          firstName,
          lastName,
          email,
          userType,
          terms: req.body.terms,
        },
      });
    }

    bcrypt
      .hash(password, 12)
      .then((hashedPassword) => {
        const user = new User({
          firstName,
          lastName,
          email,
          password: hashedPassword,
          userType,
        });
        return user.save();
      })
      .then(() => {
        res.redirect("/login");
      })
      .catch((err) => {
        return res.status(422).render("auth/signUp", {
          pageTitle: "Sign Up",
          currentPage: "signup",
          isLoggedIn: false,
          errorMessages: [err.message],
          oldInput: { firstName, lastName, email, userType },
        });
      });
  },
];
