const Home = require("../models/home");
const User = require("../models/user");
const { check, validationResult } = require("express-validator");

exports.getAddHome = (req, res, next) => {
  res.render("host/addHome", {
    pageTitle: "Add Home",
    currentPage: "addHome",
    errorMessages: [],
    oldInput: [],
  });
};

exports.postAddHome = [
  check("name")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Property name must be at least 3 characters long."),

  check("price")
    .isFloat({ min: 1 })
    .withMessage("Price must be greater than 0."),

  check("location")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Location must be at least 3 characters long."),

  check("rating")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5."),

  check("description")
    .trim()
    .isLength({ min: 20 })
    .withMessage("Description must be at least 20 characters long."),

  async (req, res, next) => {
    try {
      const { name, price, location, rating, description } = req.body;

      const errors = validationResult(req);

      const errorMessages = errors.array().map((err) => err.msg);

      if (!req.file) {
        errorMessages.push("Please upload a property image.");
      }

      if (errorMessages.length > 0) {
        return res.status(422).render("host/addHome", {
          pageTitle: "Add Home",
          currentPage: "addHome",
          errorMessages,
          oldInput: {
            name,
            price,
            location,
            rating,
            description,
          },
        });
      }

      const photo = req.file.path.replace(/\\/g, "/");

      const home = new Home({
        name,
        price,
        location,
        rating,
        photo,
        description,
        owner: req.user._id,
      });

      await home.save();

      res.redirect("/host/host-homes-list");
    } catch (err) {
      next(err);
    }
  },
];

exports.getHostHomesList = async (req, res, next) => {
  try {
    const registeredHomes = await Home.find({
      owner: req.user._id,
    });

    res.render("host/host-home-list", {
      pageTitle: "Host Homes",
      registeredHomes,
      currentPage: "hostHomes",
    });
  } catch (err) {
    next(err);
  }
};

exports.getHomes = async (req, res, next) => {
  try {
    const registeredHomes = await Home.find({
      owner: req.user._id,
    });

    res.render("host/edit-home", {
      pageTitle: "Edit Home",
      registeredHomes,
      currentPage: "editHome",
    });
  } catch (err) {
    next(err);
  }
};
exports.getEditHome = async (req, res, next) => {
  try {
    const homeId = req.params.homeId;

    const home = await Home.findOne({
      _id: homeId,
      owner: req.user._id,
    });

    if (!home) {
      return res.redirect("/host/host-homes-list");
    }

    res.render("host/editHome", {
      pageTitle: "Edit Home",
      currentPage: "hostHomes",
      errorMessages: [],
      oldInput: {},
      home,
    });
  } catch (err) {
    next(err);
  }
};

exports.postEditHome = [
  check("name")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Property name must be at least 3 characters long."),

  check("price")
    .isFloat({ min: 1 })
    .withMessage("Price must be greater than 0."),

  check("location")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Location must be at least 3 characters long."),

  check("rating")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5."),

  check("description")
    .trim()
    .isLength({ min: 20 })
    .withMessage("Description must be at least 20 characters long."),

  async (req, res, next) => {
    try {
      const { name, price, location, rating, description, _id } = req.body;

      const home = await Home.findOne({
        _id,
        owner: req.user._id,
      });

      if (!home) {
        return res.redirect("/host/host-homes-list");
      }

      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(422).render("host/editHome", {
          pageTitle: "Edit Home",
          currentPage: "hostHomes",
          home,
          errorMessages: errors.array().map((err) => err.msg),
          oldInput: {
            name,
            price,
            location,
            rating,
            description,
          },
        });
      }

      home.name = name;
      home.price = price;
      home.location = location;
      home.rating = rating;
      home.description = description;

      if (req.file) {
        home.photo = req.file.path.replace(/\\/g, "/");
      }

      await home.save();
      res.redirect("/host/host-homes-list");
    } catch (err) {
      next(err);
    }
  },
];

exports.postDeleteHome = async (req, res, next) => {
  try {
    const homeId = req.body.homeId;

    const home = await Home.findOne({
      _id: homeId,
      owner: req.user._id,
    });

    if (!home) {
      return res.redirect("/host/host-homes-list");
    }

    // Remove this home from all users' favourites and bookings
    await User.updateMany(
      {},
      {
        $pull: {
          favourites: homeId,
          bookings: homeId,
        },
      },
    );

    await Home.findByIdAndDelete(homeId);

    res.redirect("/host/host-homes-list");
  } catch (err) {
    next(err);
  }
};
