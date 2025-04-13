import React from "react";
import { IoCartOutline, IoLocationSharp } from "react-icons/io5";
import { IoMdHeartEmpty } from "react-icons/io";
import { RiStackLine } from "react-icons/ri";
import { MdOutlineHistory } from "react-icons/md";
import { IoSettingsOutline, IoLogOutOutline } from "react-icons/io5";
import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Dropdown from "react-bootstrap/Dropdown";
import { IoMdPerson } from "react-icons/io";
import "./index.scss";
import { useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "../../contexts/AccountContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ICONS } from "../../constants/icons";

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
  return <div className="container-header position-sticky sticky-top"></div>;
};

export default Header;
