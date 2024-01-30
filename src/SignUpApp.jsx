import { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './SignUpApp.css';

function SignUpApp() {
    const[username, setUsername] = useState('')
    const[password, setPassword] = useState('')

    const handleSignup = async (event) => {
        event.preventDefault();
    
        try {
            const response = await fetch('http://localhost:5038/adduser', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  name: username,
                  pass: password,
                }),
              });
              const data = await response.json();
              if(data.success){
                window.location.href = `/index.html`
              }
              else{
                alert("Käyttäjänimi on varattu");
              }
        } catch (error) {
            console.log("Eikä ollu")
        }
      };

  return (
    <>
        <h2>Rekisteröidy!</h2>
        <form onSubmit={handleSignup}>
        <label htmlFor="username">
          <i className="fas fa-user"></i>
        </label>
        <input
          type="text"
          name="usernamelogin"
          placeholder="Käyttäjänimi"
          id="username"
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <label htmlFor="passwordlogin">
          <i className="fas fa-lock"></i>
        </label>
        <input
          type="password"
          name="passwordlogin"
          placeholder="Salasana"
          id="password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input type="submit" value="Rekisteröidy" />
      </form>
    </>
  );
}

export default SignUpApp;
