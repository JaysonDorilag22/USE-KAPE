import { useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CiImageOn } from "react-icons/ci";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export default function CreatePost() {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [files, setFiles] = useState([]);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isExpanded, setExpanded] = useState(false);

  const validationSchema = Yup.object({
    description: Yup.string().required("Description is required"),
  });

  const handleImageSubmit = (formik) => {
    if (files.length > 0 && files.length + formik.values.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i], formik));
      }

      Promise.all(promises)
        .then((urls) => {
          formik.setFieldValue("imageUrls", [
            ...formik.values.imageUrls,
            ...urls,
          ]);
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError("Image upload failed (2 mb max per image)");
          setUploading(false);
        });
    } else {
      setImageUploadError("You can only upload 6 images per post");
      setUploading(false);
    }
  };

  const storeImage = async (file, formik) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
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
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index, formik) => {
    formik.setFieldValue(
      "imageUrls",
      formik.values.imageUrls.filter((_, i) => i !== index)
    );
  };

  const handleSubmit = async (values) => {
    try {
      if (values.imageUrls.length < 1) {
        return setError("You must upload at least one image");
      }

      setLoading(true);
      setError(false);

      // Change the API endpoint to your post creation endpoint
      const response = await axios.post("/api/post/create", values, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      setLoading(false);

      if (response.data.success === false) {
        setError(response.data.message);
      }

      console.log("Post:", values);
      window.location.reload();
      navigate("/feed");
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const toggleExpand = () => {
    setExpanded(!isExpanded);
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <div className="bg-white p-4 rounded-lg shadow">
        <h1 className="text-2xl font-semibold mb-4">Create a Post</h1>
        <div
          className={`cursor-pointer ${isExpanded ? "hidden" : ""}`}
          onClick={toggleExpand}
        >
          <p className="border p-3 rounded-lg text-gray-500">
            What's on your mind?
          </p>
        </div>
        <Formik
          initialValues={{
            description: "",
            user: currentUser._id,
            imageUrls: [],
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => handleSubmit(values)}
        >
          {(formik) => (
            <Form className={`flex flex-col gap-4 ${isExpanded ? "" : "hidden"}`}>
              <Field
                type="text"
                placeholder="What on your mind?"
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
                  onChange={(e) => {
                    setFiles(e.target.files);
                    formik.handleChange(e);
                  }}
                  className="hidden"
                  type="file"
                  id="images"
                  accept="image/*"
                  multiple
                />
                <button
                  type="button"
                  disabled={uploading}
                  onClick={() => handleImageSubmit(formik)}
                  className="mt-2 w-full rounded border border-blue-600 px-4 py-2 text-xs font-medium text-blue-600 hover:bg-blue-600 hover:text-white focus:outline-none focus:ring active:bg-blue-500"
                >
                  {uploading ? "Uploading..." : "Add Photos"}
                </button>
              </div>

              <p className="text-red-700 text-sm">
                {imageUploadError && imageUploadError}
              </p>
              {formik.values.imageUrls.length > 0 &&
                formik.values.imageUrls.map((url, index) => (
                  <div
                    key={url}
                    className="flex justify-between p-3 border items-center"
                  >
                    <img
                      src={url}
                      alt="post image"
                      className="w-20 h-20 object-contain rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index, formik)}
                      className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              <button
                type="submit"
                disabled={loading || uploading}
                className="mt-2 w-full rounded border border-slate-600 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-600 hover:text-white focus:outline-none focus:ring active:bg-slate-500"
              >
                {loading ? "Creating..." : "Post"}
              </button>
              {error && <p className="text-red-700 text-sm">{error}</p>}
            </Form>
          )}
        </Formik>
      </div>
    </main>
  );
}
