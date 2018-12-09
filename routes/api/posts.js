const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Load models
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');

// Validation
const validatePostInput = require('../../validation/post');

// @route       GET /api/posts/test
// @description Tests posts route
// @access      Public
router.get('/test', (req, res) => res.json({ msg: 'Posts works' }));

// @route       GET /api/posts
// @description Get post
// @access      Public
router.get('/', (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({ nopostsfound: 'No posts found' }));
});

// @route       GET /api/posts/:id
// @description Get post by id
// @access      Public
router.get('/:id', (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err =>
      res.status(404).json({ nopostfound: 'No post found with that ID' })
    );
});

// @route       POST /api/posts
// @description Create post
// @access      Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const newPost = new Post({
      user: req.user.id,
      text: req.body.text,
      name: req.body.name, // Redux will get user's name and avatar
      avatar: req.body.avatar
    });

    newPost
      .save()
      .then(post => res.json(post))
      .catch(err => res.status(400).json(err));
  }
);

// @route       DELETE /api/posts/:id
// @description Delete post
// @access      Private
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        // Check for post owner
        if (post.user.toString() !== req.user.id) {
          return res.status(401).json({
            notauthorized: 'User not authorized'
          });
        }

        // Delete
        Post.deleteOne()
          .then(() => res.json({ success: true }))
          .catch(err =>
            res.status(404).json({
              error: 'Error deleting post'
            })
          );
      })
      .catch(err => res.status(404).json({ postnotfound: 'No post found' }));

    // May try the below in the future:
    // Post.findOneAndDelete({user: req.user.id, id: req.params.id}).then();
  }
);

module.exports = router;
