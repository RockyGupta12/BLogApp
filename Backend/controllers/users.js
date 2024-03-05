//express.Router(): Creates an instance of an Express router, allowing you to define routes.
//User: Presumably, a model representing a user. It's likely defined in the ../models/user file.
//bcrypt: A library for hashing and salting passwords securely.
//jsonwebtoken: A library for generating and verifying JSON Web Tokens (JWTs).
const userRouter = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { tokenExtractor } = require("../utils/middleware");

//Register a new user.
userRouter.post("/register", async (request, response) => {
  try {
    const { username, name, password } = request.body;

    if (
      username === undefined ||
      name === undefined ||
      password === undefined
    ) {
      return response
        .status(400)
        .json({ message: "Please fill all the fields" });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
      username,
      name,
      passwordHash,
    });
    const savedUser = await user.save();
    response.json(savedUser);
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
});

//Retrieve a user by their ID
userRouter.get("/user-profile", tokenExtractor,async (request, response) => {
  try {
    response.json(request.user);
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
});

//Retrieve all users.
userRouter.get("/", async (request, response) => {
  try {
    const users = await User.find({});
    response.json(users);
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
});

//Delete a user by their ID.
userRouter.delete("/:id", async (request, response) => {
  try {
    const deletedUser = await User.findByIdAndDelete(request.params.id);
    response.status(200).json("User deleted");
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
});

// Update a user's information by their ID.
userRouter.put("/:id", async (request, response) => {
  try {
    const { username, name } = request.body;

    if (
      username === undefined ||
      name === undefined 
    ) {
      return response
        .status(400)
        .json({ message: "Please fill all the fields" });
    }
    const user = {
      username,
      name
    };
    const updatedUser = await User.findByIdAndUpdate(request.params.id, user, {
      new: true,
    });
    response.json(updatedUser);
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
});
// userRouter.put("/:id", async (request, response) => {
//   try {
//     const { username, name, password } = request.body;

//     if (
//       username === undefined ||
//       name === undefined ||
//       password === undefined
//     ) {
//       return response
//         .status(400)
//         .json({ message: "Please fill all the fields" });
//     }
//     const saltRounds = 10;
//     const passwordHash = await bcrypt.hash(password, saltRounds);
//     const user = {
//       username,
//       name,
//       passwordHash,
//     };
//     const updatedUser = await User.findByIdAndUpdate(request.params.id, user, {
//       new: true,
//     });
//     response.json(updatedUser);
//   } catch (error) {
//     response.status(400).json({ message: error.message });
//   }
// });

//Authenticate and generate a JWT token for the user.
userRouter.post("/login", async (request, response) => {
  try {
    const { username, password } = request.body;
    if (username === undefined || password === undefined) {
      return response
        .status(400)
        .json({ message: "Please fill all the fields" });
    }
    const user = await User.findOne({ username: username });
    if (user) {
      console.log(user);
      //console.log(user.passwordHash);
      const samePassword = await bcrypt.compare(password, user.passwordHash);
      if (samePassword) {
        const userfortoken = {
          username: user.username,
          id: user._id,
        };

        const token = await jwt.sign(userfortoken, process.env.SECRET, {
          expiresIn: 3600,
        });
        response.json({ token, username: user.username, name: user.name });
      } else {
        return response.status(400).json({ message: "Password is incorrect" });
      }
    } else {
      return response.status(400).json({ message: "Username not found" });
    }
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
});

// Follow or unfollow a user
userRouter.post("/follow/:id", tokenExtractor, async (request, response) => {
  try {
    const followerId = request.user._id;
    const userId = request.params.id;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return response.status(404).json({ message: "User not found." });
    }

    // Check if the follower is trying to follow/unfollow themselves
    if (followerId.equals(userId)) {
      return response.status(400).json({ message: "You cannot follow/unfollow yourself." });
    }

    // Check if the follower is already following the user
    const isFollowing = user.followers.includes(followerId);

    if (isFollowing) {
      // If already following, unfollow the user
      const followerIndex = user.followers.indexOf(followerId);
      user.followers.splice(followerIndex, 1);
      await user.save();

      // Remove follower from current user's following list
      const currentUser = await User.findById(followerId);
      const followingIndex = currentUser.following.indexOf(userId);
      currentUser.following.splice(followingIndex, 1);
      await currentUser.save();

      response.json({ message: "Successfully unfollowed the user." });
    } else {
      // If not following, follow the user
      user.followers.push(followerId);
      await user.save();

      // Add follower to current user's following list
      const currentUser = await User.findById(followerId);
      currentUser.following.push(userId);
      await currentUser.save();

      response.json({ message: "Successfully followed the user." });
    }
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
});
  
//Export the userRouter.
module.exports = userRouter;
