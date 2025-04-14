import React from "react";
import { IoMdPerson } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import "./index.scss";

const AuthButton = () => {
  const navigate = useNavigate();

  return (
    <button
      className="auth-btn d-flex align-items-center"
      onClick={() => navigate("/auth/login")}
    >
      <div className="d-flex align-items-center">
        <IoMdPerson size={20} />
        <div
          className="mx-2"
          style={{ borderLeft: "1px solid #ccc", height: "24px" }}
        ></div>
      </div>
      Đăng nhập / Đăng kí
    </button>
  );
};

export default AuthButton;
