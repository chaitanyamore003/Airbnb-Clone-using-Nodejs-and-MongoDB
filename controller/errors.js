exports.error404 = (req, res) => {
  res.status(404).render("404", { pageTitle: "Error 404", currentPage: "404" });
};
