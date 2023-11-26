import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import signin from "../../assets/images/signin.jpg";
import { Formik, Field, ErrorMessage, Form } from 'formik';
import * as Yup from 'yup';

export default function NewPassword() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [userIdParam, setUserIdParam] = useState("");
  const [tokenValue, setTokenValue] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const initialValues = {
    password: "",
    cpassword: "",
  };

  const validationSchema = Yup.object({
    password: Yup.string().required('Password is required'),
    cpassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required'),
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tokenParam = searchParams.get("token");

    if (tokenParam) {
      const [userId, token] = tokenParam.split("/");
      setUserIdParam(userId);
      setTokenValue(token);
    }

    axios.defaults.withCredentials = true;
  }, [location.search]);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const res = await axios.put(
        `/api/auth/password/reset/${userIdParam}/${tokenValue}`,
        { password: values.password }
      );
      console.log("Response:", res.data);
      if (res.data.status === "Success") {
        console.log("this will go to sign-in");
        setLoading(false);
      }
      navigate("/sign-in");
    } catch (err) {
      console.error("Error:", err);
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
            <h1 className="text-5xl font-bold">
              Next time kasi wag mo kalimutan
            </h1>
            <p className="py-6">Delete ko yang account mo eh</p>
          </div>
          <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              <Form className="card-body">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">New Password</span>
                  </label>
                  <Field
                    type="password"
                    name="password"
                    placeholder="password"
                    className="input input-bordered"
                    required
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Confirm Password</span>
                  </label>
                  <Field
                    type="password"
                    name="cpassword"
                    placeholder="confirm password"
                    className="input input-bordered"
                    required
                  />
                  <ErrorMessage
                    name="cpassword"
                    component="div"
                    className="text-red-500"
                  />
                </div>
                <div className="form-control">
                  <button type="submit" className="btn btn-neutral" disabled={loading}>
                    {loading ? "Sending..." : "Send"}
                  </button>
                </div>
              </Form>
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}
