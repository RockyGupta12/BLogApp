import React, { useState, useEffect } from "react";
import blogService from "../services/blog";
import Notification from "../components/notification";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";

const BlogForm = () => {
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newContent, setNewContent] = useState("");
  const [image, setImage] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [updatingBlogId, setUpdatingBlogId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataFromLocal = window.localStorage.getItem("loggedBlogUser");
        if (dataFromLocal) {
          const gotUser = JSON.parse(dataFromLocal);
          blogService.setToken(gotUser.token);
          setCurrentUser(gotUser);
        }
        const fetchedBlogs = await blogService.getAll();
        setBlogs(fetchedBlogs);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleLike = async (blogId) => {
    try {
      await blogService.like(blogId);
      const updatedBlogs = blogs.map((blog) => {
        if (blog.id === blogId) {
          return { ...blog, likes: blog.likes + 1 };
        }
        return blog;
      });
      setBlogs(updatedBlogs);
    } catch (error) {
      console.error("Error liking blog:", error);
      setErrorMessage("Failed to like the blog.");
      setTimeout(() => {
        setErrorMessage(null);
      }, 4000);
    }
  };

  const handleDislike = async (blogId) => {
    try {
      await blogService.dislike(blogId);
      const updatedBlogs = blogs.map((blog) => {
        if (blog.id === blogId) {
          return { ...blog, dislikes: blog.dislikes + 1 };
        }
        return blog;
      });
      setBlogs(updatedBlogs);
    } catch (error) {
      console.error("Error disliking blog:", error);
      setErrorMessage("Failed to dislike the blog.");
      setTimeout(() => {
        setErrorMessage(null);
      }, 4000);
    }
  };

  const handleBlog = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", newTitle);
      formData.append("author", newAuthor);
      formData.append("content", newContent);
      formData.append("likes", 0);
      formData.append("dislikes", 0);
      if (image) {
        formData.append("image", image);
      }

      const newBlog = await blogService.create(formData);

      setBlogs([...blogs, newBlog]);
      setNewTitle("");
      setNewAuthor("");
      setNewContent("");
      setImage(null);

      window.alert("Blog created Successfully");
    } catch (error) {
      console.error("Error creating blog:", error);
      setErrorMessage("Failed to create a new blog.");
    }
  };

  const updateBlog = async () => {
    try {
      const updatedBlog = await blogService.update(updatingBlogId, {
        title: newTitle,
        author: newAuthor,
        content: newContent,
        image: image ? image.name : null,
      });

      const updatedIndex = blogs.findIndex(
        (blog) => blog.id === updatingBlogId
      );

      if (updatedIndex !== -1) {
        const updatedBlogs = [...blogs];
        updatedBlogs[updatedIndex] = updatedBlog;
        setBlogs(updatedBlogs);
      }

      setNewTitle("");
      setNewAuthor("");
      setNewContent("");
      setImage(null);
      setUpdatingBlogId(null);
      window.alert("Blog updated Successfully");
    } catch (error) {
      console.error("Error updating blog:", error);
      setErrorMessage("Failed to update the blog.");
      setTimeout(() => {
        setErrorMessage(null);
      }, 4000);
    }
  };

  const handleDelete = async (blogId) => {
    try {
      const blogToDelete = blogs.find((blog) => blog.id === blogId);

      if (!blogToDelete) {
        console.error("Blog not found for delete");
        return;
      }

      if (currentUser && blogToDelete.author.id === currentUser.id) {
        await blogService.remove(blogId);
        setBlogs(blogs.filter((blog) => blog.id !== blogId));
      } else {
        console.error("You are not authorized to delete this blog.");
      }  
    } catch (error) {
      console.error("Error deleting blog:", error);
      setErrorMessage("Failed to delete the blog.");
      setTimeout(() => {
        setErrorMessage(null);
      }, 4000);
    }
  };

  return (
    <div className="container">
      {updatingBlogId !== null ? (
        <div className="blog-form">
          <h2>Update Blog</h2>
          <form onSubmit={updateBlog}>
            <label>Title</label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <br />
            <label>Author</label>
            <input
              type="text"
              value={newAuthor}
              onChange={(e) => setNewAuthor(e.target.value)}
            />
            <br />
            <label>Content</label>
            <input
              type="text"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
            />
            <br />
            <label>Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
            <br />
            <button type="submit">Update</button>
            <button type="button" onClick={() => setUpdatingBlogId(null)}>
              Cancel
            </button>
          </form>
        </div>
      ) : (
        <div className="blog-form">
          <h2>Create a new Blog</h2>
          <Notification message={errorMessage} />
          <form onSubmit={handleBlog}>
            <label>Title</label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <br />
            <label>Author</label>
            <input
              type="text"
              value={newAuthor}
              onChange={(e) => setNewAuthor(e.target.value)}
            />
            <br />
            <label>Content</label>
            <input
              type="text"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
            />
            <br />
            <label>Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
            <br />
            <button type="submit">Create</button>
          </form>
        </div>
      )}

      <h2>All Blogs</h2>
      <ul className="blog-list">
        {blogs.map((blog) => (
           <li key={`${blog.id}-${blog.slug}`}>
            {blog.title} by {blog.author} {blog.content}
            {blog.image && (
              <img
                src={`http://localhost:8001/${blog.image}`}
                alt="Blog"
                style={{ width: "300px", height: "200px" }} // Adjust width as needed
              />
            )}{" "}
            <br/>
            <button onClick={() => handleLike(blog.id)}>
              <FaThumbsUp /> Like ({blog.likes})
            </button>
            <button onClick={() => handleDislike(blog.id)}>
              <FaThumbsDown /> Dislike ({blog.dislikes})
            </button>
            {currentUser && blog.author.id === currentUser.id && (
              <>
                <button onClick={() => handleDelete(blog.id)}>Delete</button>
                <button onClick={() => setUpdatingBlogId(blog.id)}>
                  Update
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BlogForm;
