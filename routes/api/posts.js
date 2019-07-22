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
        post
          .deleteOne()
          .then(() => res.json({ success: true }))
          .catch(err =>
            res.status(500).json({
              error: 'Error deleting post'
            })
          );
      })
      .catch(err => res.status(404).json({ postnotfound: 'No post found' }));

    // May try the below in the future:
    // Post.findOneAndDelete({user: req.user.id, id: req.params.id}).then();
  }
);

// @route       POST /api/posts/like/:id
// @description Like post
// @access      Private
router.post(
  '/like/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        if (
          post.likes.filter(like => like.user.toString() === req.user.id)
            .length > 0
        ) {
          return res
            .status(400)
            .json({ alreadyliked: 'User already liked this post' });
        }

        // Add user ID to likes array
        post.likes.unshift({ user: req.user.id });

        post
          .save()
          .then(post => res.json(post))
          .catch(err => res.json(500).json({ error: 'Error saving like' }));
      })
      .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
  }
);

// @route       POST /api/posts/unlike/:id
// @description Unlike post
// @access      Private
router.post(
  '/unlike/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        if (
          post.likes.filter(like => like.user.toString() === req.user.id)
            .length === 0
        ) {
          return res
            .status(400)
            .json({ notliked: 'You have not yet liked the post' });
        }

        // Get remove index
        const removeIndex = post.likes
          .map(item => item.user.toString())
          .indexOf(req.user.id);

        //Splice out of array
        post.likes.splice(removeIndex, 1);

        post
          .save()
          .then(post => res.json(post))
          .catch(err => res.json(500).json({ error: 'Error saving unlike' }));
      })
      .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
  }
);

// @route       POST /api/posts/comment/:id
// @description Comment post
// @access      Private
router.post(
  '/comment/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    Post.findById(req.params.id)
      .then(post => {
        const newComment = {
          user: req.user.id,
          text: req.body.text,
          name: req.body.name,
          avatar: req.body.avatar
        };

        // Add to comment array
        post.comments.unshift(newComment);

        // Save
        post
          .save()
          .then(post => res.json(post))
          .catch(err =>
            res.status(500).json({ error: 'Error saving comment' })
          );
      })
      .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
  }
);

// @route       DELETE /api/posts/comment/:id/:comment_id
// @description Delete comment from post
// @access      Private
router.delete(
  '/comment/:id/:comment_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        // Check to see if comment exists
        if (
          post.comments.filter(
            comment => comment._id.toString() === req.params.comment_id
          ).length === 0
        ) {
          return res.status(404).json({
            commentnotexists: 'Comment does not exist'
          });
        }

        // Get remove index
        const removeIndex = post.comments
          .map(item => item._id.toString())
          .indexOf(req.params.comment_id);

        if (post.comments[removeIndex].user.toString() !== req.user.id) {
          return res
            .status(400)
            .json({ unauthorized: "Cannot remove others' comment" });
        }

        // Splice out of array
        post.comments.splice(removeIndex, 1);

        post
          .save()
          .then(post => res.json(post))
          .catch(err =>
            res.status(500).json({ error: 'Error deleting comment' })
          );
      })
      .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
  }
);

module.exports = router;
