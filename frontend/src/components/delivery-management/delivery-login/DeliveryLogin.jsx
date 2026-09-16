/* DeliveryLogin.jsx */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const DeliveryLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const resp = await axios.post(
        'http://localhost:8084/api/driver/login',
        { email, password },
        { headers: { 'Content-Type': 'application/json' } }
      );

      // save driver info (you could also save a token here)
      localStorage.setItem('driver', JSON.stringify(resp.data));

      // navigate to Dashboard
      navigate('/delivery-dashboard');
    } catch (err) {
      console.error(err);
      // backend errors come in err.response.data or err.message
      setError(
        err.response?.data?.message ||
        err.response?.data ||
        'Login failed. Please check your credentials.'
      );
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ width: '100%', maxWidth: '400px' }}>
        <h3 className="text-center mb-4">Login</h3>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="loginEmail" className="form-label">
              Email
            </label>
            <input
              id="loginEmail"
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="form-control"
              disabled={loading}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="loginPassword" className="form-label">
              Password
            </label>
            <input
              id="loginPassword"
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="form-control"
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? (
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              />
            ) : (
              'Login'
            )}
          </button>
        </form>

        <p className="mt-3 text-center">
          Don&apos;t have an account?{' '}
          <Link to="/delivery-register" className="text-primary text-decoration-underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default DeliveryLogin;
