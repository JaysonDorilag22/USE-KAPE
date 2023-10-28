import React from "react";
import signin from "../../assets/images/signin.jpg";
import { Link } from "react-router-dom";

export default function NewPassword() {
  return (
    <div>
      <div>
        <div
          className="hero min-h-screen"
          style={{ backgroundImage: `url(${signin})` }}
        >
          <div className="hero-content flex-col lg:flex-row-reverse">
            <div className="text-center lg:text-left text-white">
              <h1 className="text-5xl font-bold">New Password?</h1>
              <p className="py-6">"Make sure you remember it now..."</p>
            </div>
            <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
              <form className="card-body">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">New password</span>
                  </label>
                  <input
                    type="password"
                    placeholder="New password"
                    className="input input-bordered"
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Confirm password</span>
                  </label>
                  <input
                    type="password"
                    placeholder="Confirm password"
                    className="input input-bordered"
                    required
                  />
                </div>
                <Link className="link link-hover" to={"/sign-in"}>
                  <div className="form-control">
                    <button className="btn btn-neutral">
                      Go back to sign in
                    </button>
                  </div>
                </Link>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
