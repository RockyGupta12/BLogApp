const express = require("express");
const blogRouter = express.Router();
const Blog = require("../models/blog");
const logger = require("../utils/logger");
const { tokenExtractor } = require("../utils/middleware");

const multer = require("multer");
const path = require("path");

// Set up multer storage for saving files locally
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/"); // Specify the directory where you want to save the files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Use current timestamp as filename
  },
});

const upload = multer({ storage: storage });

// Create a new blog post with image
blogRouter.post("/", tokenExtractor, upload.single("image"), async (req, res) => {
  try {
      const { title, author, content } = req.body;
      const imageUrl = req.file ? `uploads/${req.file.filename}` : null;

      const blog = new Blog({
          title: title,
          author: author,
          content: content,
          likes: 0,
          image: imageUrl,
          user: req.user._id,
      });

      const savedBlog = await blog.save();

      // Check if req.user._id is already present in savedBlog.user
      if (!savedBlog.user.includes(req.user._id)) {
          savedBlog.user.push(req.user._id); // Push req.user._id only if it's not already present
      }

      await savedBlog.save();

      // Update the user's blogs array
      req.user.blogs = req.user.blogs.concat(savedBlog._id);
      await req.user.save();

      res.json(savedBlog);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});


// Update a blog post with image
blogRouter.put("/:id", tokenExtractor, upload.single("image"), async (req, res) => {
  try {
    const { title, author, content } = req.body;
    const imageUrl = req.file ? `uploads/${req.file.filename}` : null;

    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    // Check if the user is the owner of the blog
    const isOwner = blog.user.some(userId => userId.toString() === req.user._id.toString());
    if (!isOwner) {
      return res.status(403).json({ error: "You are not authorized to update this blog" });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, author, content, image: imageUrl },
      { new: true }
    );

    if (!updatedBlog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    res.json(updatedBlog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get All Blog Posts
blogRouter.get("/", async (request, response) => {
  try {
    const blogs = await Blog.find({}).populate("user", {
      username: 1,
      name: 1,
    });

    // Fetch image data for each blog entry
    const blogsWithImages = await Promise.all(
      blogs.map(async (blog) => {
        if (blog.image) {
          const imageData = Buffer.from(blog.image, "base64");
          const imageSrc = `data:image/jpg;base64,${imageData.toString(
            "base64"
          )}`;
          return { ...blog._doc, imageSrc };
        }
        return blog;
      })
    );

    response.json(blogsWithImages);
  } catch (error) {
    console.error("Error fetching blogs with images:", error);
    response.status(500).json({ error: "Internal Server Error" });
  }
});
// blogRouter.get("/", async (request, response) => {
//   try {
//     const blogs = await Blog.find({}).populate('users', { username: 1, name: 1 });
//     response.json(blogs);
//   } catch (error) {
//     logger.error(error.message);
//   }
// });

// Get a Specific Blog Post

blogRouter.get("/:id", async (request, response) => {
  try {
    const blog = await Blog.findById(request.params.id);
    response.json(blog);
  } catch (error) {
    logger.error(error.message);
  }
});

// // Delete a Blog Post

blogRouter.delete("/:id", tokenExtractor, async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id);

    if (!blog) {
      return response.status(404).json({ error: "Blog not found" });
    }

    // Check if the user is the owner of the blog
    const isOwner = blog.user.some(userId => userId.toString() === request.user._id.toString());

   // const isOwner = blog.user.includes(request.user._id);

    if (!isOwner) {
      return response
        .status(403)
        .json({ error: "You are not authorized to delete this blog" });
    }

    const deletedBlog = await Blog.findByIdAndDelete(request.params.id);
    logger.info("blog deleted")
    if (deletedBlog) {

      return response.status(204).json("Blog deleted successfully");
      
    } else {
      return response.status(404).json({ error: "Blog id not found" });
    }
  } catch (error) {
    next(error);
  }
});

// Like a blog post
blogRouter.post("/like/:id", tokenExtractor, async (request, response) => {
  try {
    const blogId = request.params.id;
    const userId = request.user._id;

    const blog = await Blog.findById(blogId);

    if (!blog) {
      return response.status(404).json({ error: "Blog not found" });
    }

    // Check if the user has already liked the blog post
    if (blog.likesBy && blog.likesBy.includes(userId)) {
      // If already liked, remove the like
      blog.likes -= 1;
      blog.likesBy = blog.likesBy.filter(id => id.toString() !== userId.toString());
    } else {
      // Remove the user ID from the dislikesBy array if the user previously disliked the blog post
      if (blog.dislikesBy && blog.dislikesBy.includes(userId)) {
        blog.dislikes -= 1;
        blog.dislikesBy = blog.dislikesBy.filter(id => id.toString() !== userId.toString());
      }

      // Increment likes count and add the user ID to the likesBy array
      blog.likes += 1;
      blog.likesBy.push(userId);
    }

    await blog.save();
    response.json(blog);
  } catch (error) {
    response.status(500).json({ error: "Internal Server Error" });
  }
});

// Dislike a blog post
blogRouter.post("/dislike/:id", tokenExtractor, async (request, response) => {
  try {
    const blogId = request.params.id;
    const userId = request.user._id;

    const blog = await Blog.findById(blogId);

    if (!blog) {
      return response.status(404).json({ error: "Blog not found" });
    }

    // Check if the user has already disliked the blog post
    if (blog.dislikesBy && blog.dislikesBy.includes(userId)) {
      // If already disliked, remove the dislike
      blog.dislikes -= 1;
      blog.dislikesBy = blog.dislikesBy.filter(id => id.toString() !== userId.toString());
    } else {
      // Remove the user ID from the likesBy array if the user previously liked the blog post
      if (blog.likesBy && blog.likesBy.includes(userId)) {
        blog.likes -= 1;
        blog.likesBy = blog.likesBy.filter(id => id.toString() !== userId.toString());
      }

      // Increment dislikes count and add the user ID to the dislikesBy array
      blog.dislikes += 1;
      blog.dislikesBy.push(userId);
    }


    await blog.save();
    response.json(blog);
  } catch (error) {
    response.status(500).json({ error: "Internal Server Error" });
  }
});


// blogRouter.post("/like/:id", tokenExtractor, async (request, response) => {
//   try {
//     const blogId = request.params.id;
//     const userId = request.user._id;

//     const blog = await Blog.findById(blogId);

//     if (!blog) {
//       return response.status(404).json({ error: "Blog not found" });
//     }

//     // Check if the blog is already disliked by the user
//     if (blog.dislikesBy && blog.dislikesBy.toString() === userId.toString()) {
//       // If disliked, remove the dislike
//       blog.dislikes -= 1;
//       blog.dislikesBy = blog.dislikesBy.filter(id => id.toString() !== userId.toString()); // Remove the user ID from dislikesBy
//     }

//     // Check if the blog is already liked by the user
//     if (blog.likesBy && blog.likesBy.toString() === userId.toString()) {
//       // If already liked, remove the like
//       blog.likes -= 1;
//       blog.likesBy = blog.likesBy.filter(id => id.toString() !== userId.toString()); // Remove the user ID from dislikesBy
//     } else {
//       // If not already liked, increment likes count and set the user as the liker
//       blog.likes += 1;
//       blog.likesBy = userId;
//     }

//     await blog.save();
//     response.json(blog);
//   } catch (error) {
//     response.status(500).json({ error: "Internal Server Error" });
//   }
// });

// Dislike a blog post
// blogRouter.post("/dislike/:id", tokenExtractor, async (request, response) => {
//   try {
//     const blogId = request.params.id;
//     const userId = request.user._id;

//     const blog = await Blog.findById(blogId);

//     if (!blog) {
//       return response.status(404).json({ error: "Blog not found" });
//     }

//     // Check if the blog is already liked by the user
//     if (blog.likesBy && blog.likesBy.toString() === userId.toString()) {
//       // If liked, remove the like
//       blog.likes -= 1;
//       blog.likesBy = blog.likesBy.filter(id => id.toString() !== userId.toString()); // Remove the user ID from dislikesBy
//     }

//     // Check if the blog is already disliked by the user
//     if (blog.dislikesBy && blog.dislikesBy.toString() === userId.toString()) {
//       // If already disliked, remove the dislike
//       blog.dislikes -= 1;
//       blog.dislikesBy = blog.dislikesBy.filter(id => id.toString() !== userId.toString()); // Remove the user ID from dislikesBy
//     } else {
//       // If not already disliked, increment dislikes count and set the user as the disliker
//       blog.dislikes += 1;
//       blog.dislikesBy = userId;
//     }

//     await blog.save();
//     response.json(blog);
//   } catch (error) {
//     response.status(500).json({ error: "Internal Server Error" });
//   }
// });



module.exports = blogRouter;
