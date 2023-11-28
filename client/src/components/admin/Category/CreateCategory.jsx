import { useState } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../../../firebase';
import { useNavigate } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const CreateCategorySchema = Yup.object().shape({
  name: Yup.string().required('Name is required').min(10, 'Name must be at least 10 characters').max(62, 'Name must be at most 62 characters'),
  description: Yup.string().required('Description is required'),
});

export default function CreateCategory() {
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

  const handleImageSubmit = () => {
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
        .catch(() => {
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

  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true);
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
          ...values,
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
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>
        Create a Category
      </h1>
      <Formik
        initialValues={{
          name: formData.name,
          description: formData.description,
        }}
        validationSchema={CreateCategorySchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className='flex flex-col sm:flex-row gap-4'>
            <div className='flex flex-col gap-4 flex-1'>
              <Field
                type='text'
                placeholder='Name'
                className='border p-3 rounded-lg'
                id='name'
                name='name'
              />
              <ErrorMessage
                name='name'
                component='p'
                className='text-red-700 text-sm'
              />
              <Field
                as='textarea'
                type='text'
                placeholder='Description'
                className='border p-3 rounded-lg'
                id='description'
                name='description'
              />
              <ErrorMessage
                name='description'
                component='p'
                className='text-red-700 text-sm'
              />
            </div>
            <div className='flex flex-col flex-1 gap-4'>
              <p className='font-semibold'>
                Images:
                <span className='font-normal text-gray-600 ml-2'>
                  Limit the image size to a maximum of 2MB.
                </span>
              </p>
              <div className='flex gap-4'>
                <Field
                  name='images'
                  onChange={(e) => setFiles(e.target.files)}
                  className='p-3 border border-gray-300 rounded w-full'
                  type='file'
                  id='images'
                  accept='image/*'
                  multiple
                />
                <button
                  type='button'
                  disabled={uploading}
                  onClick={handleImageSubmit}
                  className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'
                >
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
              <p className='text-red-700 text-sm'>
                {imageUploadError && imageUploadError}
              </p>
              {formData.imageUrls.length > 0 &&
                formData.imageUrls.map((url, index) => (
                  <div
                    key={url}
                    className='flex justify-between p-3 border items-center'
                  >
                    <img
                      src={url}
                      alt='category image'
                      className='w-20 h-20 object-contain rounded-lg'
                    />
                    <button
                      type='button'
                      onClick={() => handleRemoveImage(index)}
                      className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'
                    >
                      Delete
                    </button>
                  </div>
                ))}
              <button
                type='submit'
                disabled={loading || uploading || isSubmitting}
                className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
              >
                {loading ? 'Creating...' : 'Create category'}
              </button>
              {error && <p className='text-red-700 text-sm'>{error}</p>}
            </div>
          </Form>
        )}
      </Formik>
    </main>
  );
}
