import React, { useState } from 'react';
import axios from 'axios';

const apiBaseUrl = process.env.REACT_APP_BASE_URL || "";

function SignUp() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiBaseUrl}/user/signup`, {
        fullName,
        email,
        password,
      });
      console.log('SignUp Response:', response.data);
      setFullName('');
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error('SignUp Error:', error);
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSignUp}>
        <div>
          <label htmlFor="fullName">Full Name:</label>
          <input
            type="text"
            id="fullName"
            value={fullName}
            className='border-4'
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            className='border-4'
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            className='border-4'
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className='border-4'>Sign Up</button>
      </form>
    </div>
  );
}

export default SignUp;
