import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { API_URL } from '../config';

const ControlPanel = () => {
  const [inputTime, setInputTime] = useState('30:00');
  const [timerState, setTimerState] = useState({ time: 1800, isRunning: false });

  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);


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
      await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });
      await fetchImages();
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleImageDelete = async (imageUrl) => {
    try {
      const filename = imageUrl.split('/').pop();
      await fetch(`${API_URL}/api/images/${filename}`, {
        method: 'DELETE',
      });
      await fetchImages();
      if (selectedImage === imageUrl) {
        setSelectedImage(null);
      }
    } catch (error) {
      console.error('Failed to delete image:', error);
    }
  };

  const handleBackgroundSelect = async (imageUrl) => {
    try {
      await fetch(`${API_URL}/api/background`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ backgroundImage: imageUrl })
      });
    } catch (error) {
      console.error('Failed to set background:', error);
    }
  };

  const clearBackground = async () => {
    try {
      await fetch(`${API_URL}/api/background`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ backgroundImage: '' })
      });
    } catch (error) {
      console.error('Failed to clear background:', error);
    }
  };

    // Add this new function to format numeric input to seconds
    const parseTimeInput = (input) => {
        // Handle MM:SS format
        if (input.includes(':')) {
            const [minutes, seconds] = input.split(':').map(Number);
            return minutes * 60 + (seconds || 0);
        }
        // Handle MMSS format
        const cleanInput = input.replace(/[^\d]/g, '').padStart(4, '0');
        const minutes = parseInt(cleanInput.slice(0, -2));
        const seconds = parseInt(cleanInput.slice(-2));
        return minutes * 60 + seconds;
    };

    const formatTimeInput = (totalSeconds) => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}${seconds.toString().padStart(2, '0')}`;
};

  const fetchTimerState = async () => {
    try {
      const response = await fetch(`${API_URL}/api/timer`);
      const data = await response.json();
      setTimerState(data);
    } catch (error) {
      console.error('Failed to fetch timer state:', error);
    }
  };

  useEffect(() => {
    fetchTimerState();
    const interval = setInterval(() => {
      if (timerState.isRunning) {
        fetchTimerState();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timerState.isRunning]);

  
  const handleTimeSubmit = async (e) => {
    e.preventDefault();
    const totalSeconds = parseTimeInput(inputTime);
    
    try {
        
      const response = await fetch(`${API_URL}/api/timer/set`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ time: totalSeconds })
      });
      const data = await response.json();
      setTimerState(data);
    } catch (error) {
      console.error('Failed to set timer:', error);
    }
  };

  const toggleTimer = async () => {
    try {
      const response = await fetch(`${API_URL}/api/timer/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      setTimerState(data);
    } catch (error) {
      console.error('Failed to toggle timer:', error);
    }
  };

  return (
    <Container>
      <ControlBox>
      <Title>Timer Control Panel</Title>
        <Form onSubmit={handleTimeSubmit}>
          <InputGroup>
            <Label htmlFor="time">Set Time (MMSS):</Label>
            <Input
                type="text"
                id="time"
                pattern="^(\d{1,4}|\d{1,2}:\d{0,2})$"
                value={inputTime}
                onChange={(e) => {
                    const value = e.target.value;
                    if (value.includes(':')) {
                        // Handle MM:SS format
                        if (value.length <= 5) {
                            setInputTime(value);
                        }
                    } else {
                        // Handle MMSS format
                        const numericValue = value.replace(/[^\d]/g, '');
                        if (numericValue.length <= 4) {
                            setInputTime(numericValue);
                        }
                    }
                }}
                placeholder="1055 or 10:55"
            />
          </InputGroup>
          <ButtonGroup>
            <Button type="submit">Set Time</Button>
            <Button 
              type="button" 
              onClick={toggleTimer}
              $isRunning={timerState.isRunning}
            >
              {timerState.isRunning ? 'Pause' : 'Start'}
            </Button>
          </ButtonGroup>
        </Form>
        <StatusText>
          Current Time: {Math.floor(timerState.time / 60)}:
          {(timerState.time % 60).toString().padStart(2, '0')}
        </StatusText>
        <GallerySection>
            <SectionTitle>Background Images</SectionTitle>
            <ButtonGroup>
                <UploadButton>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                    id="imageUpload"
                />
                <label htmlFor="imageUpload">Upload New Background</label>
                </UploadButton>
                <ClearButton onClick={clearBackground}>
                Clear Background
                </ClearButton>
            </ButtonGroup>
            
            {selectedImage && (
                <SelectedImageActions>
                <Button onClick={() => handleBackgroundSelect(selectedImage)}>
                    Set as Background
                </Button>
                <DeleteButton onClick={() => handleImageDelete(selectedImage)}>
                Delete Image
                </DeleteButton>
                </SelectedImageActions>
            )}

            <ImageGrid>
                {images.map((image, index) => (
                <ImageThumbnail
                    key={index}
                    onClick={() => setSelectedImage(image.url)}
                    src={image.url}
                    alt={`Background ${index + 1}`}
                    $isSelected={selectedImage === image.url}
                />
                ))}
            </ImageGrid>
        </GallerySection>
      </ControlBox>
    </Container>
  );
};

const ClearButton = styled.button`
  background: #6c757d;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  
  &:hover {
    background: #5a6268;
  }
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  background-color: #f5f5f5;
`;

const ControlBox = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 500px;
`;

const Title = styled.h1`
  margin-bottom: 2rem;
  text-align: center;
  color: #333;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 1.1rem;
  color: #555;
`;

const Input = styled.input`
  padding: 10px;
  font-size: 1.2rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  background: ${props => props.$isRunning ? '#dc3545' : '#28a745'};
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: ${props => props.$isRunning ? '#c82333' : '#218838'};
  }
`;

const StatusText = styled.div`
  margin-top: 2rem;
  text-align: center;
  font-size: 1.2rem;
  color: #666;
`;

const GallerySection = styled.div`
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
`;

const SectionTitle = styled.h2`
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 1rem;
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
  margin-top: 1rem;
`;

const SelectedImageActions = styled.div`
  display: flex;
  gap: 10px;
  margin: 1rem 0;
  justify-content: center;
`;

const DeleteButton = styled.button`
  padding: 8px 16px;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  background: #dc3545;
  color: white;
  cursor: pointer;
  
  &:hover {
    background: #c82333;
  }
`;

const ImageThumbnail = styled.img`
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  cursor: pointer;
  border: 2px solid ${props => props.$isSelected ? '#007bff' : 'transparent'};
  border-radius: 4px;
  
  &:hover {
    border-color: #007bff;
  }
`;

const UploadButton = styled.div`
  label {
    background: #007bff;
    color: white;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    display: inline-block;
    
    &:hover {
      background: #0056b3;
    }
  }
`;


export default ControlPanel;