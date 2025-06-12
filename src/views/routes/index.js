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
import TeacherLayout from "../../components/layouts/TeacherLayout";
import AdminLayout from "../../components/layouts/AdminLayout";
import Overview from "../pages/student/Overview";
import Course from "../pages/student/Course";
import Schedule from "../pages/student/Schedule";
import Profile from "../pages/student/Profile";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import TeacherOverview from "../pages/teacher/Overview";
import TeacherProfile from "../pages/teacher/Profile";
import TeacherSchedule from "../pages/teacher/Schedule";
import Bill from "../pages/student/Bill";
import TeacherHistory from "../pages/teacher/History";
import AdminAccount from "../pages/admin/Accounts";
import AdminCourse from "../pages/admin/Courses";
import AdminSchedule from "../pages/admin/Schedule";
import BookingManagement from "../pages/admin/BookingManagement";
import AdminChat from "../pages/admin/Chat";
import StudentChat from "../pages/student/Chat";
import TeacherChat from "../pages/teacher/Chat";
import AdminProfile from "../pages/admin/AdminProfile";
import TheoryViewer from "../pages/TheoryViewer";
// const UserHomePage = LoadableComponent(() => import("../pages/homepage/index"));

const AppRoutes = () => {
  const { account } = useAuth();

  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto:300,400,500,700,900"],
      },
    });
  }, []);

  return (
    <Routes>
      {/* // public route  */}
      <Route element={<PublicRoute />}>
        <Route path="/home" element={<MainLayout component={Homepage} />} />
        <Route path="/login" element={<MainLayout component={Login} />} />
        <Route path="/register" element={<MainLayout component={Register} />} />
        <Route path="/theory/:theoryId/view" element={<TheoryViewer />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["Student"]} />}>
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
          path="/student/bill"
          element={<StudentLayout component={Bill} />}
        />
        <Route
          path="/student/setting"
          element={<StudentLayout component={Profile} />}
        />
        <Route
          path="/student/chat"
          element={<StudentLayout component={StudentChat} />}
        />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["Teacher"]} />}>
        <Route
          path="/teacher/overview"
          element={<TeacherLayout component={TeacherOverview} />}
        />
        <Route
          path="/teacher/history-booking"
          element={<TeacherLayout component={TeacherHistory} />}
        />
        <Route
          path="/teacher/schedule"
          element={<TeacherLayout component={TeacherSchedule} />}
        />
        <Route
          path="/teacher/setting"
          element={<TeacherLayout component={TeacherProfile} />}
        />
        <Route
          path="/teacher/chat"
          element={<TeacherLayout component={TeacherChat} />}
        />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
        <Route
          path="/admin/accounts"
          element={<AdminLayout component={AdminAccount} />}
        />
        <Route
          path="/admin/courses"
          element={<AdminLayout component={AdminCourse} />}
        />
        <Route
          path="/admin/schedules"
          element={<AdminLayout component={AdminSchedule} />}
        />
        <Route
          path="/admin/bookings"
          element={<AdminLayout component={BookingManagement} />}
        />
        <Route
          path="/admin/chat"
          element={<AdminLayout component={AdminChat} />}
        />
        <Route
          path="/admin/setting"
          element={<AdminLayout component={AdminProfile} />}
        />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
