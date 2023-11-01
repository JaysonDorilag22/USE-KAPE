import React from "react";
import signin from "../../assets/images/signin.jpg";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signInStart, signInSuccess, signInFailure } from "../../redux/user/userSlice";
import OAuth from "../OAuth";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      dispatch(signInFailure(data.message));
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
            <h1 className="text-5xl font-bold">Sign in now!</h1>
            <p className="py-6">
              Welcome to UseKape, your gateway to a world of coffee enthusiasts!
              Sign in to discover a universe of coffee-related products and join
              our community of passionate coffee lovers.
            </p>
          </div>
          <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
            <form onSubmit={handleSubmit} className="card-body">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  placeholder="email"
                  className="input input-bordered"
                  required
                  id="email"
                  onChange={handleChange}
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type="password"
                  placeholder="password"
                  className="input input-bordered"
                  required
                  id="password"
                  onChange={handleChange}
                />
                <div className="label">
                  <Link className="link link-hover" to="/forgot-password">
                    <span className="label-text-alt link link-hover">
                      Forgot password?
                    </span>
                  </Link>
                </div>
              </div>
              <button
                disabled={loading}
                className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
              >
                {loading ? "Loading..." : "Sign In"}
              </button>
              <OAuth/>
              <div className="label text-center">
                <span className="label-text-alt">
                  Don't you have an account?&nbsp;
                  <Link className="link link-hover " to="/sign-up">
                    Sign up
                  </Link>
                </span>
              </div>
              {error && <div className="text-red-500">{error}</div>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
