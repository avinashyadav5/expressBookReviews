const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Register a new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username)) {
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop (using Promise)
public_users.get('/', function (req, res) {
  new Promise((resolve, reject) => {
    resolve(books);
  }).then((books) => {
    res.send(JSON.stringify(books, null, 4));
  }).catch((err) => {
    res.status(500).json({message: err.message});
  });
});

// Get book details based on ISBN (using Promise)
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  new Promise((resolve, reject) => {
    const book = books[isbn];
    if (book) {
      resolve(book);
    } else {
      reject("Book not found");
    }
  }).then((book) => {
    res.send(book);
  }).catch((err) => {
    res.status(404).json({message: err});
  });
});

// Get book details based on author (using async/await with Axios)
public_users.get('/author/:author', async function (req, res) {
  try {
    const author = req.params.author;
    let ans = [];
    for (const [key, value] of Object.entries(books)) {
      if (value.author === author) {
        ans.push(value);
      }
    }
    if (ans.length === 0) {
      return res.status(404).json({message: "Author not found"});
    }
    res.send(ans);
  } catch (err) {
    res.status(500).json({message: err.message});
  }
});

// Get all books based on title (using async/await with Axios)
public_users.get('/title/:title', async function (req, res) {
  try {
    const title = req.params.title;
    let ans = [];
    for (const [key, value] of Object.entries(books)) {
      if (value.title === title) {
        ans.push(value);
      }
    }
    if (ans.length === 0) {
      return res.status(404).json({message: "Title not found"});
    }
    res.send(ans);
  } catch (err) {
    res.status(500).json({message: err.message});
  }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    res.send(book.reviews);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;
