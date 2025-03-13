const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  let username = req.body.username;
  let password = req.body.password;
  if (username && password){
    if (!isValid(username)){
      users.push({"username": username, "password":password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    }else{
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  let getBooks = new Promise((resolve, reject) =>{
    if (books){
      resolve(books);
    }else{
      reject("Books does not exist!");
    }
  })
  getBooks.then((data) => {
    return res.send(JSON.stringify(data, null ,4));
  }).catch((error)=>{
    return res.status(500).json({message:error})
  });

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let getbook = new Promise((resolve, reject) =>{
    let isbn = req.params.isbn;
    if(books[isbn]){
      resolve(books[isbn]);
    }else{
      reject("Book not found!");
    }
  });
  getbook.then((data)=>{
    return res.send(JSON.stringify(data, null, 4));
  }).catch((error) =>{
    return res.status(500).json({message:error})
  });
  
  // if(books[isbn]){
  //   return res.send(JSON.stringify(books[isbn], null, 4));
  // }
  // return res.status(404).json({message: "Book not found!"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let getBooks = new Promise((resolve,reject) => {
    let author = req.params.author;
    let keys = Object.keys(books);
    let filtered_book = {};
    keys.forEach((key) =>{
         let book = books[key];
         if (book.author == author){
           filtered_book[key] = book;
         }
    })
    if (Object.keys(filtered_book).length > 0){
      resolve(filtered_book);
    }else{
      reject("Book not found!");
    }
  });
  getBooks.then((data)=>{
    return res.send(JSON.stringify(data, null, 4));
  }).catch((error) =>{
    return res.status(404).json({message: "No authors found!"});
  });
  // let author = req.params.author;
  // //get the keys
  // let keys = Object.keys(books);
  // let filtered_book = {};
  // keys.forEach((key) =>{
  //   let book = books[key];
  //   if (book.author == author){
  //     filtered_book[key] = book;
  //   }
  // })
  // // filtered_book = books.filter((book) => book.author === author);
  // if (Object.keys(filtered_book).length > 0){
  //   return res.send(JSON.stringify(filtered_book, null, 4));
  // }
  // return res.status(300).json({message: "No authors found!"});
}); 

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let getBooks = new Promise((resolve, reject) =>{
    let title = req.params.title;
    let keys = Object.keys(books);
    let filtered_book = {};
    keys.forEach((key) =>{
      let book = books[key];
      if (book.title == title){
        filtered_book[key] = book;
      }
    })
    if (Object.keys(filtered_book).length > 0){
      resolve(filtered_book);
    }else{
      reject("Book not found")
    }
  });
  // filtered_book = books.filter((book) => book.author === author);
  getBooks.then((data) =>{
    return res.send(JSON.stringify(data, null, 4));
  }).catch((error) =>{
    return res.status(300).json({message: "No authors found!"});
  });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  if(books[isbn]){
    return res.send(JSON.stringify(books[isbn].reviews, null, 4));
  }
  return res.status(404).json({message: "Book not found!"});
});

module.exports.general = public_users;
