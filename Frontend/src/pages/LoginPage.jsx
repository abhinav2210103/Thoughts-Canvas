/*
  Frontend only for testing backend. This backend is primarily for the application Opinio 
  (GitHub repo is available) and not for this frontend. Used for admin purpose also.
*/
import React, { useState } from 'react';
import axios from 'axios';
import {
  GoogleReCaptchaProvider,
  useGoogleReCaptcha
} from 'react-google-recaptcha-v3';
import { useNavigate } from 'react-router-dom';

const recaptchaKey = process.env.REACT_APP_RECAPTCHA_SITE_KEY || "";
const apiBaseUrl = process.env.REACT_APP_BASE_URL || "";

function LoginPage() {
  return (
    <GoogleReCaptchaProvider reCaptchaKey={recaptchaKey ?? "NOT DEFINED"}
      scriptProps={{ async: true }}>
      <LoginComponent />
    </GoogleReCaptchaProvider>
  );
}

const LoginComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { executeRecaptcha } = useGoogleReCaptcha();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      if (!executeRecaptcha) {
        console.log('Execute recaptcha not yet available');
        return;
      }
      const gRecaptchaToken = await executeRecaptcha('Login');
      const response = await axios.post(`${apiBaseUrl}/user/signin`, { email, password }, { withCredentials: true });
      console.log(apiBaseUrl);
      console.log(response.data);
      setEmail('');
      setPassword('');
      navigate('/home');
    } catch (error) {
      console.error('Login error:', error);
      console.error('Response error data:', error.response.data);
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
