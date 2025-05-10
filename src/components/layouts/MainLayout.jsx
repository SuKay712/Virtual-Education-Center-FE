import Footer from "../footers";
import Header from "../headers";
import React from "react";
import "./MainLayout.scss";
import { ToastContainer } from "react-toastify";

function MainLayout(props) {
  const userInfo = JSON.parse(localStorage.getItem("user_info")) || {};
  return (
    <div className="frame-wrapper">
      <Header userInfo={userInfo} />
      <div className="frame-body">
        <props.component />
      </div>
      <Footer />
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
    </div>
  );
}

export default MainLayout;
