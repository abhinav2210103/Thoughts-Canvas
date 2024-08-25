import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BASE_URL = process.env.REACT_APP_BASE_URL;

function Homepage() {
  const [topicName, setTopicName] = useState('');
  const [currentTopic, setCurrentTopic] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const updateCurrentTopic = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/topic/add`, { TopicName: topicName }, { withCredentials: true });
      console.log('Topic updated:', response.data);
      fetchCurrentTopic();
    } catch (err) {
      setError('Failed to update topic');
      console.error(err);
    }
  };

  const fetchCurrentTopic = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/topic/get`, { withCredentials: true });
      setCurrentTopic(response.data.topic);
    } catch (err) {
      setError('Failed to fetch current topic');
      console.error(err);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${BASE_URL}/user/logout`, {}, { withCredentials: true });
      navigate('/login');
      
    } catch (err) {
      setError('Failed to logout');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCurrentTopic();
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
        <button onClick={updateCurrentTopic}>Update Topic</button>
      </div>
      <div style={{ marginTop: '20px' }}>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

export default Homepage;
