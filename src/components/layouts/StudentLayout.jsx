import { IMAGES } from "../../constants/images";
import StudentSideBar from "../sidebar/StudentSideBar";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./StudentLayout.scss";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AccountContext";
import { AvatarImage } from "../../utils/avatarUtils";

function StudentLayout(props) {
  const userInfo = JSON.parse(localStorage.getItem("user_info")) || {};
  const navigate = useNavigate();
  const { account, setAccount } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user_info");
    localStorage.removeItem("access_token");
    toast.success("Logout successfully", {
      autoClose: 1000,
      onClose: () => {
        navigate("/login");
        setAccount(null);
      },
    });
  };

  const currentPage = props.component.name; // Lấy tên của component hiện tại

  return (
    <div className="student-frame-wrapper">
      <StudentSideBar currentPage={currentPage} />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        newestOnTop={false}
        hideProgressBar={false}
        rtl={false}
        closeOnClick
        draggable
        pauseOnFocusLoss
        theme="light"
        pauseOnHover
      />
      <div className="frame-body">
        <div className="d-flex justify-content-between align-items-center">
          <div className="frame-header">
            <h4>Hello {userInfo.name}, welcome back!</h4>
          </div>
          <div className="frame-header d-flex justify-content-between align-items-center">
            <i className="fa fa-bell notification-icon"></i>
            <div
              className="user-info d-flex align-items-center gap-3 position-relative"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <div className="user-avatar">
                <AvatarImage avatar={userInfo.avatar} />
              </div>
              <span className="user-name">{userInfo.name}</span>
              <i
                className={`fa fa-chevron-down dropdown-icon ${
                  isDropdownOpen ? "open" : ""
                }`}
              ></i>
              {isDropdownOpen && (
                <div className="dropdown-menu">
                  <button className="btn btn-logout" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <props.component />
      </div>
    </div>
  );
}

export default StudentLayout;
