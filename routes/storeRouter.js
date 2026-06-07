//external modules
const express = require("express");
const storeRouter = express.Router();

//local modules
const storeController = require("../controller/storeController");
const isAuth = require("../middleware/isAuth");

storeRouter.get("/", storeController.getIndex);
storeRouter.get("/bookings", isAuth, storeController.getBookings);
storeRouter.post("/bookings", isAuth, storeController.postAddToBookings);
storeRouter.post("/bookings/remove", storeController.postRemoveBooking);
storeRouter.get("/favourites", isAuth, storeController.getFavoritesList);
storeRouter.get("/details/:homeId", storeController.getHomeDetails);
storeRouter.post("/favourites", isAuth, storeController.postAddToFavourites);
storeRouter.post("/remove-favourite", storeController.postRemoveFromFavourites);
module.exports = storeRouter;
