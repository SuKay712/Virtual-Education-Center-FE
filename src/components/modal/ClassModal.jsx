import "./ClassModal.scss";
import { FaClock, FaBookOpen } from "react-icons/fa";
import { formatTime, formatDateTime } from "../../utils/dateFormat";
import { IMAGES } from "../../constants/images";
import { useState } from "react";
import ReactStars from "react-rating-stars-component";
import teacherAPI from "../../api/teacherAPI";
import adminAPI from "../../api/adminAPI";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ClassModal = ({ info, handleCloseModal, theme }) => {
  const userInfo = JSON.parse(localStorage.getItem("user_info"));
  const isTeacher = userInfo.role === "Teacher";
  const [studentAttitude, setStudentAttitude] = useState(
    info.student_attitude || ""
  );
  const [rating, setRating] = useState(info.rating || 0);
  const [comment, setComment] = useState(info.comment || "");
  const [viewingTheory, setViewingTheory] = useState(null);
  const navigate = useNavigate();

  const booking =
    info.bookings && info.bookings.length > 0 ? info.bookings[0] : null;

  const handleDownloadTheory = async (theory) => {
    try {
      const response = await adminAPI.downloadTheory(theory.id);
      // Create a blob from the PDF data
      const blob = new Blob([response.data], { type: "application/pdf" });
      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);
      // Create a temporary link element
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", theory.name || `theory-${theory.id}.pdf`);
      // Append to body, click and remove
      document.body.appendChild(link);
      link.click();
      link.remove();
      // Clean up the URL
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error("Không thể tải file theory");
    }
  };

  const handleViewTheory = async (theory) => {
    try {
      const response = await adminAPI.downloadTheory(theory.id);
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      setViewingTheory({ url, name: theory.name });
    } catch (error) {
      toast.error("Không thể xem file theory");
    }
  };

  const handleCloseViewer = () => {
    if (viewingTheory?.url) {
      window.URL.revokeObjectURL(viewingTheory.url);
    }
    setViewingTheory(null);
  };

  // Check if current time has passed class end time
  const isClassEnded = () => {
    const now = new Date();
    const endTime = new Date(
      info.time_end.replace(
        /(\d{2}):(\d{2}) (\d{2})\/(\d{2})\/(\d{4})/,
        "$5-$4-$3T$1:$2:00"
      )
    );
    return now > endTime;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isClassEnded()) {
      toast.error(
        "Chưa thể đánh giá lớp học. Vui lòng đợi đến khi lớp học kết thúc."
      );
      return;
    }
    try {
      await teacherAPI.updateClass(info.id, {
        rating: rating,
        comment: comment,
      });
      toast.success("Đánh giá lớp học thành công!");
      handleCloseModal();
    } catch (error) {
      toast.error("Không thể cập nhật đánh giá lớp học");
    }
  };

  const isFormDisabled = !isTeacher || !isClassEnded();

  return (
    <div className={`class-modal ${theme}`}>
      <div className="modal-content">
        <button className="close-btn" onClick={handleCloseModal}>
          &times;
        </button>
        <div className="modal-header">
          <h3>{info.lecture.name}</h3>
        </div>
        <div className="modal-class-info">
          <div>
            <FaClock className="me-2" />
            {formatTime(info.time_start)} - {formatDateTime(info.time_end)}
          </div>
          <div>
            <FaBookOpen className="me-2" />
            {info.lecture.name}
          </div>
          {info.meeting_url && (
            <div>
              <i className="fas fa-video me-2"></i>
              <a
                href={info.meeting_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary"
              >
                {info.meeting_url}
              </a>
            </div>
          )}
        </div>
        <div className="modal-class-detail">
          <div className="d-flex justify-content-between align-items-center">
            <div className="flex-grow-1 me-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <strong className="modal-class-label">Student name:</strong>
                <span className="fw-bold">{info.student.name}</span>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <strong className="modal-class-label">Teacher name:</strong>
                <span className="fw-bold">
                  {info.bookings && info.bookings.length > 0
                    ? info.bookings[0].teacher.name
                    : ""}
                </span>
              </div>
            </div>
            <div>
              <img src={userInfo.avatar} alt="" />
            </div>
          </div>
          {/* Lecture Links */}
          <div className="lecture-links mb-3">
            <h6 className="fw-bold modal-class-label">Class content:</h6>
            {info.lecture.theories && info.lecture.theories.length > 0 ? (
              <div className="theory-files">
                {info.lecture.theories.map((theory, index) => (
                  <div key={theory.id} className="theory-file-item">
                    <i className="fas fa-file-pdf me-2 text-danger"></i>
                    <span className="theory-file-name">
                      {theory.name || `Theory ${index + 1}`}
                    </span>
                    <div className="theory-file-actions">
                      {/* <button
                        onClick={() => navigate(`/theory/${theory.id}/view`)}
                        className="theory-file-action-btn view-btn"
                        title="View PDF"
                      >
                        <i className="fas fa-eye"></i>
                      </button> */}
                      <button
                        onClick={() => handleDownloadTheory(theory)}
                        className="theory-file-action-btn download-btn"
                        title="Download PDF"
                      >
                        <i className="fas fa-download"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-content">
                <p>No theory files available.</p>
              </div>
            )}
          </div>
          {/* PDF Viewer Modal */}
          {viewingTheory && (
            <div className="pdf-viewer-modal">
              <div className="pdf-viewer-content">
                <div className="pdf-viewer-header">
                  <h5>{viewingTheory.name}</h5>
                  <button onClick={handleCloseViewer} className="close-btn">
                    <i className="fas fa-times"></i>
                  </button>
                </div>
                <iframe
                  src={viewingTheory.url}
                  title="PDF Viewer"
                  className="pdf-viewer-iframe"
                />
              </div>
            </div>
          )}
          <div className="class-bookings">
            <div className="d-flex align-items-center justify-content-between">
              <p className="modal-class-label">Booking status: </p>
              {info.bookings && info.bookings.length > 0 ? (
                (() => {
                  const booking = info.bookings[0];
                  let statusText = "";
                  let textClass = "";
                  let circleClass = "";
                  switch (booking.status) {
                    case 0:
                      statusText = "Pending";
                      textClass = "text-secondary";
                      circleClass = "bg-secondary";
                      break;
                    case 1:
                      statusText = "Approved";
                      textClass = "text-primary";
                      circleClass = "bg-primary";
                      break;
                    case 2:
                      statusText = "Canceled";
                      textClass = "text-danger";
                      circleClass = "bg-danger";
                      break;
                    case 3:
                      statusText = "Completed";
                      textClass = "text-success";
                      circleClass = "bg-success";
                      break;
                    default:
                      statusText = "Unknown";
                      textClass = "text-muted";
                      circleClass = "bg-light";
                  }
                  return (
                    <div>
                      <span
                        className={`status-circle ${circleClass} me-2`}
                      ></span>
                      <span className={`fw-bold ${textClass}`}>
                        {statusText}
                      </span>
                    </div>
                  );
                })()
              ) : (
                <div>
                  <span className="status-circle bg-warning me-2"></span>
                  <span className="fw-bold text-warning">Not Completed</span>
                </div>
              )}
            </div>
          </div>
          <form onSubmit={handleSubmit} className="class-evaluation-form mt-3">
            <h5 className="fw-bold">Class evaluation</h5>
            {!isClassEnded() && (
              <div className="alert alert-warning">
                Chưa thể đánh giá lớp học. Vui lòng đợi đến khi lớp học kết
                thúc.
              </div>
            )}
            <div className="d-flex align-items-center">
              <label htmlFor="rating" className="form-label mb-0 me-3">
                Rating
              </label>
              <ReactStars
                count={5}
                value={rating}
                onChange={(newRating) => setRating(newRating)}
                size={24}
                activeColor="#ffd700"
                edit={!isFormDisabled}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="comment" className="form-label">
                Comment
              </label>
              <textarea
                id="comment"
                className="form-control"
                rows="2"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                disabled={isFormDisabled}
              ></textarea>
            </div>
            {isTeacher && (
              <div className="d-flex justify-content-center">
                <button
                  type="submit"
                  className="class-modal-submit-btn"
                  disabled={isFormDisabled}
                >
                  Submit Evaluation
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ClassModal;
