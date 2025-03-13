const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.send(JSON.stringify(books, null ,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  if(books[isbn]){
    return res.send(JSON.stringify(books[isbn], null, 4));
  }
  return res.status(404).json({message: "Book not found!"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let author = req.params.author;
  //get the keys
  let keys = Object.keys(books);
  let filtered_book = {};
  keys.forEach((key) =>{
    let book = books[key];
    if (book.author == author){
      filtered_book[key] = book;
    }
  })
  // filtered_book = books.filter((book) => book.author === author);
  if (Object.keys(filtered_book).length > 0){
    return res.send(JSON.stringify(filtered_book, null, 4));
  }
  return res.status(300).json({message: "No authors found!"});
}); 

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
