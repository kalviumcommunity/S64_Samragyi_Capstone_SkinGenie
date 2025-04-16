import React, { useState } from 'react';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login submitted', { email, password });
  };

  return (
    <div className="auth-form">
      <h2>Welcome Back!</h2>
      <p>Your skin deserves the best – and so do you.</p>
      <form onSubmit={handleSubmit}>
        <label>
          Your Mail Id:
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <button type="submit">LOGIN</button>
        <p>
          Don’t have account yet? <a href="/signup">Signup</a>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;
