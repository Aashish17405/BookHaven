import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ImageGallery = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get('http://localhost:3000/images');
        setImages(response.data);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, []);

  return (
    <div>
      <h2>Image Gallery</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {images.map(image => (
          <div key={image._id} style={{ margin: '10px' }}>
            <img src={image.img} alt={image.name} style={{ width: '200px', height: '200px', objectFit: 'cover' }} />
            <p>{image.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
