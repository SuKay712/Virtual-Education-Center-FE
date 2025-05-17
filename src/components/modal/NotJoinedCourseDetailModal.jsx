import { IMAGES } from "../../constants/images";
import "./NotJoinedCourseDetailModal.scss";
import studentAPI from "../../api/studentAPI";
import { useState } from "react";
import ScheduleSelectionModal from "./ScheduleSelectionModal";

const NotJoinedCourseDetailModal = ({ course, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const handlePayment = async (scheduleData) => {
    try {
      setLoading(true);
      const paymentData = {
        courseId: course.id,
        paymentMethod: "MOMO",
        ...scheduleData,
      };

      const response = await studentAPI.createMomoPayment(paymentData);

      // Redirect to MOMO payment URL if available
      if (response.data?.paymentUrl) {
        window.location.href = response.data.paymentUrl;
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="card-modal">
        <div className={`card-modal-content classes color-4caf50`}>
          <div className="position-relative d-flex justify-content-between">
            <h3 className="mb-4">Course Content: {course.name}</h3>
            <button className="card-close-btn" onClick={onClose}>
              <i className="fa fa-times"></i>
            </button>
          </div>
          <div className="course-info mb-4">
            <p className="course-description">{course.description}</p>
          </div>
          <ul className="lecture-list">
            {course.lectures?.map((lecture, index) => (
              <li key={index} className="lecture-item d-flex">
                <div className="lecture-info d-flex aligns-item-center">
                  <img
                    src={IMAGES.france_image}
                    alt={lecture.name}
                    className="lecture-image"
                  />
                  <div className="d-flex align-items-center justify-content-between flex-grow-1 me-2">
                    <h4 className="lecture-name mb-0">
                      Lesson {index + 1}: {lecture.name}
                    </h4>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="d-flex justify-content-center mt-4">
            <button
              className="card-view-detail-btn"
              onClick={() => setShowScheduleModal(true)}
              disabled={loading}
            >
              {loading
                ? "Processing..."
                : `${course.price.toLocaleString("vi-VN")} VNĐ`}
            </button>
          </div>
        </div>
      </div>

      {showScheduleModal && (
        <ScheduleSelectionModal
          onClose={() => setShowScheduleModal(false)}
          onSubmit={handlePayment}
          courseId={course.id}
        />
      )}
    </>
  );
};

export default NotJoinedCourseDetailModal;
