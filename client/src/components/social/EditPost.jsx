import React, { useState, useEffect } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { CiImageOn } from "react-icons/ci";
import axios from "axios";
import { Formik, Field, ErrorMessage, Form } from "formik";
import * as Yup from "yup";

export default function EditPost() {
  const navigate = useNavigate();
  const params = useParams(); // Assuming you have postId in the route
  const { currentUser } = useSelector((state) => state.user);
  const [files, setFiles] = useState([]);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    user: currentUser._id,
    imageUrls: [], // You may need to fetch existing image URLs for the post
    description: "",
  });

  // Define Yup validation schema
  const validationSchema = Yup.object({
    description: Yup.string().required("Description is required"),
  });

  useEffect(() => {
    const fetchPost = async () => {
      const postId = params.postId;
      const res = await fetch(`/api/post/get/post/${postId}`);
      const data = await res.json();
      console.log("Fetched Post Data:", data); // Log the data
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setFormData(data);
    };

    fetchPost();
  }, [params.postId]);

  const handleImageSubmit = async () => {
    try {
      if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
        setUploading(true);
        setImageUploadError(false);
        const promises = files.map(storeImage);
  
        const urls = await Promise.all(promises);
  
        setFormData({
          ...formData,
          imageUrls: formData.imageUrls.concat(urls),
        });
        setImageUploadError(false);
        setUploading(false);
      } else {
        setImageUploadError("You can only upload 6 images per Post");
        setUploading(false);
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      setImageUploadError("Image upload failed (2 MB max per image)");
      setUploading(false);
    }
  };
  

  const storeImage = async (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadURL) => {
              resolve(downloadURL);
            })
            .catch((error) => {
              reject(error);
            });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (formData.imageUrls.length < 1) {
        setError("You must upload at least one image");
        setSubmitting(false);
        return;
      }

      setLoading(true);
      setError(false);

      // Change the API endpoint to your post update endpoint
      const response = await axios.put(
        `/api/post/edit/${params.postId}`,
        values,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setLoading(false);

      if (response.data.success === false) {
        setError(response.data.message);
        setSubmitting(false);
        return;
      }

      console.log("Updated Post:", values);
      navigate("/profile");
    } catch (error) {
      setError(error.message);
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <div className="bg-white p-4 rounded-lg shadow">
        <h1 className="text-2xl font-semibold mb-4">Edit Post</h1>
        <Formik
  initialValues={{
    description: formData.description || '', // Ensure a default value if description is undefined
  }}
  validationSchema={validationSchema}
  onSubmit={(values, { setSubmitting }) => handleSubmit(values, { setSubmitting })}
>
          <Form className="flex flex-col gap-4">
            <Field
              type="text"
              placeholder="What's on your mind?"
              className="border p-3 rounded-lg"
              id="description"
              name="description"
            />
            <ErrorMessage
              name="description"
              component="div"
              className="text-red-500"
            />

            <p className="font-semibold">
              Add to Your Post
              <span className="font-normal text-gray-600 ml-2">
                (Limit the image size to a maximum of 2MB)
              </span>
            </p>
            <div className="flex gap-4 items-center">
              <label htmlFor="images" className="cursor-pointer">
                <CiImageOn className="text-gray-900 text-4xl" />
              </label>
              <input
                onChange={(e) => setFiles([...e.target.files])}
                className="hidden"
                type="file"
                id="images"
                accept="image/*"
                multiple
              />

              <button
                type="button"
                disabled={uploading}
                onClick={handleImageSubmit}
                className="mt-2 w-full rounded border border-blue-600 px-4 py-2 text-xs font-medium text-blue-600 hover:bg-blue-600 hover:text-white focus:outline-none focus:ring active:bg-blue-500"
              >
                {uploading ? "Uploading..." : "Upload Photos"}
              </button>
            </div>

            <p className="text-red-700 text-sm">
              {imageUploadError && imageUploadError}
            </p>
            {formData.imageUrls.length > 0 &&
              formData.imageUrls.map((url, index) => (
                <div
                  key={index}
                  className="flex justify-between p-3 border items-center"
                >
                  <img
                    src={url}
                    alt={`post image ${index}`}
                    className="w-20 h-20 object-contain rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75"
                  >
                    Delete
                  </button>
                </div>
              ))}

            <button
              type="submit"
              disabled={loading || uploading}
              className="mt-2 w-full rounded border border-slate-600 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-600 hover:text-white focus:outline-none focus:ring active:bg-slate-500"
            >
              {loading ? "Updating..." : "Update Post"}
            </button>
            {error && <p className="text-red-700 text-sm">{error}</p>}
          </Form>
        </Formik>
      </div>
    </main>
  );
}
