import { IMAGES } from "../../constants/images";
import TeacherSideBar from "../sidebar/TeacherSideBar";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./TeacherLayout.scss";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

function TeacherLayout(props) {
  const userInfo = JSON.parse(localStorage.getItem("user_info")) || {};
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user_info");
    localStorage.removeItem("access_token");
    toast.success("Logout successfully", {
      autoClose: 1000,
      onClose: () => {
        navigate("/login");
      },
    });
  };

  const currentPage = props.component.name;

  return (
    <div className="teacher-frame-wrapper">
      <TeacherSideBar currentPage={currentPage} />
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
      <div className="teacher-frame-body">
        <div className="d-flex justify-content-between align-items-center">
          <div className="teacher-frame-header">
            <h4>Hello {userInfo.name}, welcome back!</h4>
          </div>
          <div className="teacher-frame-header d-flex justify-content-between align-items-center">
            <i className="fa fa-bell notification-icon"></i>
            <div
              className="teacher-user-info d-flex align-items-center gap-3 position-relative"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <div className="user-avatar">
                <img src={userInfo.avatar} alt="User Avatar" />
              </div>
              <span className="user-name">{userInfo.name}</span>
              <i
                className={`fa fa-chevron-down teacher-dropdown-icon ${
                  isDropdownOpen ? "open" : ""
                }`}
              ></i>
              {isDropdownOpen && (
                <div className="teacher-dropdown-menu">
                  <button className="teacher-btn-logout" onClick={handleLogout}>
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

export default TeacherLayout;
