import React, { useState } from 'react';
import axios from 'axios';

const ImageUpload = () => {
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('image', image);

    try {
      const response = await axios.post('http://localhost:3000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Image uploaded successfully');
    } catch (error) {
      console.error('There was an error uploading the image!', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter image name"
          required
        />
        <input type="file" onChange={handleImageChange} required />
        <button type="submit">Upload Image</button>
      </form>
    </div>
  );
};

export default ImageUpload;
