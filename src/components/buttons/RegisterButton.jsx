import React from "react";
import { useNavigate } from "react-router-dom";
import "./index.scss";
import { FaArrowRight } from "react-icons/fa";

const RegisterButton = () => {
  const navigate = useNavigate();

  return (
    <button onClick={() => navigate("/auth/register")} className="register-btn">
      Đăng ký ngay{" "}
      <FaArrowRight style={{ marginLeft: "12px", fontSize: "16px" }} />
    </button>
  );
};

export default RegisterButton;
