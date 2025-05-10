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

const Overview = () => {
  const navigate = useNavigate();

  return (
    <div className="teacher-overview gap-5">
      <div className="teacher-overview-container">
        <div className="teacher-overview-header d-flex gap-3 align-items-center">
          <h2>My Classes</h2>
          <a href="" onClick={() => navigate("/teacher/classes")}>
            View all
          </a>
        </div>
      </div>
    </div>
  );
};

export default Overview;
