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
          new Date(
            b.classEntity.time_start.replace(
              /(\d{2}):(\d{2}) (\d{2})\/(\d{2})\/(\d{4})/,
              "$5-$4-$3T$1:$2:00"
            )
          ) > now
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
          const classDate = new Date(
            b.classEntity.time_start.replace(
              /(\d{2}):(\d{2}) (\d{2})\/(\d{2})\/(\d{4})/,
              "$5-$4-$3T$1:$2:00"
            )
          );
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
          <h2>Overview</h2>
        </div>
        <div className="upcoming-classes">
          <div className="upcoming-classes-header">
            <h3>Upcoming classes</h3>
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
                <h4>No upcoming class</h4>
                <p>
                  Let's accept some class on the booking panel to get started!
                </p>
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
                        <div className="label">Name</div>
                        <div className="label">Age</div>
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
                      <button className="join-class-btn">Join class</button>
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
            <h3>Income for the past 14 days</h3>
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
            <h4>Estimated income this month</h4>
            <div style={{ fontSize: 24, fontWeight: 700, color: "#ff5a36" }}>
              0₫
            </div>
            <div style={{ fontSize: 13, color: "#4caf50", marginTop: 4 }}>
              ↑ 0% (0₫) for last month
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
                20
              </div>
              <div style={{ fontSize: 15, color: "#222" }}>
                Classes need evaluations
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
                0
              </div>
              <div style={{ fontSize: 15, color: "#222" }}>
                Completed classes
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
