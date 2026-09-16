/* DeliveryRegister.jsx */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const DeliveryRegister = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail]       = useState('');
  const [phone, setPhone]       = useState('');
  const [vehicle, setVehicle]   = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const resp = await axios.post(
        'http://localhost:8084/api/driver/register',
        { fullName, email, phone, vehicle, password },
        { headers: { 'Content-Type': 'application/json' } }
      );

      // optionally auto-login: save driver info
      localStorage.setItem('driver', JSON.stringify(resp.data));
      
      // redirect to dashboard
      navigate('/delivery-dashboard');
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
        err.response?.data ||
        'Registration failed. Please try again.'
      );
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="text-center mb-4">Register</h2>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="regName" className="form-label">Full Name</label>
            <input
              id="regName"
              type="text"
              required
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              className="form-control"
              disabled={loading}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="regEmail" className="form-label">Email</label>
            <input
              id="regEmail"
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="form-control"
              disabled={loading}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="regPhone" className="form-label">Phone Number</label>
            <input
              id="regPhone"
              type="tel"
              required
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="form-control"
              disabled={loading}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="regVehicle" className="form-label">Vehicle Details</label>
            <input
              id="regVehicle"
              type="text"
              placeholder="e.g. Bike, Car, Van"
              required
              value={vehicle}
              onChange={e => setVehicle(e.target.value)}
              className="form-control"
              disabled={loading}
            />
          </div>

          <div className="row">
            <div className="col-6 mb-3">
              <label htmlFor="regPassword" className="form-label">Password</label>
              <input
                id="regPassword"
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="form-control"
                disabled={loading}
              />
            </div>
            <div className="col-6 mb-3">
              <label htmlFor="regConfirm" className="form-label">Confirm Password</label>
              <input
                id="regConfirm"
                type="password"
                required
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                className="form-control"
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-success w-100"
            disabled={loading}
          >
            {loading ? (
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              />
            ) : (
              'Register'
            )}
          </button>
        </form>

        <p className="mt-3 text-center">
          Already have an account?{' '}
          <Link to="/delivery-login" className="text-primary text-decoration-none">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default DeliveryRegister;
