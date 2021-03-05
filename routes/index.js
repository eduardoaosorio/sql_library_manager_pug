const express = require("express");
const router = express.Router();
const { Book } = require("../models/index");

function catchAsync(fn) {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => next(err));
  };
}

// Home route redirects to the /books route
router.get(
  "/",
  catchAsync(async (req, res, next) => {
    const allBooks = await Book.findAll();
    res.json(allBooks);
  })
);

// Shows the full list of books
router.get("/books", (req, res, next) => {
  res.render("index");
});

// Shows the create new book form
router.get("/books/new", (req, res, next) => {
  res.render("new-book");
});

// Posts a new book to the database
router.post("/books/new", (req, res, next) => {});

// Shows book update form
router.get("/books/:id", (req, res, next) => {
  res.render("update-book");
});

// Updates book info in the database
router.post("/books/:id", (req, res, next) => {});

// Deletes a book
router.post("/books/:id/delete", (req, res, next) => {});

module.exports = router;
