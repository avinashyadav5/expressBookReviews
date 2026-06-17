const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books,null,4));
});

// Get the book list available in the shop using async/await with Axios
public_users.get('/async/books', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/');
    res.send(response.data);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    res.send(book);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

// Get book details based on ISBN using async/await with Axios
public_users.get('/async/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    res.send(response.data);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let ans = [];
  for(const [key, values] of Object.entries(books)){
    if(values.author === req.params.author){
      ans.push(books[key]);
    }
  }
  if(ans.length === 0){
    return res.status(404).json({message: "Author not found"});
  }
  res.send(ans);
});

// Get book details based on author using async/await with Axios
public_users.get('/async/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const response = await axios.get(`http://localhost:5000/author/${encodeURIComponent(author)}`);
    res.send(response.data);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let ans = [];
  for(const [key, values] of Object.entries(books)){
    if(values.title === req.params.title){
      ans.push(books[key]);
    }
  }
  if(ans.length === 0){
    return res.status(404).json({message: "Title not found"});
  }
  res.send(ans);
});

// Get all books based on title using async/await with Axios
public_users.get('/async/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    const response = await axios.get(`http://localhost:5000/title/${encodeURIComponent(title)}`);
    res.send(response.data);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    res.send(book.reviews);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;
