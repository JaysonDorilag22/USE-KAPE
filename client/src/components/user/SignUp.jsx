import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import signup from "../../assets/images/signup.jpg";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post("/api/auth/signup", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = response.data;
      console.log(data);
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      setError(null);
      navigate("/sign-in");
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <div>
      <div
        className="hero min-h-screen"
        style={{ backgroundImage: `url(${signup})` }}
      >
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left text-white">
            <h1 className="text-5xl font-bold">Sign up now!</h1>
            <p className="py-6">
              "Welcome to UseKape, your gateway to a world of coffee
              enthusiasts! Sign in to discover a universe of coffee-related
              products and join our community of passionate coffee lovers."
            </p>
          </div>
          <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
            <form className="card-body" onSubmit={handleSubmit}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Name</span>
                </label>
                <input
                  type="text"
                  name="username"
                  placeholder="Name"
                  className="input input-bordered"
                  required
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="input input-bordered"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="input input-bordered"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <div className="form-control">
                <button className="btn btn-neutral" type="submit">
                  Sign up
                </button>
              </div>
              <div className="form-control">
                <button className="btn btn-outline">
                  <FcGoogle style={{ fontSize: "24px" }} /> Sign in with Google
                </button>
              </div>
              <div className="label">
                <span className="label-text-alt">
                  Already have an account?{" "}
                  <Link className="link link-hover" to="/sign-in">
                    Sign in
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
