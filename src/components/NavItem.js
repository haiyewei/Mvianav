import React from 'react';

function NavItem({ href, children }) {
  return (
    <li className="nav-item">
      <a href={href}>{children}</a>
    </li>
  );
}

export default NavItem; 