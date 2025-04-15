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
          path="/student"
          element={<StudentLayout component={Overview} />}
        />
      </Route>
    </Routes>
  );
};

export default AllRoutes;
