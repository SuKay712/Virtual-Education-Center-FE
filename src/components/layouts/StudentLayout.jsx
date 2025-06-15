import { IMAGES } from "../../constants/images";
import StudentSideBar from "../sidebar/StudentSideBar";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./StudentLayout.scss";
import { useState, useEffect, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AccountContext";
import { AvatarImage } from "../../utils/avatarUtils";
import accountAPI from "../../api/accountAPI";
import dayjs from "dayjs";
import { notificationSocketService } from "../../services/notificationSocketService";

function StudentLayout(props) {
  const userInfo = JSON.parse(localStorage.getItem("user_info")) || {};
  const navigate = useNavigate();
  const { account, setAccount } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const notificationRef = useRef();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (showNotifications) {
      accountAPI.getNotifications().then((res) => {
        setNotifications(res.data);
      });
    }
  }, [showNotifications]);

  useEffect(() => {
    // Lắng nghe notification mới
    const handleNewNotification = (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    };
    notificationSocketService.addHandler(handleNewNotification);
    return () => {
      notificationSocketService.removeHandler(handleNewNotification);
    };
  }, []);

  useEffect(() => {
    if (showNotifications) setUnreadCount(0);
  }, [showNotifications]);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    }
    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotifications]);

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
            <div
              style={{ position: "relative", marginRight: "40px" }}
              ref={notificationRef}
            >
              <i
                className="fa fa-bell notification-icon"
                style={{
                  cursor: "pointer",
                  fontSize: "26px",
                  color: showNotifications ? "#f7ab53" : "#666",
                  transition: "color 0.3s ease",
                  filter: showNotifications
                    ? "drop-shadow(0 2px 6px #f7ab53aa)"
                    : "none",
                }}
                onClick={() => setShowNotifications((prev) => !prev)}
              ></i>
              {unreadCount > 0 && !showNotifications && (
                <span
                  style={{
                    position: "absolute",
                    top: -6,
                    right: -6,
                    background: "#f44336",
                    color: "#fff",
                    borderRadius: "50%",
                    minWidth: 20,
                    height: 20,
                    fontSize: 13,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                    zIndex: 2,
                    padding: "0 5px",
                  }}
                >
                  {unreadCount}
                </span>
              )}
              {showNotifications && (
                <div
                  style={{
                    position: "absolute",
                    top: 40,
                    right: 0,
                    background: "#fff",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
                    borderRadius: 18,
                    minWidth: 380,
                    zIndex: 1000,
                    maxHeight: 520,
                    overflowY: "auto",
                    border: "1.5px solid #f7ab53",
                  }}
                >
                  <div
                    style={{
                      padding: "18px 20px 12px 20px",
                      borderBottom: "1px solid #eee",
                      fontWeight: 700,
                      fontSize: "17px",
                      color: "#333",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      letterSpacing: 0.2,
                    }}
                  >
                    <span>Thông báo</span>
                    <span
                      style={{
                        fontSize: "14px",
                        color: "#666",
                        fontWeight: 400,
                      }}
                    >
                      {notifications.length} thông báo
                    </span>
                  </div>
                  {notifications.length === 0 ? (
                    <div
                      style={{
                        padding: "32px 20px",
                        color: "#888",
                        textAlign: "center",
                        fontSize: "15px",
                      }}
                    >
                      Không có thông báo nào
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 12,
                          padding: "18px 20px 14px 12px",
                          borderBottom: "1px solid #f0f0f0",
                          background: "#fff",
                          borderRadius: "10px 0 0 10px",
                          margin: "8px 0",
                          boxShadow: "0 1px 4px rgba(247,171,83,0.04)",
                          transition: "background 0.2s, box-shadow 0.2s",
                          cursor: "pointer",
                        }}
                        onMouseOver={(e) =>
                          (e.currentTarget.style.background = "#fff7ec")
                        }
                        onMouseOut={(e) =>
                          (e.currentTarget.style.background = "#fff")
                        }
                        onClick={() => navigate("/teacher/schedule")}
                      >
                        <i
                          className="fa fa-bell"
                          style={{
                            color: "#f7ab53",
                            fontSize: 18,
                            marginTop: 2,
                            flexShrink: 0,
                          }}
                        ></i>
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              marginBottom: "10px",
                              fontSize: "15.2px",
                              color: "#222",
                              fontWeight: 500,
                              lineHeight: "1.6",
                            }}
                          >
                            {n.content}
                          </div>
                          <div
                            style={{
                              fontSize: "13px",
                              color: "#b08d57",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "flex-end",
                              gap: 4,
                            }}
                          >
                            <i
                              className="fa fa-clock-o"
                              style={{ fontSize: 13, marginRight: 3 }}
                            ></i>
                            {(() => {
                              const dateObj = dayjs(
                                n.created_at,
                                "HH:mm DD/MM/YYYY",
                                true
                              );
                              const validDate = dateObj.isValid()
                                ? dateObj
                                : dayjs(n.created_at);
                              return validDate.format("DD/MM/YYYY, HH:mm");
                            })()}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
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
