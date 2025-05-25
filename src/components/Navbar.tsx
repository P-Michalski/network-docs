import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

const Nav = styled.nav`
  padding: 1rem;
  background-color: #282c34;
  display: flex;
  gap: 1rem;
  a {
    color: white;
    text-decoration: none;
    font-weight: bold;
  }
`;

const Navbar: React.FC = () => (
  <Nav>
    <NavLink to="/devices">Urządzenia</NavLink>
    <NavLink to="/addDevice">Dodaj urządzenie</NavLink>
    <NavLink to="/connections">Połączenia</NavLink>
    <NavLink to="/network-map">Mapa sieci</NavLink>
  </Nav>
);

export default Navbar;
