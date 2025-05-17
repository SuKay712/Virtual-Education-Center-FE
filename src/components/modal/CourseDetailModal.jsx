import { IMAGES } from "../../constants/images";
import "./CourseDetailModal.scss";
import {
  format,
  addDays,
  startOfWeek,
  endOfWeek,
  parse,
  isWithinInterval,
} from "date-fns";

const CourseDetailModal = ({ course, onClose }) => {
  console.log(course);
  return (
    <div className="card-modal">
      <div className={`card-modal-content classes color-4caf50`}>
        <div className="position-relative d-flex justify-content-between">
          <h3 className="mb-4">Classes for {course.name}</h3>
          <button className="card-close-btn" onClick={onClose}>
            <i className="fa fa-times"></i>
          </button>
        </div>
        <ul className="lecture-list">
          {course.classes.map((classData) => {
            const time_start = parse(
              classData.time_start,
              "HH:mm dd/MM/yyyy",
              new Date()
            );
            const isCompleted = time_start < new Date().getTime();
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
  );
};

export default CourseDetailModal;
