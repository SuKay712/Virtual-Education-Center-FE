import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route, Navigate } from "react-router-dom";
import PublicRoute from "./public-route";
import React, { useEffect } from "react";
import WebFont from "webfontloader";
import MainLayout from "../../components/layouts/MainLayout";
import LoadableComponent from "../../components/loadable-components/loadable-component";
import { useAuth } from "../../contexts/AccountContext";
import ProtectedRoute from "./protected-route";
import Homepage from "../pages/homepage";
import StudentLayout from "../../components/layouts/StudentLayout";
import Overview from "../pages/student/Overview";
import Course from "../pages/student/Course";
import Schedule from "../pages/student/Schedule";
import Profile from "../pages/student/Profile";
// const UserHomePage = LoadableComponent(() => import("../pages/homepage/index"));

const AllRoutes = () => {
  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Nunito Sans", "Public Sans"], // Danh sách font bạn muốn sử dụng
      },
    });
  }, []);

  const { account } = useAuth();

  // console.log(account)
  // console.log((account && (account.role === "admin" || account.role === "staff")) ? "/admin/dashboard" : "/homepage")

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Navigate
            to={
              account && (account.role === "admin" || account.role === "staff")
                ? "/admin/dashboard"
                : "/home"
            }
          />
        }
      />
      {/* // public route  */}
      <Route element={<PublicRoute />}>
        <Route path="/home" element={<MainLayout component={Homepage} />} />
      </Route>
      {/* // admin, staff route  */}
      <Route element={<ProtectedRoute allowedRoles={["admin", "staff"]} />}>
        <Route
          path="/student/overview"
          element={<StudentLayout component={Overview} />}
        />
        <Route
          path="/student/course"
          element={<StudentLayout component={Course} />}
        />
        <Route
          path="/student/schedule"
          element={<StudentLayout component={Schedule} />}
        />
        <Route
          path="/student/setting"
          element={<StudentLayout component={Profile} />}
        />
      </Route>
    </Routes>
  );
};

export default AllRoutes;
