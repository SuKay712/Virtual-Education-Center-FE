import { useNavigate } from "react-router-dom";
import { IMAGES } from "../../constants/images";
import "./index.scss";

const CourseCard = () => {
  const navigate = useNavigate();
  const course = {
    name: "Course name",
    lessons: 12,
    progress: 75,
    image: IMAGES.france_image,
    link: "#",
    color: "4caf50",
  };
  return (
    <div
      className={`course-card color-${course.color}`}
      onClick={() => {
        navigate("/student");
      }}
    >
      <div className="course-card-body d-flex justify-content-between align-items-center">
        <div className="course-card-info d-flex flex-column">
          <h3>{course.name}</h3>
          <p>{course.lessons} Lessons</p>
          <div className="course-card-progress">
            <div
              className="progress-circle"
              style={{
                background: `conic-gradient(#${course.color} ${100 - course.progress}%, #ffffff ${100 - course.progress}% 100%)`,
              }}
            >
              <div className={`progress-inner-circle color-${course.color}`}>
                <span>{course.progress}%</span>
              </div>
            </div>
          </div>
        </div>
        <div className="course-card-image">
          <img src={course.image} alt={course.name} />
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
