import React from "react";
import { useState, useEffect } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { IoMdPerson } from "react-icons/io";
import "./index.scss";
import { useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "../../contexts/AccountContext";
import "react-toastify/dist/ReactToastify.css";
import AuthButton from "../buttons/AuthButton";

const Header = ({ userInfo }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const { setAccount, account } = useAuth();
  const isAdmin =
    account && (account.role === "admin" || account.role === "staff");

  const handleLogout = async () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_info");
    setAccount(null);
    navigate("/");
  };

  const getProfile = () => {
    if (userInfo) {
      setProfile(userInfo);
      setIsLoggedIn(true);
    }
    if (!localStorage.getItem("access_token")) {
      setIsLoggedIn(false);
    }
  };
  useEffect(() => {
    getProfile();
  }, [localStorage.getItem("access_token")]);
  return (
    <div className="header-container position-sticky sticky-top">
      <div className="d-flex justify-content-between align-items-center h-100">
        <span className="header-title">Virtual Center</span>
        <div className="d-flex align-items-center">
          <AuthButton />
        </div>
      </div>
    </div>
  );
};

export default Header;
