import React, { useState } from 'react';
import axios from 'axios';

function LoginPage () {
  return (
    <LoginComponent/>
  )
}


const LoginComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8001/user/signin', { email, password });
      console.log('Login successful:', response.data);
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div>
      <h2 className='mt-5'>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='border-4'
            required
          />
        </div>
        <div className='mt-4'>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='border-4'
            required
          />
        </div>
        <button type="submit" className='border-4'>Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
