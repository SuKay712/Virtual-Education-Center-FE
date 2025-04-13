import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route, Navigate } from "react-router-dom";
import PublicRoute from "./public-route";
import React, { useEffect } from "react";
import WebFont from "webfontloader";
import MainLayout from "../../components/layouts/MainLayout";
import LoadableComponent from "../../components/loadable-components/loadable-component";
import { useAuth } from "../../contexts/AccountContext";
import ProtectedRoute from "./protected-route";

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
                : "/homepage"
            }
          />
        }
      />
      {/* // public route  */}
      <Route element={<PublicRoute />}>
        <Route path="/homepage" element={<MainLayout />} />
      </Route>
      {/* // admin, staff route  */}
      {/* <Route element={<ProtectedRoute allowedRoles={["admin", "staff"]} />}>
        <Route
          path="/admin/dashboard"
          element={<AdminLayout component={<AdminDashboard />} />}
        />
        <Route
          path="/admin/products/details/:id"
          element={<AdminLayout component={<AdminItemDetail />} />}
        />
      </Route> */}
    </Routes>
  );
};

export default AllRoutes;
