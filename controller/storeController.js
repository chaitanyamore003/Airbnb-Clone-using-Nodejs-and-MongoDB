const Home = require("../models/home");
const User = require("../models/user");

exports.getIndex = (req, res, next) => {
  Home.find().then((registeredHomes) => {
    res.render("store/index", {
      pageTitle: "Airbnb",
      registeredHomes: registeredHomes,
      currentPage: "home",
    });
  });
};

exports.getBookings = async (req, res, next) => {
  try {
    const user = await req.user.populate("bookings");

    res.render("store/bookings", {
      pageTitle: "My Bookings",
      currentPage: "bookings",
      bookedHomes: user.bookings,
    });
  } catch (err) {
    next(err);
  }
};

exports.postAddToBookings = async (req, res, next) => {
  try {
    const homeId = req.body.homeId;

    const alreadyBooked = req.user.bookings.some(
      (bookedId) => bookedId.toString() === homeId,
    );

    if (!alreadyBooked) {
      req.user.bookings.push(homeId);
      await req.user.save();
    }

    res.redirect("/bookings");
  } catch (err) {
    next(err);
  }
};

exports.postRemoveBooking = async (req, res, next) => {
  try {
    const homeId = req.body.homeId;

    req.user.bookings = req.user.bookings.filter(
      (bookingId) => bookingId.toString() !== homeId
    );

    await req.user.save();

    res.redirect("/bookings");
  } catch (err) {
    next(err);
  }
};

exports.getFavoritesList = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate("favourites");

    res.render("store/favourite-list", {
      pageTitle: "My Favourites",
      favouriteHomes: user.favourites,
      currentPage: "favourites",
    });
  } catch (err) {
    next(err);
  }
};

exports.getHomeDetails = (req, res, next) => {
  const homeId = req.params.homeId;

  Home.findById(homeId)
    .then((home) => {
      if (!home) {
        return res.redirect("/");
      }

      res.render("store/home-details", {
        pageTitle: "Home Details",
        currentPage: "home-details",
        home,
      });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/");
    });
};

exports.postAddToFavourites = async (req, res, next) => {
  try {
    const homeId = req.body.homeId;

    const alreadyFavourite = req.user.favourites.some(
      (favId) => favId.toString() === homeId,
    );

    if (!alreadyFavourite) {
      req.user.favourites.push(homeId);
      await req.user.save();
    }

    res.redirect("/favourites");
  } catch (err) {
    next(err);
  }
};

exports.postRemoveFromFavourites = async (req, res, next) => {
  try {
    const homeId = req.body.homeId;

    req.user.favourites = req.user.favourites.filter(
      (favId) => favId.toString() !== homeId,
    );

    await req.user.save();

    res.redirect("/favourites");
  } catch (err) {
    console.log(err);
    res.redirect("/favourites");
  }
};
