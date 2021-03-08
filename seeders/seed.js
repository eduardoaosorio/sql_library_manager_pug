const db = require("../models/index");
const { Book } = require("../models/index");
const bestsellers = require("./bestsellers.json");

// setup connection to database and sync and bulk create more books from bestsellers.json
db.sequelize
  .authenticate()
  .then(() => console.log("Connection to the database successful!"))
  .catch((err) => console.log("Couldn't connect to the database:\n", err))
  .then(() => db.sequelize.sync())
  .then(() => console.log("Sync successfull!"))
  .catch((err) => console.log("Couldn't sync the database:\n", err))
  .then(() => {
    Book.bulkCreate(bestsellers);
  })
  .then(() => {
    return Book.findAll();
  })
  .then((books) => {
    console.log(books);
  })
  .catch((err) => console.log(err));
