import { useNavigate } from "react-router-dom";
import { IMAGES } from "../../constants/images";
import "./index.scss";

const CourseCard = ({ course }) => {
  const navigate = useNavigate();
  return (
    <div
      className={`course-card color-${course.course.color}`}
      onClick={() => {
        navigate("/student");
      }}
    >
      <div className="course-card-body d-flex justify-content-between align-items-center">
        <div className="course-card-info d-flex flex-column">
          <h3>{course.course.name}</h3>
          <p>{course.lessons} Lessons</p>
          <div className="course-card-progress">
            <div
              className="progress-circle"
              style={{
                background: `conic-gradient(#${course.course.color} ${100 - course.progress}%, #ffffff ${100 - course.progress}% 100%)`,
              }}
            >
              <div
                className={`progress-inner-circle color-${course.course.color}`}
              >
                <span>{course.progress}%</span>
              </div>
            </div>
          </div>
        </div>
        <div className="course-card-image">
          <img src={course.course.image} alt={course.course.name} />
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
