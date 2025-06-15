import React, { useEffect, useState } from "react";
import accountAPI from "../../../api/accountAPI";
import { IMAGES } from "../../../constants/images";
import "./Course.scss";
import { useNavigate } from "react-router-dom";
import CourseCard from "../../../components/course-card/CourseCard";
import StatisticCard from "../../../components/statistic/StatisticCard";
import { calculateCourseProgress } from "../../../utils/courseProgress";
import CoursePreviewModal from "../../../components/modal/CoursePreviewModal";
import CourseDetailModal from "../../../components/modal/CourseDetailModal";
import NotJoinedCourseDetailModal from "../../../components/modal/NotJoinedCourseDetailModal";
import studentAPI from "../../../api/studentAPI";
import ScheduleSelectionModal from "../../../components/modal/ScheduleSelectionModal";

const COLORS = [
  "#4caf50",
  "#ff9800",
  "#2196f3",
  "#e91e63",
  "#9c27b0",
  "#00bcd4",
  "#ff5722",
  "#607d8b",
];

const DEFAULT_ROADMAP_IMAGES = [
  IMAGES.kindergarten_image,
  IMAGES.starter_image,
  IMAGES.mover_image,
  IMAGES.adults_image,
  IMAGES.flyers_image,
];

// Modern Roadmap Card
const RoadmapCard = ({ roadmap, active, onDetail, index }) => {
  const navigate = useNavigate();

  const handleDetailClick = (e) => {
    e.stopPropagation(); // Prevent card click event
    navigate(`/student/course/${roadmap.id}`);
  };

  return (
    <div
      className={`modern-roadmap-card grid-card${active ? " active" : ""}`}
      onClick={onDetail}
    >
      <div className="modern-roadmap-img-wrap">
        <img
          src={
            roadmap.image ||
            DEFAULT_ROADMAP_IMAGES[index % DEFAULT_ROADMAP_IMAGES.length]
          }
          alt={roadmap.name}
          className="modern-roadmap-img"
        />
      </div>
      <div className="modern-roadmap-content">
        <h3 className="modern-roadmap-title">{roadmap.name}</h3>
        <p className="modern-roadmap-desc">{roadmap.description}</p>
        <button className="modern-roadmap-btn" onClick={handleDetailClick}>
          Chi tiết
        </button>
      </div>
    </div>
  );
};

// Modal hiển thị danh sách course của roadmap
const RoadmapDetailModal = ({ roadmap, onClose }) => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const handleShowScheduleModal = (course) => {
    setSelectedCourse(course);
    setShowScheduleModal(true);
  };

  const handleCloseScheduleModal = () => {
    setShowScheduleModal(false);
    setSelectedCourse(null);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content roadmap-modal-content">
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        <h2>{roadmap.name}</h2>
        <p>{roadmap.description}</p>
        <h3>Danh sách khóa học:</h3>
        <div className="modern-course-list">
          {roadmap.courses && roadmap.courses.length > 0 ? (
            roadmap.courses.map((course) => (
              <div className="modern-course-card" key={course.id}>
                <img
                  src={course.image || IMAGES.france_image}
                  alt={course.name}
                  className="modern-course-img"
                />
                <div className="modern-course-content">
                  <h4>{course.name}</h4>
                  <p className="modern-course-desc">{course.description}</p>
                  <div className="modern-course-meta">
                    <span>{course.num_classes} buổi</span>
                    <span className="modern-course-price">
                      {course.price.toLocaleString("vi-VN")} VND
                    </span>
                  </div>
                  <button
                    className="modern-course-purchase-btn"
                    onClick={() => handleShowScheduleModal(course)}
                  >
                    Mua khóa học
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>Chưa có khóa học nào trong lộ trình này.</p>
          )}
        </div>
      </div>

      {showScheduleModal && selectedCourse && (
        <div className="modal-overlay" style={{ zIndex: 1200 }}>
          <ScheduleSelectionModal
            courseId={selectedCourse.id}
            onClose={handleCloseScheduleModal}
          />
        </div>
      )}
    </div>
  );
};

function Course() {
  const [roadmaps, setRoadmaps] = useState([]);
  const [selectedRoadmap, setSelectedRoadmap] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showRoadmapDetail, setShowRoadmapDetail] = useState(false);
  const [classes, setClasses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [notJoinCourses, setNotJoinCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotJoinCourse, setSelectedNotJoinCourse] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        const response = await accountAPI.getRoadmaps();
        setRoadmaps(response.data);
        if (response.data.length > 0) {
          setSelectedRoadmap(response.data[0]);
        }
      } catch (error) {
        console.error("Error fetching roadmaps:", error);
      }
    };
    fetchRoadmaps();
  }, []);

  const handleSelectRoadmap = (roadmap) => {
    setSelectedRoadmap(roadmap);
    setShowRoadmapDetail(true);
  };

  const handleCloseRoadmapDetail = () => {
    setShowRoadmapDetail(false);
  };

  const handleShowCourseDetail = (course) => {
    setSelectedCourse(course);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCourse(null);
  };

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await studentAPI.getClasses();
      const processedCourses = calculateCourseProgress(response.data.classes);
      setCourses(processedCourses);
      setNotJoinCourses(response.data.otherCourses);
    } catch (error) {
      console.error("Error fetching classes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleNotJoinCourseClick = (course) => {
    setSelectedNotJoinCourse(course);
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

  const notJoinCourseRows = [];
  for (let i = 0; i < notJoinCourses.length; i += 2) {
    notJoinCourseRows.push(notJoinCourses.slice(i, i + 2));
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

  return (
    <div className="modern-roadmap-page grid-layout">
      <h2 className="modern-roadmap-header">Lộ trình học tập</h2>
      <div className="modern-roadmap-main-grid">
        {/* Left: Roadmap grid */}
        <div className="modern-roadmap-grid-2col">
          {roadmaps.map((roadmap, index) => (
            <RoadmapCard
              key={roadmap.id}
              roadmap={roadmap}
              active={selectedRoadmap && selectedRoadmap.id === roadmap.id}
              onDetail={() => handleSelectRoadmap(roadmap)}
              index={index}
            />
          ))}
        </div>
        {/* Right: Roadmap progress stepper */}
        <div className="modern-roadmap-path">
          {selectedRoadmap &&
          selectedRoadmap.courses &&
          selectedRoadmap.courses.length > 0 ? (
            <>
              <h3 className="modern-roadmap-path-title">Lộ trình khóa học</h3>
              <ul className="modern-roadmap-stepper">
                {selectedRoadmap.courses.map((course, idx) => (
                  <li
                    key={course.id}
                    className="modern-roadmap-stepper-step"
                    onClick={() => handleShowCourseDetail(course)}
                  >
                    <div
                      className="modern-roadmap-stepper-circle"
                      style={{ background: COLORS[idx % COLORS.length] }}
                    >
                      {idx + 1}
                    </div>
                    {idx !== selectedRoadmap.courses.length - 1 && (
                      <div className="modern-roadmap-stepper-line" />
                    )}
                    <div className="modern-roadmap-stepper-label">
                      {course.name}
                    </div>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className="modern-roadmap-path-empty">
              Chọn lộ trình để xem các khóa học!
            </div>
          )}
        </div>
      </div>
      {showModal && selectedCourse && (
        <CourseDetailModal course={selectedCourse} onClose={handleCloseModal} />
      )}
      {showRoadmapDetail && selectedRoadmap && (
        <RoadmapDetailModal
          roadmap={selectedRoadmap}
          onClose={handleCloseRoadmapDetail}
        />
      )}
    </div>
  );
}

export default Course;
