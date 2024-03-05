//Import Mongoose:
const mongoose = require("mongoose");

//Define Blog Schema
const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  content: String,
  likes: { type: Number, default: 0 },
  likesBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // Initialize to null
    },
  ],
  dislikes: { type: Number, default: 0 }, // Add dislikes field
  dislikesBy: [ // Add dislikesBy array
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // Initialize to null
    },
  ],
  user: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  image: {
    type: String, //or use buffer for storing image data
  },
});

//Set toJSON Transformation:
blogSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

//Exportthe Blog Model:
module.exports = mongoose.model("Blog", blogSchema);
