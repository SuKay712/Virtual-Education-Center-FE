import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Container, Row, Col } from "react-bootstrap";
import { IMAGES } from "../../../constants/images";
import studentAPI from "../../../api/studentAPI";
import { calculateCourseProgress } from "../../../utils/courseProgress";
import { formatDate } from "../../../utils/dateFormat";
import "./Overview.scss";
import CourseCard from "../../../components/course-card/CourseCard";
import PlanCard from "../../../components/plan-card/PlanCard";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";
import StatisticCard from "../../../components/statistic/StatisticCard";
import ClassModal from "../../../components/modal/ClassModal";
import { parse } from "date-fns";

const Overview = () => {
  const navigate = useNavigate();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [classes, setClasses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showClassModal, setShowClassModal] = useState(false);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await studentAPI.getClasses();
      setClasses(response.data.classes);
      const processedCourses = calculateCourseProgress(response.data.classes);
      setCourses(processedCourses);
    } catch (error) {
      console.error("Error fetching classes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
  };

  const handleViewDetails = () => {
    setShowDetailsModal(true);
  };

  const handleCloseModal = () => {
    setSelectedCourse(null);
    setShowDetailsModal(false);
  };

  const handleCloseModalDetail = () => {
    setShowDetailsModal(false);
  };

  const handlePlanClick = (plan) => {
    setSelectedPlan(plan);
    setShowClassModal(true);
  };

  const handleCloseClassModal = () => {
    setSelectedPlan(null);
    setShowClassModal(false);
  };

  // Separate courses by progress
  const separateCoursesByProgress = (courses) => {
    return {
      finished: courses.filter((c) => c.progress === 100),
      unfinished: courses.filter((c) => c.progress < 100),
    };
  };

  const { finished, unfinished } = separateCoursesByProgress(courses);

  // Get top 4 unfinished courses sorted by progress
  const filteredCourses = unfinished
    .sort((a, b) => b.progress - a.progress)
    .slice(0, 4);

  // Create rows of 2 courses each
  const courseRows = [];
  for (let i = 0; i < filteredCourses.length; i += 2) {
    courseRows.push(filteredCourses.slice(i, i + 2));
  }

  // Calculate statistics
  const totalCompletedClasses = finished.reduce(
    (sum, course) => sum + course.completedClasses.length,
    0
  );

  const totalUpcomingClasses = unfinished.reduce(
    (sum, course) => sum + course.upcomingClasses.length,
    0
  );

  const isSameDate = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  // Lọc plans theo ngày được chọn
  const filteredPlans = classes.filter((plan) => {
    const planDate = parse(plan.time_start, "HH:mm dd/MM/yyyy", new Date());
    return isSameDate(planDate, selectedDate);
  });

  // Chia plans thành các nhóm 2 để render 2 card mỗi hàng
  const planRows = [];
  for (let i = 0; i < filteredPlans.length; i += 2) {
    planRows.push(filteredPlans.slice(i, i + 2));
  }

  return (
    <div className="overview gap-5">
      <div className="overview-container">
        <div className="overview-header d-flex gap-3 align-items-center">
          <h2>My course</h2>
          <a href="" onClick={() => navigate("/student/course")}>
            View all
          </a>
        </div>
        {loading ? (
          <p>Loading courses...</p>
        ) : courseRows.length > 0 ? (
          courseRows.map((row, index) => (
            <div key={index} className="d-flex gap-5 mb-4">
              {row.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onClick={() => handleCourseClick(course)}
                />
              ))}
              {row.length === 1 && <div className="flex-fill ms-4"></div>}
            </div>
          ))
        ) : (
          <p>No courses found.</p>
        )}

        <div className="overview-header d-flex gap-3 align-items-center mt-4">
          <h2>My Plan</h2>
          <a href="">View all</a>
          <div className="react-datepicker-wrapper-wrap">
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
            />
            <FaCalendarAlt />
          </div>
        </div>
        {planRows.length > 0 ? (
          planRows.map((row, index) => (
            <div key={index} className="d-flex gap-5 mb-4">
              {row.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  onClick={() => handlePlanClick(plan)}
                />
              ))}
              {row.length === 1 && <div className="flex-fill ms-4"></div>}
            </div>
          ))
        ) : (
          <p>No plans found for the selected date.</p>
        )}
      </div>

      {/* Course Details Modal */}
      {selectedCourse && (
        <div className="card-modal">
          <div className={`card-modal-content color-4caf50`}>
            <div className="position-relative d-flex justify-content-between">
              <h3 className="card-modal-header">{selectedCourse.name}</h3>
              <button className="card-close-btn" onClick={handleCloseModal}>
                <i className="fa fa-times"></i>
              </button>
            </div>
            <div className="d-flex justify-content-between">
              <div>
                <p className="card-num-classes">
                  {selectedCourse.num_classes} classes
                </p>
                <p className="card-description">{selectedCourse.description}</p>
              </div>
              <div className="d-flex flex-column align-items-center">
                <p className="card-price">${selectedCourse.price}</p>
                <img src={IMAGES.france_image} alt={selectedCourse.name} />
              </div>
            </div>
            <div className="d-flex justify-content-center">
              <button
                className="card-view-detail-btn"
                onClick={handleViewDetails}
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Class Details Modal */}
      {showDetailsModal && (
        <div className="card-modal">
          <div className={`card-modal-content classes color-4caf50`}>
            <div className="position-relative d-flex justify-content-between">
              <h3 className="mb-4">Classes for {selectedCourse.name}</h3>
              <button
                className="card-close-btn"
                onClick={handleCloseModalDetail}
              >
                <i className="fa fa-times"></i>
              </button>
            </div>
            <ul className="lecture-list">
              {selectedCourse.classes.map((classData) => {
                const isCompleted =
                  new Date(classData.time_start).getTime() <
                  new Date().getTime();
                return (
                  <li key={classData.id} className="lecture-item d-flex">
                    <div className="lecture-info d-flex aligns-item-center">
                      <img
                        src={IMAGES.france_image}
                        alt={classData.lecture.name}
                        className="lecture-image"
                      />
                      <div className="d-flex align-items-center justify-content-between flex-grow-1 me-2">
                        <h4 className="lecture-name mb-0">
                          {classData.lecture.name}
                        </h4>
                        {isCompleted && (
                          <i className="fa fa-check-circle text-success ms-2 fa-lg"></i>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}

      {/* Class Modal */}
      {showClassModal && selectedPlan && (
        <ClassModal
          info={selectedPlan}
          handleCloseModal={handleCloseClassModal}
        />
      )}

      <div className="overview-container right">
        <div className="overview-header d-flex gap-3 align-items-center">
          <h2>Statistic</h2>
        </div>
        <div className="d-flex gap-5 mb-4">
          <StatisticCard
            title={"Courses Completed"}
            quantity={finished.length}
          />
          <StatisticCard
            title={"Total Classes Completed"}
            quantity={totalCompletedClasses}
          />
        </div>
        <div className="d-flex gap-5">
          <StatisticCard
            title={"Courses In Progress"}
            quantity={unfinished.length}
          />
          <StatisticCard
            title={"Upcoming Classes"}
            quantity={totalUpcomingClasses}
          />
        </div>
      </div>
    </div>
  );
};

export default Overview;
