import { useState, useEffect } from 'react';
import axios from 'axios';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginResult, setLoginResult] = useState(null);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:5038/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        document.cookie = data.cookie
        window.location.href = `/browseview.html`;
      }
      else {
        alert('An error occurred during login. Please try again.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred during login. Please try again.');
    }
  };

  return (
    <div>
      <h2>PlanTogether</h2>
      <div className='loginDiv'>
      <form onSubmit={handleLogin}>
        <label htmlFor="username">
          <i className="fas fa-user"></i>
        </label>
        <input
          type="text"
          name="username"
          placeholder="Käyttäjänimi"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <label htmlFor="password">
          <i className="fas fa-lock"></i>
        </label>
        <input
          type="password"
          name="password"
          placeholder="Salasana"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input type="submit" value="Kirjaudu" />
      </form>
      </div>
      <h3>Etkö ole vielä käyttäjä?</h3>
      <button onClick={() => window.location.href = `/signup.html`}>Rekisteröidy!</button>
    </div>
  );
}

export default App;
