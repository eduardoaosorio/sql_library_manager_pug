const express = require("express");
const app = express();
const path = require("path");
const mainRoutes = require("./routes/index");
const db = require("./models/index");

// setup connection to database and sync
db.sequelize
  .authenticate()
  .then(() => console.log("Connection to the database successful!"))
  .catch((err) => console.log("Couldn't connect to the database:\n", err))
  .then(() => db.sequelize.sync())
  .then(() => console.log("Sync successfull!"))
  .catch((err) => console.log("Couldn't sync the database:\n", err));

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// Middleware to serve static files
app.use("/static", express.static(path.join(__dirname, "public")));

// Middleware to parse for data
app.use(express.urlencoded({ extended: true }));

// Main routes
app.use(mainRoutes);

// 404 handler
app.use((req, res, next) => {
  const err = new Error("Page Not Found");
  err.status = 404;
  console.log("Sorry!\n", `${err.message}\n Status: ${err.status}`);
  res.status(err.status).render("page-not-found", { err });
});

// Custom error handler
app.use((err, req, res, next) => {
  if (!err.status) err.status = 500;
  if (!err.message) err.message = "Something went wrong!";
  console.log("Sorry!\n", `${err.message}\n Status: ${err.status}`);
  res.status(err.status).render("error", { err });
});

app.listen(3000, () => {
  console.log("LISTENING ON PORT 3000");
});
