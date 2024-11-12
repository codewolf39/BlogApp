const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");

//create a post
router.post("/", async (req, res) => {
  try {
    const newPost = new Post(req.body);
    const savedpost = await newPost.save();
    res.status(200).json(savedpost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
//UPDATE POST
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.username === req.body.username) {
      try {
        const updatedPost = await Post.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true }
        );
        res.status(200).json(updatedPost);
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(401).json("You can update only your post!");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
//delete a post
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.username === req.body.username) {
      try {
        await post.deleteOne();
        res.status(200).json("Post has been deleted...");
      } catch (err) {
        res.status(500).json(err.message);
      }
    } else {
      res.status(401).json("You can delete only your post!");
    }
  } catch (err) {
    res.status(500).json(err.message);
  }
});
//get post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});
//get all posts
// Route to handle GET requests at the root URL "/"
// This route retrieves posts based on query parameters (user or category)
router.get("/", async (req, res) => {
  // Retrieve query parameters from the request
  const username = req.query.user;
  const catName = req.query.cat;

  try {
    let posts; // Variable to store the posts to be retrieved

    // If a username query parameter is provided, retrieve posts by that username
    if (username) {
      posts = await Post.find({ username });
    }
    // Otherwise, if a category name is provided, retrieve posts in that category
    else if (catName) {
      posts = await Post.find({
        categories: {
          $in: [catName], // Matches posts where 'categories' includes the specified category
        },
      });
    }
    // If no query parameters are provided, retrieve all posts
    else {
      posts = await Post.find();
    }

    // Respond with the retrieved posts in JSON format
    res.status(200).json(posts);
  } catch (err) {
    // If an error occurs, respond with a 500 status and the error message
    res.status(500).json(err);
  }
});

module.exports = router;
