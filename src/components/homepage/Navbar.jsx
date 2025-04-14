import React from "react";
import "./index.scss";

const Navbar = () => {
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="navbar position-sticky sticky-top">
      <ul className="navbar-list">
        <li onClick={() => scrollToSection("home")}>
          Home
          <div className="line-seperate"></div>
        </li>
        <li onClick={() => scrollToSection("programs")}>
          Program
          <div className="line-seperate"></div>
        </li>
        <li onClick={() => scrollToSection("teachers")}>
          Teachers
          <div className="line-seperate"></div>
        </li>
        <li onClick={() => scrollToSection("aboutus")}>
          About Us
          <div className="line-seperate"></div>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
