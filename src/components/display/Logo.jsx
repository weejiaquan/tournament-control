import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { API_URL } from '../../config/display/';

const Logo = () => {
  const [logoState, setLogoState] = useState({
    url: '',
    style: ''
  });

  useEffect(() => {
    const fetchLogoState = async () => {
      try {
        const response = await fetch(`${API_URL}/api/logo`);
        const data = await response.json();
        setLogoState(data);
      } catch (error) {
        console.error('Failed to fetch logo state:', error);
      }
    };

    fetchLogoState();
    const logoInterval = setInterval(fetchLogoState, 1000);
    return () => clearInterval(logoInterval);
  }, []);

  if (!logoState.url) return null;

  return <LogoImage $customStyle={logoState.style} src={logoState.url} alt="Logo" />;
};

const LogoImage = styled.img`
  ${props => props.$customStyle}
`;

export default Logo;