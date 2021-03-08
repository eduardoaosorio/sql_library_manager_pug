const express = require("express");
const router = express.Router();
const { Book } = require("../models/index");
const { Op } = require("sequelize");

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
    const { q: query = null } = req.query;
    if (query) {
      const allBooks = await Book.findAll({
        where: {
          [Op.or]: [
            {
              title: {
                [Op.like]: `%${query}%`,
              },
            },
            {
              author: {
                [Op.like]: `%${query}%`,
              },
            },
            {
              genre: {
                [Op.like]: `%${query}%`,
              },
            },
            {
              year: {
                [Op.like]: `%${query}%`,
              },
            },
          ],
        },
      });
      res.render("index", { allBooks });
    } else {
      const allBooks = await Book.findAll();
      res.render("index", { allBooks });
    }
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
    try {
      await Book.create({ ...req.body });
      res.redirect("/books");
    } catch (err) {
      if (err.name === "SequelizeValidationError") {
        const errMsgs = err.errors.map((error) => error.message);
        res.render("new-book", { errMsgs });
      } else {
        throw err;
      }
    }
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
    try {
      const book = await Book.findByPk(+req.params.id);
      await book.update({ ...req.body });
      res.redirect("/books");
    } catch (err) {
      if (err.name === "SequelizeValidationError") {
        const errMsgs = err.errors.map((error) => error.message);
        const book = await Book.findByPk(+req.params.id);
        res.render("update-book", { book, errMsgs });
      } else {
        throw err;
      }
    }
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
