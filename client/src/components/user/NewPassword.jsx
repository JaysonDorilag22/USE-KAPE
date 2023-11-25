import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Use useNavigate instead of useHistory
import axios from "axios";
import signin from "../../assets/images/signin.jpg";

export default function NewPassword() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [userIdParam, setUserIdParam] = useState("");
  const [tokenValue, setTokenValue] = useState("");
  const navigate = useNavigate(); // Use useNavigate hook
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tokenParam = searchParams.get("token");

    if (tokenParam) {
      const [userId, token] = tokenParam.split("/");
      setUserIdParam(userId);
      setTokenValue(token);

      // console.log('User ID from URL:', userId);
      // console.log('Token from URL:', token);
    }

    axios.defaults.withCredentials = true;
  }, [location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // console.log('Submitting with id:', userIdParam, 'and token:', tokenValue);

    try {
    setLoading(true);

      const res = await axios.put(
        `/api/auth/password/reset/${userIdParam}/${tokenValue}`,
        { password }
      );
      console.log("Response:", res.data);
      if (res.data.status === "Success") {
        console.log("this will go to sign-in");
        setLoading(false);
      }
      setLoading(false);
      navigate("/sign-in");
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <>
      <div>
        <div
          className="hero min-h-screen"
          style={{ backgroundImage: `url(${signin})` }}
        >
          <div className="hero-content flex-col lg:flex-row-reverse">
            <div className="text-center lg:text-left text-white">
              <h1 className="text-5xl font-bold">
                Next time kasi wag mo kalimutan
              </h1>
              <p className="py-6">Delete ko yang account mo eh</p>
            </div>
            <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
              <form className="card-body" onSubmit={handleSubmit}>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">New Password</span>
                  </label>
                  <input
                    type="password"
                    placeholder="password"
                    className="input input-bordered"
                    required
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="form-control">
                  <button className="btn btn-neutral" disabled={loading}>
                    {loading ? "Sending..." : "Send"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}