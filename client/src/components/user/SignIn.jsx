import React from "react";
import { Link } from "react-router-dom";
import signin from "../../assets/images/signin.jpg";
import { FcGoogle } from "react-icons/fc";

export default function SignIn() {
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
              "Welcome to UseKape, your gateway to a world of coffee
              enthusiasts! Sign in to discover a universe of coffee-related
              products and join our community of passionate coffee lovers."
            </p>
          </div>
          <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
            <form className="card-body">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  placeholder="email"
                  className="input input-bordered"
                  required
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
                />
                <label className="label">
                  <Link className="link link-hover" to={"/forgot-password"}>
                    <a className="label-text-alt link link-hover">
                      Forgot password?
                    </a>
                  </Link>
                </label>
              </div>
              <div className="form-control">
                <button className="btn btn-neutral">Login</button>
              </div>
              <div className="form-control">
                <button className="btn btn-outline">
                  <FcGoogle style={{ fontSize: "24px" }} /> Sign in with Google
                </button>
              </div>
              <label className="label ">
                <a className="label-text-alt">
                  You dont you have account?
                  <Link className="link link-hover" to={"/sign-up"}>
                    {" "}
                    Sign up
                  </Link>
                </a>
              </label>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
