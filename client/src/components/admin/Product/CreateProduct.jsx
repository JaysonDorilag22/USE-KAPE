import { useState } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../../../firebase';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function CreateProduct() {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }

      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError('Image upload failed (2 mb max per image)');
          setUploading(false);
        });
    } else {
      setImageUploadError('You can only upload 6 images per category');
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
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

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError('You must upload at least one image');
      setLoading(true);
      setError(false);
      const res = await fetch('/api/category/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      window.location.reload();
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <>
      <button className="btn" onClick={openModal}>
        Open Product Modal
      </button>
      <dialog id="create_product_modal" className="modal">
        <div className="modal-box">
          <form onSubmit={handleSubmit} method="dialog">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={closeModal}
            >
              ✕
            </button>

            <div>
              <label htmlFor="name" className="text-sm font-semibold">
                Name:
              </label>
              <input
                type="text"
                name="name"
                value={productData.name}
                onChange={handleInputChange}
                required
                className="input input-primary"
              />
            </div>

            <div>
              <label htmlFor="description" className="text-sm font-semibold">
                Description:
              </label>
              <textarea
                name="description"
                value={productData.description}
                onChange={handleInputChange}
                required
                className="input input-primary h-24"
              />
            </div>

            <div>
              <label htmlFor="price" className="text-sm font-semibold">
                Price:
              </label>
              <input
                type="number"
                name="price"
                value={productData.price}
                onChange={handleInputChange}
                required
                className="input input-primary"
              />
            </div>

            <div>
              <label htmlFor="category" className="text-sm font-semibold">
                Category:
              </label>
              <select
                name="category"
                value={productData.category}
                onChange={handleInputChange}
                required
                className="input input-primary"
              >
                {loadingCategories ? (
                  <option value="" disabled>
                    Loading categories...
                  </option>
                ) : (
                  categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label htmlFor="quantity" className="text-sm font-semibold">
                Quantity:
              </label>
              <input
                type="number"
                name="quantity"
                value={productData.quantity}
                onChange={handleInputChange}
                required
                className="input input-primary"
              />
            </div>

            <div>
              <label htmlFor="images" className="text-sm font-semibold">
                Images (optional):
              </label>
              <input
                type="file"
                accept="image/*"
                name="images"
                onChange={handleImageUpload}
                multiple
                className="file-input"
              />
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Uploaded Images:</h3>
              <div className="grid grid-cols-2 gap-4">
                {productData.images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Uploaded Image ${index}`}
                      className="rounded-md w-full h-40 object-cover"
                    />
                    <button
                      onClick={() => handleImageRemove(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button type="submit" className="mt-4 btn btn-primary">
              Create Product
            </button>
          </form>
        </div>
      </dialog>
    </>
  );
}
