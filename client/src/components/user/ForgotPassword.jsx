import React from "react";
import signin from "../../assets/images/signin.jpg";


export default function ForgotPassword() {
  return (
    <div>
       <div>
      <div
        className="hero min-h-screen"
        style={{ backgroundImage: `url(${signin})` }}
      >
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left text-white">
            <h1 className="text-5xl font-bold">Forgot Password?</h1>
            <p className="py-6">
            "Forgot your password? Reset it here."
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
                <button className="btn btn-neutral">Send Code</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}
