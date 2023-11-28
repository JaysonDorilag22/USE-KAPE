import React from "react";
import { Link, useNavigate } from "react-router-dom";
import signup from "../../assets/images/signup.jpg";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import OAuth from "../OAuth";
import { Formik, Field, ErrorMessage, Form } from 'formik';
import * as Yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function SignUp() {
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    username: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      const response = await axios.post('/api/auth/signup', values);

      if (response.data.success === false) {
        setLoading(false);
        toast.error(response.data.message); 
        return;
      }

      setLoading(false);
      toast.success("Sign-up successful!"); 
      navigate('/sign-in');
    } catch (error) {
      setLoading(false);
      toast.error("User already exists. Please choose a different username or email."); 
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
            <Formik
              initialValues={{ username: '', email: '', password: '' }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              <Form className="card-body">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Name</span>
                  </label>
                  <Field
                    type="text"
                    name="username"
                    placeholder="Name"
                    className="input input-bordered"
                    required
                  />
                  <ErrorMessage name="username" component="div" className="text-red-500" />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <Field
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="input input-bordered"
                    required
                  />
                  <ErrorMessage name="email" component="div" className="text-red-500" />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Password</span>
                  </label>
                  <Field
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="input input-bordered"
                    required
                  />
                  <ErrorMessage name="password" component="div" className="text-red-500" />
                </div>
                <div className="form-control">
                  <button
                    disabled={loading}
                    className="btn btn-neutral"
                    type="submit"
                  >
                    {loading ? "Loading..." : "Sign Up"}
                  </button>
                </div>
                <OAuth />
                <div className="label">
                  <span className="label-text-alt">
                    Already have an account?{" "}
                    <Link className="link link-hover" to="/sign-in">
                      Sign in
                    </Link>
                  </span>
                </div>
              </Form>
            </Formik>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
