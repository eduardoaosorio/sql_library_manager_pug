const express = require("express");
const router = express.Router();
const { Book } = require("../models/index");

function catchAsync(fn) {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => next(err));
  };
}

// Home route redirects to the /books route
router.get("/", (req, res, next) => {
  res.redirect("/books");
});

// Shows the full list of books
router.get(
  "/books",
  catchAsync(async (req, res, next) => {
    const allBooks = await Book.findAll();
    res.render("index", { allBooks });
  })
);

// Shows the create new book form
router.get("/books/new", (req, res, next) => {
  res.render("new-book");
});

// Posts a new book to the database
router.post(
  "/books/new",
  catchAsync(async (req, res, next) => {
    await Book.create({ ...req.body });
    res.redirect("/books");
  })
);

// Shows book update form
router.get(
  "/books/:id",
  catchAsync(async (req, res, next) => {
    const book = await Book.findByPk(+req.params.id);
    res.render("update-book", { book });
  })
);

// Updates book info in the database
router.post(
  "/books/:id",
  catchAsync(async (req, res, next) => {
    const book = await Book.findByPk(+req.params.id);
    // depronto se puede optimizar que solo se update las prps que hayan cambiando, revisando antes cuales cambiaron
    await book.update({ ...req.body });
    res.redirect("/books");
  })
);

// Deletes a book
router.post(
  "/books/:id/delete",
  catchAsync(async (req, res, next) => {
    const book = await Book.findByPk(+req.params.id);
    await book.destroy();
    res.redirect("/books");
  })
);

module.exports = router;
