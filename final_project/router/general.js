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

// Task 1: Get the book list available in the shop
public_users.get('/', function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

// Task 2: Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn]);
});

// Task 3: Get book details based on Author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  let book_author = [];
  const book_keys = Object.keys(books);
  book_keys.forEach((key) => {
    if (books[key]['author'] === author) {
      book_author.push(books[key]);
    }
  });
  res.send(book_author);
});

// Task 4: Get all books based on Title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  let book_title = [];
  const book_keys = Object.keys(books);
  book_keys.forEach((key) => {
    if (books[key]['title'] === title) {
      book_title.push(books[key]);
    }
  });
  res.send(book_title);
});

// Task 5: Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

// Task 10: Get all books using Promise callbacks
public_users.get('/async/books', function (req, res) {
  let p = new Promise((resolve, reject) => {
    resolve(books);
  });
  p.then(data => res.send(JSON.stringify(data, null, 4)))
   .catch(err => res.status(500).json({message: err.message}));
});

// Task 11: Get book details by ISBN using Promise callbacks
public_users.get('/async/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("Book with ISBN " + isbn + " not found");
    }
  }).then(book => res.send(book))
    .catch(err => res.status(404).json({message: err}));
});

// Task 12: Get book details by Author using async/await with Axios
public_users.get('/async/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const getData = await axios.get('http://localhost:5000/');
    const keys = Object.keys(getData.data);
    let book_author = [];
    keys.forEach((key) => {
      if (getData.data[key]['author'] === author) {
        book_author.push(getData.data[key]);
      }
    });
    res.send(book_author);
  } catch (err) {
    res.status(500).json({message: err.message});
  }
});

// Task 13: Get book details by Title using async/await with Axios
public_users.get('/async/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    const getData = await axios.get('http://localhost:5000/');
    const keys = Object.keys(getData.data);
    let book_title = [];
    keys.forEach((key) => {
      if (getData.data[key]['title'] === title) {
        book_title.push(getData.data[key]);
      }
    });
    res.send(book_title);
  } catch (err) {
    res.status(500).json({message: err.message});
  }
});

module.exports.general = public_users;
