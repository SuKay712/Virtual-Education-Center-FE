import React from "react";
import { IoMdPerson } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AccountContext";
import "./index.scss";

const AuthButton = () => {
  const navigate = useNavigate();
  const { account, setAccount } = useAuth();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_info");
    setAccount(null);
    navigate("/");
  };

  const handleProfileClick = () => {
    if (!account) return;

    switch (account.role) {
      case "Student":
        navigate("/student/overview");
        break;
      case "Teacher":
        navigate("/teacher/overview");
        break;
      case "Admin":
        navigate("/admin/accounts");
        break;
      default:
        navigate("/");
    }
  };

  if (account) {
    return (
      <div className="auth-btn d-flex align-items-center">
        <div
          className="d-flex align-items-center"
          style={{ cursor: "pointer" }}
          onClick={handleProfileClick}
        >
          <IoMdPerson size={20} />
          {account.name}
          <div
            className="mx-2"
            style={{ borderLeft: "1px solid #ccc", height: "24px" }}
          ></div>
        </div>
        <button className="btn" onClick={handleLogout}>
          Đăng xuất
        </button>
      </div>
    );
  }

  return (
    <button
      className="auth-btn d-flex align-items-center"
      onClick={() => navigate("/login")}
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
