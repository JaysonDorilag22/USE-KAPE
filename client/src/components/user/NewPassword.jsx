// NewPassword.jsx
import React, { useState, useEffect } from 'react';
import signin from '../../assets/images/signin.jpg';
import { useNavigate } from 'react-router-dom';

export default function NewPassword() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const { search } = window.location;
    const searchParams = new URLSearchParams(search);
    const token = searchParams.get('token');

    if (!token) {
      setError('Invalid token. Please use a valid reset link.');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { search } = window.location;
    const searchParams = new URLSearchParams(search);
    const token = searchParams.get('token');

    try {
      const response = await fetch(`/api/auth/reset-password/${token}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ newPassword: password }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.status === 'Success') {
          setMessage('Password updated successfully. You can now log in.');
          navigate('/sign-in');
        } else {
          setError(data.message);
        }
      } else {
        setError('An error occurred while updating the password. Please try again.');
      }
    } catch (err) {
      setError('An error occurred while processing your request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div
        className="hero min-h-screen"
        style={{ backgroundImage: `url(${signin})` }}
      >
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left text-white">
            <h1 className="text-5xl font-bold">New Password?</h1>
            <p className="py-6">Make sure you remember it now...</p>
          </div>
          <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
            <form className="card-body" onSubmit={handleSubmit}>
              {loading && <div className="text-blue-500">Updating...</div>}
              {message && <div className="text-green-600">{message}</div>}
              {error && <div className="text-red-600">{error}</div>}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">New password</span>
                </label>
                <input
                  type="password"
                  placeholder="New password"
                  className="input input-bordered"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="form-control">
                <button className="btn btn-neutral" disabled={loading}>
                  {loading ? 'Updating...' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
