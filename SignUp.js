import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './SignUp.css';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || !name) {
      setError('Lütfen tüm alanları doldurun.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Hesap başarıyla oluşturuldu!');
        setError('');
      } else {
        setError(data.message);
        setSuccessMessage('');
      }
    } catch (error) {
      console.error('Kayıt hatası:', error);
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
      setSuccessMessage('');
    }
  };

  return (
    <div className="signup-container">
      <div className="navbar">
        <div className="logo">
          <h1>WealthGuard</h1>
        </div>
        <div className="auth-links">
          <Link to="/login">Sign In</Link>
          <Link to="/signup">Sign Up</Link>
        </div>
      </div>

      <div className="form-container">
        <div className="form-box">
          <h2>Sign Up</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                type="text"
                placeholder="Ad Soyad"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <input
                type="email"
                placeholder="E-posta"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                placeholder="Şifre"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="signup-btn">Hesap Oluştur</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
