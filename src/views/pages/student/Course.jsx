import CourseCard from "../../../components/course-card/CourseCard";
import "./Course.scss";
import StatisticCard from "../../../components/statistic/StatisticCard";
import { IMAGES } from "../../../constants/images";
import { useEffect, useState } from "react";
import studentAPI from "../../../api/studentAPI";
import { calculateCourseProgress } from "../../../utils/courseProgress";
import CoursePreviewModal from "../../../components/modal/CoursePreviewModal";
import CourseDetailModal from "../../../components/modal/CourseDetailModal";
import NotJoinedCourseDetailModal from "../../../components/modal/NotJoinedCourseDetailModal";

function Course() {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [classes, setClasses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [notJoinCourses, setNotJoinCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotJoinCourse, setSelectedNotJoinCourse] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await studentAPI.getClasses();
      const processedCourses = calculateCourseProgress(response.data.classes);
      setCourses(processedCourses);
      setNotJoinCourses(response.data.otherCourses);
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
    setSelectedNotJoinCourse(null);
    setShowDetailsModal(false);
  };

  const handleCloseModalDetail = () => {
    setShowDetailsModal(false);
  };

  const handleNotJoinCourseClick = (course) => {
    setSelectedNotJoinCourse(course);
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
  // Create rows of 2 courses each
  const courseRows = [];
  for (let i = 0; i < filteredCourses.length; i += 2) {
    courseRows.push(filteredCourses.slice(i, i + 2));
  }

  const notJoinCourseRows = [];
  for (let i = 0; i < notJoinCourses.length; i += 2) {
    notJoinCourseRows.push(notJoinCourses.slice(i, i + 2));
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
              {row.length === 1 && <div className="flex-fill"></div>}
            </div>
          ))
        ) : (
          <p>No courses found.</p>
        )}

        <div className="course-header d-flex gap-3 align-items-center">
          <h2>Available courses</h2>
        </div>
        {loading ? (
          <p>Loading courses...</p>
        ) : notJoinCourseRows.length > 0 ? (
          notJoinCourseRows.map((row, index) => (
            <div key={index} className="d-flex gap-5 mb-4">
              {row.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onClick={() => handleNotJoinCourseClick(course)}
                />
              ))}
              {row.length === 1 && <div className="flex-fill ms-1"></div>}
            </div>
          ))
        ) : (
          <p>No courses found.</p>
        )}
      </div>

      {/* Course Preview Modal */}
      {selectedCourse && (
        <CoursePreviewModal
          course={selectedCourse}
          onClose={handleCloseModal}
          onViewDetails={handleViewDetails}
        />
      )}

      {/* Not Joined Course Preview Modal */}
      {selectedNotJoinCourse && (
        <CoursePreviewModal
          course={selectedNotJoinCourse}
          onClose={handleCloseModal}
          onViewDetails={() => setShowDetailModal(true)}
        />
      )}

      {/* Course Details Modal for joined courses */}
      {showDetailsModal && selectedCourse && (
        <CourseDetailModal
          course={selectedCourse}
          onClose={handleCloseModalDetail}
        />
      )}

      {/* Course Details Modal for not joined courses */}
      {showDetailModal && selectedNotJoinCourse && (
        <NotJoinedCourseDetailModal
          course={selectedNotJoinCourse}
          onClose={() => setShowDetailModal(false)}
        />
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
