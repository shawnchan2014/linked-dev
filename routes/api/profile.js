const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Load models
const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route       GET /api/profile/test
// @description Tests profile route
// @access      Public
router.get('/test', (req, res) => res.json({ msg: 'Profile works' }));

// @route       GET /api/profile
// @description Get current user's profile
// @access      Private
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {};

    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (!profile) {
          errors.noprofile = 'There is no profile for this user';
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(err => res.json(400).json(err));
  }
);

// @route       POST /api/profile
// @description Create user profile
// @access      Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // Get fields
    const profileFields = {};
    profileFields.user = req.user.id;
  }
);

module.exports = router;
