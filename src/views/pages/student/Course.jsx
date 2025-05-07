import CourseCard from "../../../components/course-card/CourseCard";
import "./Course.scss";
import StatisticCard from "../../../components/statistic/StatisticCard";
import { IMAGES } from "../../../constants/images";
import { useEffect, useState } from "react";
import studentAPI from "../../../api/studentAPI";
import { calculateCourseProgress } from "../../../utils/courseProgress";

function Course() {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [classes, setClasses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await studentAPI.getClasses();
      const processedCourses = calculateCourseProgress(response.data);
      setCourses(processedCourses);
    } catch (error) {
      console.error("Error fetching classes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
  };

  const handleViewDetails = () => {
    setShowDetailsModal(true);
  };

  const handleCloseModal = () => {
    setSelectedCourse(null);
    setShowDetailsModal(false);
  };

  const handleCloseModalDetail = () => {
    setShowDetailsModal(false);
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
  console.log(filteredCourses);
  // Create rows of 2 courses each
  const courseRows = [];
  for (let i = 0; i < filteredCourses.length; i += 2) {
    courseRows.push(filteredCourses.slice(i, i + 2));
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
    <div className="course gap-5">
      <div className="course-container">
        <div className="course-header d-flex gap-3 align-items-center">
          <h2>My course</h2>
          <a href="">View all</a>
        </div>
        {loading ? (
          <p>Loading courses...</p>
        ) : courseRows.length > 0 ? (
          courseRows.map((row, index) => (
            <div key={index} className="d-flex gap-5 mb-4">
              {row.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onClick={() => handleCourseClick(course)}
                />
              ))}
              {row.length === 1 && <div className="flex-fill ms-4"></div>}
            </div>
          ))
        ) : (
          <p>No courses found.</p>
        )}
      </div>

      {/* Course Details Modal */}
      {selectedCourse && (
        <div className="card-modal">
          <div className={`card-modal-content color-4caf50`}>
            <div className="position-relative d-flex justify-content-between">
              <h3 className="card-modal-header">{selectedCourse.name}</h3>
              <button className="card-close-btn" onClick={handleCloseModal}>
                <i className="fa fa-times"></i>
              </button>
            </div>
            <div className="d-flex justify-content-between">
              <div>
                <p className="card-num-classes">
                  {selectedCourse.num_classes} classes
                </p>
                <p className="card-description">{selectedCourse.description}</p>
              </div>
              <div className="d-flex flex-column align-items-center">
                <p className="card-price">${selectedCourse.price}</p>
                <img src={IMAGES.france_image} alt={selectedCourse.name} />
              </div>
            </div>
            <div className="d-flex justify-content-center">
              <button
                className="card-view-detail-btn"
                onClick={handleViewDetails}
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Class Details Modal */}
      {showDetailsModal && (
        <div className="card-modal">
          <div className={`card-modal-content classes color-4caf50`}>
            <div className="position-relative d-flex justify-content-between">
              <h3 className="mb-4">Classes for {selectedCourse.name}</h3>
              <button
                className="card-close-btn"
                onClick={handleCloseModalDetail}
              >
                <i className="fa fa-times"></i>
              </button>
            </div>
            <ul className="lecture-list">
              {selectedCourse.classes.map((classData) => {
                const isCompleted = new Date(classData.time_start) < new Date();
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
      )}

      <div className="course-container right">
        <div className="course-header d-flex gap-3 align-items-center">
          <h2>Statistic</h2>
        </div>
        <div className="d-flex gap-5 mb-4">
          <StatisticCard
            title={"Courses Completed"}
            quantity={finished.length}
          />
          <StatisticCard
            title={"Total Classes Completed"}
            quantity={totalCompletedClasses}
          />
        </div>
        <div className="d-flex gap-5">
          <StatisticCard
            title={"Courses In Progress"}
            quantity={unfinished.length}
          />
          <StatisticCard
            title={"Upcoming Classes"}
            quantity={totalUpcomingClasses}
          />
        </div>
      </div>
    </div>
  );
}

export default Course;
