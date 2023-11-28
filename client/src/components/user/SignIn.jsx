import React from "react";
import signin from "../../assets/images/signin.jpg";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signInStart, signInSuccess, signInFailure } from "../../redux/user/userSlice";
import Oauth from '../OAuth';
import { Formik, Field, ErrorMessage, Form } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function SignIn() {
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const handleSubmit = async (values) => {
    try {
      dispatch(signInStart());
      
      const response = await axios.post("/api/auth/signin", values);

      if (response.data.success === false) {
        dispatch(signInFailure("Invalid email or password."));
        dispatch(signInSuccess(false));

        toast.error("Invalid email or password. Please try again.");

        return;
      }

      dispatch(signInSuccess(response.data));

      if (response.data.role === 'Admin') {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    } catch (error) {
      dispatch(signInFailure("An error occurred while signing in."));
      dispatch(signInSuccess(false));

      toast.error("An error occurred. Please try again. Invalid Credentials");
    }
  };

  return (
    <div>
      <div className="hero min-h-screen" style={{ backgroundImage: `url(${signin})` }}>
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
            <Formik
              initialValues={{ email: '', password: '' }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              <Form className="card-body">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <Field
                    type="email"
                    placeholder="email"
                    className="input input-bordered"
                    required
                    name="email"
                  />
                  <ErrorMessage name="email" component="div" className="text-red-500" />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Password</span>
                  </label>
                  <Field
                    type="password"
                    placeholder="password"
                    className="input input-bordered"
                    required
                    name="password"
                  />
                  <div className="label">
                    <Link className="link link-hover" to="/forgot-password">
                      <span className="label-text-alt link link-hover">
                        Forgot password?
                      </span>
                    </Link>
                  </div>
                  <ErrorMessage name="password" component="div" className="text-red-500" />
                </div>
                <button
                  disabled={loading}
                  className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
                  type="submit"
                >
                  {loading ? "Loading..." : "Sign In"}
                </button>
                <Oauth />
                <div className="label text-center">
                  <span className="label-text-alt">
                    Don't you have an account?&nbsp;
                    <Link className="link link-hover " to="/sign-up">
                      Sign up
                    </Link>
                  </span>
                </div>
                {error && <div className="text-red-500">{error}</div>}
              </Form>
            </Formik>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
