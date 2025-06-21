import React from 'react';
import { Nav, StyledNavLink } from './styled';

const Navbar: React.FC = () => (
  <Nav>
    <StyledNavLink to="/devices">Urządzenia</StyledNavLink>
    <StyledNavLink to="/addDevice">Dodaj urządzenie</StyledNavLink>
    <StyledNavLink to="/connections">Połączenia</StyledNavLink>
    <StyledNavLink to="/network-map">Mapa sieci</StyledNavLink>
  </Nav>
);

export default Navbar;
