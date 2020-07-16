const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../models');
const router = express.Router();

// Login Form Route
router.get('/login', (req, res) => {
  res.render('auth/login');
});


// Register Form Route
router.get('/register', (req, res) => {
  res.render('auth/register');
});


router.post('/login', (req, res) => {
  // Find User By Email Address
  db.Employee.findOne({email: req.body.email}, (err, foundEmply) => {
    if (err) return console.log(err);

    // Respond with 400 If No User Found
    if (!foundEmply) {
      return res.send('No User Found');
    }

    // Compare User Password with foundEmply Password
    bcrypt.compare(req.body.password, foundEmply.password, (err, isMatch) => {
      if (err) return console.log(err);

      // Create Session and Respond with 200 If Passwords Match
      if (isMatch) {
        // Create currentUser Object (Hide User Password)
        const currentUser = {
          _id: foundEmply._id,
          name: foundEmply.name,
          email: foundEmply.email,
          isLoggedIn: true,
        }

        // Create A New Session and Respond 200
        req.session.currentUser = currentUser;
        res.redirect('/profile');
      } else {
        // Respond with 400 If Passwords Do Not Match
        return res.send('Passwords do not match');
      }
    });
  });
});


// Register Create
router.post('/register', (req, res) => {

  db.Employee.findOne({email: req.body.email}, (err, foundEmply) => {
    if (err) return console.log(err);

    // Return Error If Account Already Exists
    if (foundEmply) return console.log('User Already Exsists');

    // Generate Hash Salt (This just makes the password hard to crack)
    bcrypt.genSalt(10, (err, salt)=> {
      if (err) return console.log(err);

      // Turn the Plain Text Password Into A Complicated Hash
      bcrypt.hash(req.body.password, salt, (err, hash) => {
        if (err) return console.log(err);

        // Destructure New User Data From Request
        const { name, email, password } = req.body;

        // Construct New User Object with Hashed Password
        const newUser = {
          name,
          email,
          password: hash, // VERY IMPORTANT! NEVER SAVE PLAIN TEXT PASSWORD
        };

        // Create New User
        db.Employee.create(newUser, (err, createdUser) => {
          if (err) return console.log(err);
      
          res.redirect('/login');
        });
      });
    });
  });
});


// Logout Route
router.get('/logout', (req, res) => {
  if (!req.session.currentUser) return res.send('You must be logged in to logout');

  req.session.destroy((err) => {
    if (err) return console.log(err);

    res.redirect('/login');
  });
});

module.exports = router;
