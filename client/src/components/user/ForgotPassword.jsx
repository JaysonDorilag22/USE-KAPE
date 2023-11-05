import React, { useState, useEffect } from "react";
import signin from "../../assets/images/signin.jpg";
import { Link, useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMessage('Password reset email sent.');
      } else {
        const data = await response.json();
        setError(data.message);
      }
    } catch (error) {
      setError('An error occurred while processing your request.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="hero min-h-screen" style={{ backgroundImage: `url(${signin})` }}>
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left text-white">
            <h1 className="text-5xl font-bold">Forgot Password?</h1>
            <p className="py-6">Forgot your password? Reset it here.</p>
          </div>
          <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
            <form className="card-body" onSubmit={handleSubmit}>
              {message && <div className="text-green-600">{message}</div>}
              {error && <div className="text-red-600">{error}</div>}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  placeholder="email"
                  className="input input-bordered"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form-control">
                <button className="btn btn-neutral" disabled={loading}>
                  {loading ? 'Sending...' : 'Send'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
