const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  let found = users.filter((user) => user.username === username);
  if (found.length > 0){
    return true;
  }else{
    return false;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
  let found = users.filter((user) => user.username === username && user.password ===password);
  if (found.length > 0){
    return true;
  }else{
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  let username = req.body.username;
  let password = req.body.password;
  if (!username || !password){
    return res.status(404).json({message: "Incomplete inpu!"});
  }
  if (authenticatedUser(username, password)){
    //if authenticated, we need to tokenize the session
    let accessToken =jwt.sign({data:password}, "access", {expiresIn: 60 * 60});
    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).json({message:"User successfully logged in!"});
  }else{
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  let review = req.body.review;
  if (req.session.authorization){
    let token = req.session.authorization['accessToken'];
    let username = req.session.authorization['username'];

    jwt.verify(token, "access",(err, user) =>{
      if (!err){
        req.user = user;
        books[isbn].reviews[username] = review;
        return res.send("Successfully added the review!");
      }else{
        return res.status(403).json({ message: "User not authenticated" });
      }
    })
  }else{
    return res.status(403).json({ message: "User not logged in" });
  }
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  if (req.session.authorization){
    let token = req.session.authorization['accessToken'];
    let username = req.session.authorization['username'];
    
    jwt.verify(token, "access", (err, user)=> {
      if (!err){
        req.user = user;
        let book = books[isbn].reviews;
        if (book[username]){
          delete book[username];
          return res.status(200).json({message: "Review deleted!"});
        }
      }else{
        return res.status(403).json({ message: "User not authenticated" });
      }
    })
  }else{
    return res.status(403).json({ message: "User not logged in" });
  }
});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
