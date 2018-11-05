const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

// Load input validation
const validateRegisterInput = require('../../validation/register');

// Load User Model
const User = require('../../models/User');

// @route       GET /api/users/test
// @description Tests users route
// @access      Public
router.get('/test', (req, res) => res.json({ msg: 'Users works' }));

// @route       POST /api/users/register
// @description Register the user / hash the password
// @access      Public
router.post('/register', (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    // User already exists
    if (user) {
      errors.email = 'Email already exists';
      return res.status(400).json(errors);
    } else {
      // Create link of avatar
      const avatar = gravatar.url(req.body.email, {
        s: '200', // Size
        r: 'pg', // Rating
        d: 'mm' // Default
      });

      // Create new user object
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar: avatar,
        password: req.body.password
      });

      // Hash the password and save the new user to db
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route       POST /api/users/login
// @description Login user / Returning JWT token
// @access      Public
router.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({ email: email }).then(user => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ email: 'User not found' });
    }

    // Check if password is correct
    bcrypt.compare(password, user.password).then(isMatch => {
      // Passoword matched
      if (isMatch) {
        // Create JWT payload
        const payload = { id: user.id, name: user.name, avatar: user.avatar };

        // Sign the token and return it
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              token: 'Bearer ' + token
            });
          }
        );
      } else {
        return res.status(400).json({ password: 'Password incorrect' });
      }
    });
  });
});

// @route       GET /api/users/current
// @description Return current user
// @access      Private
router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  }
);

module.exports = router;
