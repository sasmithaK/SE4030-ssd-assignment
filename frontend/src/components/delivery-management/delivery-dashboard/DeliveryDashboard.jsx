// src/components/delivery-management/DeliveryDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DriverProfile from './DriverProfile';

const DeliveryDashboard = () => {
  const navigate = useNavigate();
  const [driver, setDriver] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    // Grab driver from localStorage (set on login)
    const stored = localStorage.getItem('driver');
    if (!stored) {
      // not logged in → back to login
      navigate('/');
      return;
    }
    setDriver(JSON.parse(stored));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('driver');
    navigate('/');
  };

  if (!driver) return null; // or a spinner

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Welcome, {driver.fullName}</h2>
        <button className="btn btn-secondary" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="card p-4 mb-4">
        <h5>Driver Details</h5>
        <p>Email: {driver.email}</p>
        <p>Phone: {driver.phone}</p>
        <p>Vehicle: {driver.vehicle}</p>
        <button
          className="btn btn-primary"
          onClick={() => setShowProfile(true)}
        >
          View / Edit Profile
        </button>
      </div>

      {showProfile && (
        <DriverProfile
          driverId={driver.id}
          onClose={() => setShowProfile(false)}
          onUpdate={(updatedDriver) => {
            // sync localStorage & parent state
            localStorage.setItem('driver', JSON.stringify(updatedDriver));
            setDriver(updatedDriver);
          }}
        />
      )}
    </div>
  );
};

export default DeliveryDashboard;
