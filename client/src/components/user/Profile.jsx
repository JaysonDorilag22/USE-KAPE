import { useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import Timeline from "../social/Timeline.jsx";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
} from "../../redux/user/userSlice.js";
import { useDispatch } from "react-redux";
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const dispatch = useDispatch();

  console.log(formData);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
        toast.error("Error uploading image (image must be less than 2 MB)");
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());

      // Using Axios for API call
      const response = await axios.post(`/api/user/update/${currentUser._id}`, formData);

      if (response.data.success === false) {
        dispatch(updateUserFailure(response.data.message));
        toast.error(response.data.message);
        return;
      }

      dispatch(updateUserSuccess(response.data));
      setUpdateSuccess(true);
      toast.success("User updated successfully!");
    } catch (error) {
      dispatch(updateUserFailure(error.message));
      toast.error("An error occurred while updating user.");
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());

      // Using Axios for API call
      const response = await axios.delete(`/api/user/delete/${currentUser._id}`);

      if (response.data.success === false) {
        dispatch(deleteUserFailure(response.data.message));
        toast.error(response.data.message);
        return;
      }

      dispatch(deleteUserSuccess(response.data));
      toast.success("User deleted successfully!");
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
      toast.error("An error occurred while deleting user.");
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());

      // Using Axios for API call
      const response = await axios.get("/api/auth/signout");

      if (response.data.success === false) {
        dispatch(deleteUserFailure(response.data.message));
        toast.error(response.data.message);
        return;
      }

      dispatch(deleteUserSuccess(response.data));
      toast.success("Signed out successfully!");
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
      toast.error("An error occurred while signing out.");
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">
              Error Image upload (image must be less than 2 MB)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className="text-green-700">Image successfully uploaded!</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          placeholder="username"
          id="username"
          defaultValue={currentUser.username}
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="email"
          id="email"
          defaultValue={currentUser.email}
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="password"
          id="password"
          placeholder="password"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-slate-700  text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "loading..." : "update"}
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <Link to="/" className="text-red-700 cursor-pointer" onClick={handleDeleteUser}>
          Delete account
        </Link>
        <Link to="/" className="text-red-700 cursor-pointer" onClick={handleSignOut}>
          Sign out
        </Link>
      </div>

      <p className="text-red-700 mt-5">{error ? error : ""}</p>
      <p className="text-green-700 mt-5">
        {updateSuccess ? "User is updated successfully!" : ""}
      </p>
      <Timeline/>
      <ToastContainer />
    </div>
  );
}
