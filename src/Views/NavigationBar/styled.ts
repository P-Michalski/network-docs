import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

export const Nav = styled.nav`  
  padding: 5px 20px;
  background-color: #282c34;
  display: flex;
  gap: 20px;
`;

export const StyledNavLink = styled(NavLink)`
  color: white;
  text-decoration: none;
  font-weight: bold;
  padding: 8px 16px;
  border-radius: 4px;
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    background-color: #61dafb;
    color: #282c34;
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(97, 218, 251, 0.3);
  }
  
  &.active {
    background-color: #20a8d8;
    color: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
  
  &:active {
    transform: translateY(0);
  }
`;