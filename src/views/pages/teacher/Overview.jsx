import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Container, Row, Col } from "react-bootstrap";
import { IMAGES } from "../../../constants/images";
import teacherAPI from "../../../api/teacherAPI";
import "./Overview.scss";
import CourseCard from "../../../components/course-card/CourseCard";
import PlanCard from "../../../components/plan-card/PlanCard";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";
import StatisticCard from "../../../components/statistic/StatisticCard";
import ClassModal from "../../../components/modal/ClassModal";
import { IoMdTime } from "react-icons/io";
import { MdDateRange } from "react-icons/md";
import dayjs from "dayjs";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { parse } from "date-fns";

const Overview = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [frequencyData, setFrequencyData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const classesPerPage = 4;

  useEffect(() => {
    const fetchBookings = async () => {
      const res = await teacherAPI.getBookings();
      setBookings(res.data);

      // Filter upcoming classes
      const now = new Date();
      const upcoming = res.data.filter(
        (b) =>
          b.status === 1 &&
          dayjs(b.classEntity.time_start, "HH:mm DD/MM/YYYY").isAfter(now)
      );
      setUpcomingClasses(upcoming);

      // Frequency data for last 14 days
      const freq = [];
      for (let i = 13; i >= 0; i--) {
        const day = new Date();
        day.setDate(day.getDate() - i);
        const dayStr = day.toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
        });
        const count = res.data.filter((b) => {
          if (b.status !== 1) return false;
          const classDate = dayjs(
            b.classEntity.time_start,
            "HH:mm DD/MM/YYYY"
          ).toDate();
          return (
            classDate.getDate() === day.getDate() &&
            classDate.getMonth() === day.getMonth() &&
            classDate.getFullYear() === day.getFullYear()
          );
        }).length;
        freq.push({ date: dayStr, count });
      }
      setFrequencyData(freq);
    };
    fetchBookings();
  }, []);

  // Calculate income based on completed bookings (status = 2)
  const calculateIncome = () => {
    const now = dayjs();
    const startOfMonth = now.startOf("month");
    const endOfMonth = now.endOf("month");

    // Calculate current month's completed income
    const currentMonthCompletedBookings = bookings.filter((booking) => {
      const bookingDate = dayjs(
        booking.classEntity.time_end,
        "HH:mm DD/MM/YYYY"
      );
      return (
        booking.status === 2 &&
        bookingDate.isAfter(startOfMonth) &&
        bookingDate.isBefore(endOfMonth)
      );
    });
    const currentMonthCompletedIncome =
      currentMonthCompletedBookings.length * 50000;

    // Calculate current month's upcoming income (status = 1)
    const currentMonthUpcomingBookings = bookings.filter((booking) => {
      const bookingDate = dayjs(
        booking.classEntity.time_start,
        "HH:mm DD/MM/YYYY"
      );
      return (
        booking.status === 1 &&
        bookingDate.isAfter(startOfMonth) &&
        bookingDate.isBefore(endOfMonth)
      );
    });
    const currentMonthUpcomingIncome =
      currentMonthUpcomingBookings.length * 50000;

    // Total estimated income for current month
    const currentMonthTotalIncome =
      currentMonthCompletedIncome + currentMonthUpcomingIncome;

    // Calculate last month's income for comparison
    const lastMonthStart = startOfMonth.subtract(1, "month");
    const lastMonthEnd = endOfMonth.subtract(1, "month");
    const lastMonthBookings = bookings.filter((booking) => {
      const bookingDate = dayjs(
        booking.classEntity.time_end,
        "HH:mm DD/MM/YYYY"
      );
      return (
        booking.status === 2 &&
        bookingDate.isAfter(lastMonthStart) &&
        bookingDate.isBefore(lastMonthEnd)
      );
    });
    const lastMonthIncome = lastMonthBookings.length * 50000;

    // Calculate percentage change
    let percentageChange = 0;
    if (lastMonthIncome === 0) {
      percentageChange = currentMonthTotalIncome > 0 ? 100 : 0;
    } else {
      percentageChange =
        ((currentMonthTotalIncome - lastMonthIncome) / lastMonthIncome) * 100;
    }

    return {
      current: currentMonthTotalIncome,
      completed: currentMonthCompletedIncome,
      upcoming: currentMonthUpcomingIncome,
      lastMonth: lastMonthIncome,
      percentageChange: Math.round(percentageChange),
    };
  };

  // Calculate classes needing evaluation
  const calculateClassesNeedingEvaluation = () => {
    const now = new Date();
    return bookings.filter((booking) => {
      const timeEnd = dayjs(
        booking.classEntity.time_end,
        "HH:mm DD/MM/YYYY"
      ).toDate();
      return (
        timeEnd < now && // Class has ended
        !booking.classEntity.rating && // No rating yet
        booking.status === 2 // Booking is completed
      );
    }).length;
  };

  // Calculate completed classes
  const calculateCompletedClasses = () => {
    return bookings.filter((booking) => booking.status === 2).length;
  };

  const totalPages = Math.ceil(upcomingClasses.length / classesPerPage);

  const pagedClasses = upcomingClasses.slice(
    currentPage * classesPerPage,
    currentPage * classesPerPage + classesPerPage
  );

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 0));
  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));

  return (
    <div className="teacher-overview gap-5">
      <div className="teacher-overview-container">
        <div className="teacher-overview-header d-flex gap-3 align-items-center">
          <h2>Tổng quan</h2>
        </div>
        <div className="upcoming-classes">
          <div className="upcoming-classes-header">
            <h3>Lớp học sắp tới</h3>
            <div className="upcoming-classes-nav">
              <button onClick={handlePrev} disabled={currentPage === 0}>
                &laquo;
              </button>
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages - 1}
              >
                &raquo;
              </button>
            </div>
          </div>
          <div className="upcoming-classes-list">
            {pagedClasses.length === 0 ? (
              <div className="no-upcoming-class-card">
                <h4>Không có lớp học sắp tới</h4>
                <p>Hãy chấp nhận một số lớp học từ bảng đặt lịch để bắt đầu!</p>
              </div>
            ) : (
              pagedClasses.map((b) => {
                const student = b.classEntity.student;
                const genderIcon = student.gender === "female" ? "♀️" : "♂️";
                const age =
                  new Date().getFullYear() -
                  new Date(student.birthday).getFullYear();
                return (
                  <div className="upcoming-class-card" key={b.id}>
                    <h4>{b.classEntity.lecture.course.name}</h4>
                    <div className="class-info-row">
                      <div className="class-icon-col">
                        <span className="class-icon">📖</span>
                      </div>
                      <div className="class-info-col">
                        <div>
                          <span className="value">
                            {b.classEntity.lecture.name}
                          </span>
                        </div>
                        <div className="d-flex gap-2 align-items-center">
                          <IoMdTime className="label-icon" />
                          <span className="value">
                            {b.classEntity.time_start.split(" ")[0]} -{" "}
                            {b.classEntity.time_end.split(" ")[0]}
                          </span>
                        </div>
                        <div className="d-flex gap-2 align-items-center">
                          <MdDateRange className="label-icon" />
                          <span className="value">
                            {b.classEntity.time_start.split(" ")[1]}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="class-info-row d-flex align-items-center">
                      <div className="class-icon-col">
                        <div className="label">Tên</div>
                        <div className="label">Tuổi</div>
                      </div>
                      <div className="class-info-col">
                        <span className="value" style={{ fontSize: "14px" }}>
                          {student.name} {genderIcon}
                        </span>
                        <span className="value" style={{ fontSize: "14px" }}>
                          {age}
                        </span>
                      </div>
                    </div>
                    <div className="d-flex justify-content-center">
                      <button className="join-class-btn">
                        Tham gia lớp học
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
        {/* Dashboard section */}
        <div className="dashboard-row">
          <div className="dashboard-chart">
            <h3>Thu nhập 14 ngày gần đây</h3>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart
                data={frequencyData}
                margin={{ top: 16, right: 16, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#4fc3f7" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="dashboard-income">
            <div className="income-header">
              <h4>Thu nhập ước tính tháng này</h4>
              <div className="income-period">Tháng hiện tại</div>
            </div>
            <div className="income-main">
              <div className="income-amount">
                {calculateIncome().current.toLocaleString()}₫
              </div>
              <div className="income-comparison">
                {calculateIncome().lastMonth === 0 ? (
                  <div className="first-month">
                    <span className="dot"></span>
                    Tháng đầu tiên có thu nhập
                  </div>
                ) : (
                  <div
                    className={`trend ${calculateIncome().percentageChange >= 0 ? "up" : "down"}`}
                  >
                    <span className="trend-icon">
                      {calculateIncome().percentageChange >= 0 ? "↑" : "↓"}
                    </span>
                    <span className="trend-value">
                      {Math.abs(calculateIncome().percentageChange)}%
                    </span>
                    <span className="trend-amount">
                      (
                      {Math.abs(
                        calculateIncome().current - calculateIncome().lastMonth
                      ).toLocaleString()}
                      ₫)
                    </span>
                    <span className="trend-label">so với tháng trước</span>
                  </div>
                )}
              </div>
            </div>
            <div className="income-details">
              <div className="detail-item completed">
                <div className="detail-label">Đã hoàn thành</div>
                <div className="detail-value">
                  {calculateIncome().completed.toLocaleString()}₫
                </div>
              </div>
              <div className="detail-item upcoming">
                <div className="detail-label">Sắp tới</div>
                <div className="detail-value">
                  {calculateIncome().upcoming.toLocaleString()}₫
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="dashboard-row">
          <div className="dashboard-statistic">
            <img
              src={IMAGES.evaluationImage}
              alt="evaluation"
              style={{ width: 40, height: 40, marginRight: 12 }}
            />
            <div>
              <div style={{ fontSize: 28, color: "#ff5a36", fontWeight: 600 }}>
                {calculateClassesNeedingEvaluation()}
              </div>
              <div style={{ fontSize: 15, color: "#222" }}>
                Lớp học cần đánh giá
              </div>
            </div>
          </div>
          <div className="dashboard-statistic">
            <img
              src={IMAGES.completedClassImage}
              alt="completed"
              style={{ width: 40, height: 40, marginRight: 12 }}
            />
            <div>
              <div style={{ fontSize: 28, color: "#4caf50", fontWeight: 600 }}>
                {calculateCompletedClasses()}
              </div>
              <div style={{ fontSize: 15, color: "#222" }}>
                Lớp học đã hoàn thành
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
