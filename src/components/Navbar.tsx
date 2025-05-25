import React from 'react';
import { Link } from 'react-router-dom';
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
    <Link to="/devices">Urządzenia</Link>
    <Link to="/devices/add">Dodaj urządzenie</Link>
    <Link to="/connections">Połączenia</Link>
    <Link to="/network-map">Mapa sieci</Link>
  </Nav>
);

export default Navbar;
