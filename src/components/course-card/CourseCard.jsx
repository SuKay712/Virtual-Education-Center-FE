import { useNavigate } from "react-router-dom";
import { IMAGES } from "../../constants/images";
import "./index.scss";

const CourseCard = ({ course, onClick }) => {
  const navigate = useNavigate();
  return (
    <div className={`course-card color-4caf50`} onClick={onClick}>
      <div className="course-card-body d-flex justify-content-between align-items-center">
        <div className="course-card-info d-flex flex-column">
          <h3>{course.name}</h3>
          <p>{course.lessons} Lessons</p>
          <div className="course-card-progress">
            <div
              className="progress-circle"
              style={{
                background: `conic-gradient(#4caf50 ${100 - course.progress}%, #ffffff ${100 - course.progress}% 100%)`,
              }}
            >
              <div className={`progress-inner-circle color-4caf50`}>
                <span>{course.progress}%</span>
              </div>
            </div>
          </div>
        </div>
        <div className="course-card-image">
          <img src={IMAGES.france_image} alt={course.name} />
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
