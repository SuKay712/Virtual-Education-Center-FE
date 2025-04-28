import "./ClassModal.scss";
import { FaClock } from "react-icons/fa";
import moment from "moment";
import { FaBookOpen } from "react-icons/fa6";
import { IMAGES } from "../../constants/images";
import { useState } from "react";
import ReactStars from "react-rating-stars-component";

const ClassModal = ({ info, handleCloseModal }) => {
  const [studentAttitude, setStudentAttitude] = useState(
    info.student_attitude || ""
  );
  const [rating, setRating] = useState(info.rating || 0);
  const [comment, setComment] = useState(info.comment || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Student Attitude:", studentAttitude);
    console.log("Comment:", comment);
    // Thực hiện logic lưu dữ liệu tại đây (gửi API hoặc cập nhật state)
  };
  return (
    <div className="class-modal">
      <div className="modal-content">
        <button className="close-btn" onClick={handleCloseModal}>
          &times;
        </button>
        <div className="modal-header">
          <h3>{info.name}</h3>
        </div>
        <div className="modal-class-info">
          <div>
            <FaClock className="me-2" />
            {moment(info.time_start, "HH:mm DD/MM/YYYY").format("HH:mm")} -{" "}
            {moment(info.time_end, "HH:mm DD/MM/YYYY").format(
              "HH:mm DD/MM/YYYY"
            )}
          </div>
          <div>
            <FaBookOpen className="me-2" />
            {info.lecture.name}
          </div>
        </div>
        <div className="modal-class-detail">
          <div className="d-flex justify-content-between align-items-center">
            <div className="flex-grow-1 me-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <strong className="modal-class-label">Student name:</strong>
                <span className="fw-bold">{info.lecture.student.name}</span>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <strong className="modal-class-label">Teacher name:</strong>
                <span className="fw-bold">{info.bookings[0].teacher.name}</span>
              </div>
            </div>
            <div>
              <img src={IMAGES.ceo_image} alt="" />
            </div>
          </div>
          {/* Lecture Links */}
          <div className="lecture-links mb-3">
            <h6 className="fw-bold modal-class-label">Class content:</h6>
            {info.lecture.links && info.lecture.links.length > 0 ? (
              <ul className="list-unstyled">
                {info.lecture.links.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.title || `Lecture ${index + 1}`}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <div>
                <p>No lecture links available.</p>
                <p>No lecture links available.</p>
                <p>No lecture links available.</p>
              </div>
            )}
          </div>
          <div className="class-bookings">
            <div className="d-flex align-items-center justify-content-between">
              <p className="modal-class-label">Booking status: </p>
              {info.bookings && info.bookings.length > 0 ? (
                <div>
                  <span className="status-circle bg-success me-2"></span>
                  <span className="fw-bold text-success">Complete</span>
                </div>
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
            <div className="">
              <label htmlFor="studentAttitude" className="form-label">
                Student Attitude
              </label>
              <select
                id="studentAttitude"
                className="form-select"
                value={studentAttitude}
                onChange={(e) => setStudentAttitude(e.target.value)}
              >
                <option value="">Select attitude</option>
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Average">Average</option>
                <option value="Poor">Poor</option>
              </select>
            </div>
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
              ></textarea>
            </div>
            <div className="d-flex justify-content-center">
              <button type="submit" className="class-mobal-submit-btn">
                Submit Evaluation
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ClassModal;
