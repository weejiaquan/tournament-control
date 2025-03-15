import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { API_URL } from '../config';

const ImageGallery = ({ onSelectImage }) => {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    const response = await fetch(`${API_URL}/api/images`);
    const data = await response.json();
    setImages(data);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
        const response = await fetch(`${API_URL}/api/upload`, {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        await fetchImages();
        // Optionally select the newly uploaded image
        if (data.url) {
          onSelectImage(data.url);
        }
      } catch (error) {
        console.error('Upload failed:', error);
      } finally {
        setUploading(false);
      }
    };

  return (
    <GalleryContainer>
      <UploadButton>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: 'none' }}
          id="imageUpload"
        />
        <label htmlFor="imageUpload">Upload Image</label>
      </UploadButton>
      <ImageGrid>
        {images.map((image, index) => (
          <ImageThumbnail
            key={index}
            onClick={() => onSelectImage(image.url)}
            src={image.url}
            alt={`Background ${index + 1}`}
          />
        ))}
      </ImageGrid>
    </GalleryContainer>
  );
};

const GalleryContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.8);
  padding: 1rem;
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
  max-height: 150px;
  overflow-x: auto;
`;

const ImageThumbnail = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  cursor: pointer;
  border: 2px solid transparent;
  border-radius: 4px;
  
  &:hover {
    border-color: #007bff;
  }
`;

const UploadButton = styled.div`
  margin-bottom: 1rem;
  
  label {
    background: #007bff;
    color: white;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    
    &:hover {
      background: #0056b3;
    }
  }
`;

export default ImageGallery;