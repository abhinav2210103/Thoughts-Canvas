import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const BASE_URL = process.env.REACT_APP_BASE_URL;
const socket = io(BASE_URL);

function Homepage() {
  const [topicName, setTopicName] = useState('');
  const [currentTopic, setCurrentTopic] = useState(null);
  const [error, setError] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [newBlogThoughts, setNewBlogThoughts] = useState('');
  const navigate = useNavigate();

  const fetchCurrentTopic = async () => {
    console.log("Fetching current topic...");
    try {
      const response = await axios.get(`${BASE_URL}/topic/get`, { withCredentials: true });
      console.log("Current topic fetched:", response.data);
      setCurrentTopic(response.data.topic);
    } catch (err) {
      setError('Failed to fetch current topic');
      console.error(err);
    }
  };

  const fetchAllBlogs = async () => {
    console.log("Fetching all blogs...");
    try {
      const response = await axios.get(`${BASE_URL}/blog/all`, { withCredentials: true });
      console.log("Blogs fetched:", response.data.blogs);
      setBlogs(response.data.blogs);
    } catch (err) {
      setError('Failed to fetch blogs');
      console.error(err);
    }
  };

  const addNewBlog = async () => {
    console.log("Adding new blog with thoughts:", newBlogThoughts);
    try {
      const response = await axios.post(`${BASE_URL}/blog/addnew`, { thoughts: newBlogThoughts }, { withCredentials: true });
      console.log("Blog added:", response.data);
      setNewBlogThoughts('');
    } catch (err) {
      setError('Failed to add new blog');
      console.error(err);
    }
  };

  const handleLogout = async () => {
    console.log("Logging out...");
    try {
      await axios.post(`${BASE_URL}/user/logout`, {}, { withCredentials: true });
      console.log("Logout successful");
      navigate('/login');
    } catch (err) {
      setError('Failed to logout');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCurrentTopic();
    fetchAllBlogs();

    socket.on('newBlog', (newBlog) => {
      console.log("New blog received via socket:", newBlog);
      setBlogs((prevBlogs) => [newBlog, ...prevBlogs]); 
    });

    socket.on('allBlogs', (allBlogs) => {
      console.log("All blogs received via socket:", allBlogs);
      setBlogs(allBlogs);
    });

    return () => {
      socket.off('newBlog');
      socket.off('allBlogs');
    };
  }, []);

  return (
    <div>
      <h1>Current Topic</h1>
      {error && <p>{error}</p>}
      {currentTopic ? (
        <div>
          <h2>{currentTopic.TopicName}</h2>
          {currentTopic.imageUrl && <img src={currentTopic.imageUrl} alt="Topic" />}
        </div>
      ) : (
        <p>No current topic available.</p>
      )}

      <div>
        <input
          type="text"
          value={topicName}
          onChange={(e) => setTopicName(e.target.value)}
          placeholder="Enter new topic name"
        />
        <button onClick={addNewBlog}>Update Topic</button>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h2>Add New Blog</h2>
        <textarea
          value={newBlogThoughts}
          onChange={(e) => setNewBlogThoughts(e.target.value)}
          placeholder="Write your thoughts"
          rows="5"
        />
        <button onClick={addNewBlog}>Add Blog</button>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h2>All Blogs</h2>
        {blogs.length > 0 ? (
          blogs.map((blog) => (
            <div key={blog._id} style={{ borderBottom: '1px solid #ccc', marginBottom: '10px', paddingBottom: '10px' }}>
              <p>
                <strong>{blog.createdBy ? blog.createdBy.fullName : 'Unknown User'}</strong>: {blog.thoughts}
              </p>
            </div>
          ))
        ) : (
          <p>No blogs available.</p>
        )}
      </div>

      <div style={{ marginTop: '20px' }}>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

export default Homepage;
