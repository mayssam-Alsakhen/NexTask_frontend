import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Popup from '../popup/Popup';

export default function EditProfilePopup({ trigger, onBlur, onUpdateUser }) {
  // State to store form data
  const [name, setName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState('');
  const [previousPassword, setPreviousPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch user data on popup trigger
  useEffect(() => {
    if (trigger) {
      axios
        .get('http://127.0.0.1:8000/api/me', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        .then((response) => {
          setName(response.data.name);
          setLoading(false);
        })
        .catch((error) => {
          setError('Failed to load user data');
          setLoading(false);
        });
    }
  }, [trigger]);

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the previous password is entered
    if (!previousPassword) {
      setError('Please enter your previous password to confirm ownership.');
      return;
    }

    if (newPassword && newPassword !== newPasswordConfirmation) {
      setError('Passwords do not match.');
      return;
    }

    try {
        const userId = localStorage.getItem('user_id');
      const response = await axios.put(
        `http://127.0.0.1:8000/api/user/${userId}`, // Make sure to use dynamic user ID or fetch from context
        {
          name,
          password: newPassword,
          password_confirmation: newPasswordConfirmation,
          previousPassword,
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      if (response.status === 200) {
        // Success handling
        alert('Profile updated successfully');
        onBlur();  // Close the popup on success
      }
    } catch (err) {
      setError('Failed to update profile. Please try again.');
    }
  };

  return (
    <Popup trigger={trigger} onBlur={onBlur}>
      <form onSubmit={handleSubmit} className="w-full flex flex-col items-center text-baseText gap-4">
        <h2 className="text-xl font-bold mb-2">Edit Profile</h2>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* Username field */}
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="name" className="text-sm">Username:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 border rounded"
            placeholder="Enter your username"
          />
        </div>

        {/* New Password field */}
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="newPassword" className="text-sm">New Password:</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="p-2 border rounded"
            placeholder="Enter new password (optional)"
          />
        </div>

        {/* Confirm New Password field */}
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="newPasswordConfirmation" className="text-sm">Confirm New Password:</label>
          <input
            type="password"
            id="newPasswordConfirmation"
            value={newPasswordConfirmation}
            onChange={(e) => setNewPasswordConfirmation(e.target.value)}
            className="p-2 border rounded"
            placeholder="Confirm new password"
          />
        </div>

        {/* Previous Password field */}
        <div className="flex flex-col gap-2 w-full ">
          <label htmlFor="previousPassword" className="text-sm">Previous Password:</label>
          <input
            type="password"
            id="previousPassword"
            value={previousPassword}
            onChange={(e) => setPreviousPassword(e.target.value)}
            className="p-2 border rounded"
            placeholder="Enter your previous password to confirm"
          />
        </div>

        <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md">Save Changes</button>
      </form>
    </Popup>
  );
}
