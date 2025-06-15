import { IMAGES } from "../../constants/images";
import "./CourseDetailModal.scss";
import { useState } from "react";
import ScheduleSelectionModal from "./ScheduleSelectionModal";

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

const CourseDetailModal = ({ course, onClose, onPurchase }) => {
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const isFree = !course.price || Number(course.price) === 0;

  const handleShowScheduleModal = () => {
    setShowScheduleModal(true);
  };

  const handleCloseScheduleModal = () => {
    setShowScheduleModal(false);
  };

  return (
    <>
      <div className="card-modal modern-modal">
        <div className="card-modal-content modern-modal-content">
          <button
            className="card-close-btn modern-close-btn round"
            onClick={onClose}
          >
            <i className="fa fa-times"></i>
          </button>
          <div className="modern-modal-header big">
            <div className="modern-modal-course-img-wrap">
              <img
                src={course.image || IMAGES.france_image}
                alt={course.name}
                className="modern-modal-course-img big"
              />
            </div>
            <div className="modern-modal-course-info">
              <h2 className="modern-modal-course-title big">{course.name}</h2>
              <div className="modern-modal-course-meta big">
                <span className="modern-modal-course-classes big">
                  {course.num_classes} buổi
                </span>
                {isFree ? (
                  <span className="modern-modal-badge-free big">Miễn phí</span>
                ) : (
                  <span className="modern-modal-course-price big">
                    {Number(course.price).toLocaleString("vi-VN")} ₫
                  </span>
                )}
              </div>
              <p className="modern-modal-course-desc big">
                {course.description}
              </p>
            </div>
          </div>
          <h3 className="modern-modal-lecture-title">Danh sách bài học</h3>
          <ul className="modern-modal-lecture-list modern-lecture-list-cards">
            {course.lectures.map((lecture, idx) => (
              <li
                key={lecture.id}
                className="modern-modal-lecture-item card-style"
                style={{ "--color": COLORS[idx % COLORS.length] }}
              >
                <div
                  className="modern-modal-lecture-num"
                  style={{ background: COLORS[idx % COLORS.length] }}
                >
                  {idx + 1}
                </div>
                <div className="modern-modal-lecture-info">
                  <div className="modern-modal-lecture-name bold">
                    {lecture.name}
                  </div>
                  {lecture.description && (
                    <div className="modern-modal-lecture-desc">
                      {lecture.description}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
          <div className="modern-modal-actions">
            <button
              className="modern-course-purchase-btn"
              onClick={handleShowScheduleModal}
            >
              MUA KHÓA HỌC
            </button>
          </div>
        </div>
      </div>

      {showScheduleModal && (
        <ScheduleSelectionModal
          courseId={course.id}
          onClose={handleCloseScheduleModal}
        />
      )}
    </>
  );
};

export default CourseDetailModal;
