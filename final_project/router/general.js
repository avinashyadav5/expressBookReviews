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

// Task 10: Get the book list available in the shop using Promise callbacks
public_users.get('/', function (req, res) {
  new Promise((resolve, reject) => {
    resolve(books);
  }).then((data) => {
    res.send(JSON.stringify(data, null, 4));
  }).catch((err) => {
    res.status(500).json({message: err});
  });
});

// Task 11: Get book details based on ISBN using Promise callbacks
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  new Promise((resolve, reject) => {
    const book = books[isbn];
    if (book) {
      resolve(book);
    } else {
      reject("Book with ISBN " + isbn + " not found");
    }
  }).then((book) => {
    res.send(book);
  }).catch((err) => {
    res.status(404).json({message: err});
  });
});

// Task 12: Get book details based on Author using async/await with Axios
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const response = await axios.get('http://localhost:5000/');
    let books_by_author = [];
    for (const key in response.data) {
      if (response.data[key]['author'] === author) {
        books_by_author.push(response.data[key]);
      }
    }
    if (books_by_author.length === 0) {
      return res.status(404).json({message: "No books found for this author"});
    }
    res.send(books_by_author);
  } catch (err) {
    res.status(500).json({message: err.message});
  }
});

// Task 13: Get all books based on Title using async/await with Axios
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    const response = await axios.get('http://localhost:5000/');
    let books_by_title = [];
    for (const key in response.data) {
      if (response.data[key]['title'] === title) {
        books_by_title.push(response.data[key]);
      }
    }
    if (books_by_title.length === 0) {
      return res.status(404).json({message: "No books found with this title"});
    }
    res.send(books_by_title);
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
