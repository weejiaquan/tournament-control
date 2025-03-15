import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { API_URL } from '../config';

const MenuScreen = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [menuVisible, setMenuVisible] = useState(true);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch(`${API_URL}/api/menu/items`);
        const data = await response.json();
        setMenuItems(data);
      } catch (error) {
        console.error('Failed to fetch menu data:', error);
      }
    };

    const fetchVisibility = async () => {
      try {
        const response = await fetch(`${API_URL}/api/menu/visibility`);
        const data = await response.json();
        setMenuVisible(data.isVisible);
      } catch (error) {
        console.error('Failed to fetch menu visibility:', error);
      }
    };

    fetchMenuItems();
    fetchVisibility();

    const menuInterval = setInterval(fetchMenuItems, 1000);
    const visibilityInterval = setInterval(fetchVisibility, 1000);

    return () => {
      clearInterval(menuInterval);
      clearInterval(visibilityInterval);
    };
  }, []);

  return (
    <MenuContainer $visible={menuVisible}>
      <ItemGrid>
        {menuItems.map((item) => (
          <MenuItem key={item.id} $unavailable={item.unavailable}>
            <ItemImage src={item.imageUrl} alt={item.name} />
            {item.unavailable && <UnavailableOverlay />}
          </MenuItem>
        ))}
      </ItemGrid>
    </MenuContainer>
  );
};

const MenuContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.8);
  padding: 20px;
  transform: translateY(${props => props.$visible ? '0' : '100%'});
  transition: transform 0.3s ease-in-out;
  z-index: 100;
`;

const ItemGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 15px;
  max-width: 1200px;
  margin: 0 auto;
`;

const MenuItem = styled.div`
  position: relative;
  aspect-ratio: 1;
  opacity: ${props => props.$unavailable ? 0.6 : 1};
`;

const ItemImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
`;

const UnavailableOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: -5%;
    right: -5%;
    height: 2px;
    background: red;
    transform: rotate(-45deg);
  }
`;

export default MenuScreen;