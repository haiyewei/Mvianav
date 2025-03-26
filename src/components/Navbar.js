import React from 'react';
import NavItem from './NavItem';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <h1>React导航</h1>
      </div>
      <ul className="navbar-links">
        <NavItem href="#home">首页</NavItem>
        <NavItem href="#about">关于</NavItem>
        <NavItem href="#services">服务</NavItem>
        <NavItem href="#contact">联系我们</NavItem>
      </ul>
    </nav>
  );
}

export default Navbar; 