import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DriverProfile = ({ driverId, onClose, onUpdate }) => {
  const [driver, setDriver] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Fetch current driver profile
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(`/api/drivers/${driverId}`);
        setDriver(data);
      } catch (err) {
        console.error('Error fetching driver profile:', err);
      }
    };

    fetchProfile();
  }, [driverId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDriver((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await axios.put(`/api/drivers/${driverId}`, driver);
      onUpdate(data);
      onClose();
    } catch (err) {
      console.error('Error updating driver profile:', err);
    } finally {
      setSaving(false);
    }
  };

  if (!driver) return null;

  return (
    <div className="modal show d-block" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Profile</h5>
            <button type="button" className="btn-close" onClick={onClose} />
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label htmlFor="fullName" className="form-label">Full Name</label>
              <input
                id="fullName"
                name="fullName"
                className="form-control"
                value={driver.fullName}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                className="form-control"
                value={driver.email}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="phone" className="form-label">Phone</label>
              <input
                id="phone"
                name="phone"
                className="form-control"
                value={driver.phone}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="vehicle" className="form-label">Vehicle</label>
              <input
                id="vehicle"
                name="vehicle"
                className="form-control"
                value={driver.vehicle}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose} disabled={saving}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverProfile;
