//Import Mongoose and Mongoose-unique-validator:
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

//Define the User Schema:
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  blogs: [ //blogs: An array of ObjectId references to the user's blog posts (assuming there's a Blog model with its own schema).
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
    },
  ],
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ], // List of followers (users who follow this user)
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

//Use Mongoose-unique-validator Plugin:
userSchema.plugin(uniqueValidator);

//Transform Object for JSON Serialization:This block defines a transformation to be applied when converting the user document to JSON.
userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  },
});

//Export the User Model:
module.exports = mongoose.model("User", userSchema);
