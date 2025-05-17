import { IMAGES } from "../../constants/images";
import "./CoursePreviewModal.scss";

const CoursePreviewModal = ({ course, onClose, onViewDetails }) => {
  return (
    <div className="card-modal">
      <div className={`card-modal-content color-4caf50`}>
        <div className="position-relative d-flex justify-content-between">
          <h3 className="card-modal-header">{course.name}</h3>
          <button className="card-close-btn" onClick={onClose}>
            <i className="fa fa-times"></i>
          </button>
        </div>
        <div className="d-flex justify-content-between">
          <div>
            <p className="card-num-classes">
              {course.num_classes || 0} lessons
            </p>
            <p className="card-description">{course.description}</p>
          </div>
          <div className="d-flex flex-column align-items-center">
            <img src={IMAGES.france_image} alt={course.name} />
          </div>
        </div>
        <div className="d-flex justify-content-center">
          <button className="card-view-detail-btn" onClick={onViewDetails}>
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoursePreviewModal;
