import CourseCard from "../../../components/course-card/CourseCard";
import "./Course.scss";
import StatisticCard from "../../../components/statistic/StatisticCard";
import { IMAGES } from "../../../constants/images";
import { useState } from "react";

function Course() {
  const [selectedCourse, setSelectedCourse] = useState(null); // Quản lý course được chọn
  const [showDetailsModal, setShowDetailsModal] = useState(false); // Quản lý modal chi tiết

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
  };

  const handleViewDetails = () => {
    setShowDetailsModal(true); // Hiển thị modal chi tiết
  };

  const handleCloseModal = () => {
    setSelectedCourse(null); // Đóng modal course
    setShowDetailsModal(false); // Đóng modal chi tiết
  };

  const handleCloseModalDetail = () => {
    setShowDetailsModal(false); // Đóng modal chi tiết
  };

  // lectures
  const courses = [
    {
      id: 1,
      student_id: 1,
      course: {
        name: "English A1",
        price: 1000,
        num_classes: 30,
        description:
          "Hoc lam quen voi tieng Anh\nHoc lam quen voi tieng Anh\nHoc lam quen voi tieng Anh\nHoc lam quen voi tieng Anh\nHoc lam quen voi tieng Anh",
        image: IMAGES.france_image,
        color: "4caf50",
        lectures: [
          {
            id: 1,
            name: "Getting started with English",
            image: IMAGES.france_image,
            description: "Nghe noi doc viet",
          },
          {
            id: 2,
            name: "Getting started with English",
            image: IMAGES.france_image,
            description: "Nghe noi doc viet",
          },
          {
            id: 3,
            name: "Getting started with English",
            image: IMAGES.france_image,
            description: "Nghe noi doc viet",
          },
          {
            id: 4,
            name: "Getting started with English",
            image: IMAGES.france_image,
            description: "Nghe noi doc viet",
          },
          {
            id: 5,
            name: "Getting started with English",
            image: IMAGES.france_image,
            description: "Nghe noi doc viet",
          },
          {
            id: 6,
            name: "Getting started with English",
            image: IMAGES.france_image,
            description: "Nghe noi doc viet",
          },
        ],
      },
      progress: 75,
    },
    {
      id: 2,
      student_id: 1,
      course: {
        name: "English A1",
        price: 1000,
        num_classes: 30,
        description:
          "Hoc lam quen voi tieng Anh\nHoc lam quen voi tieng Anh\nHoc lam quen voi tieng Anh\nHoc lam quen voi tieng Anh\nHoc lam quen voi tieng Anh",
        image: IMAGES.france_image,
        color: "4caf50",
        lectures: [
          {
            id: 1,
            name: "Getting started with English",
            image: IMAGES.france_image,
            description: "Nghe noi doc viet",
          },
          {
            id: 2,
            name: "Getting started with English",
            image: IMAGES.france_image,
            description: "Nghe noi doc viet",
          },
          {
            id: 3,
            name: "Getting started with English",
            image: IMAGES.france_image,
            description: "Nghe noi doc viet",
          },
          {
            id: 4,
            name: "Getting started with English",
            image: IMAGES.france_image,
            description: "Nghe noi doc viet",
          },
          {
            id: 5,
            name: "Getting started with English",
            image: IMAGES.france_image,
            description: "Nghe noi doc viet",
          },
          {
            id: 6,
            name: "Getting started with English",
            image: IMAGES.france_image,
            description: "Nghe noi doc viet",
          },
        ],
      },

      progress: 70,
    },
    {
      id: 3,
      student_id: 1,
      course: {
        name: "English A1",
        price: 1000,
        num_classes: 30,
        description:
          "Hoc lam quen voi tieng Anh\nHoc lam quen voi tieng Anh\nHoc lam quen voi tieng Anh\nHoc lam quen voi tieng Anh\nHoc lam quen voi tieng Anh",
        image: IMAGES.france_image,
        color: "4caf50",
        lectures: [
          {
            id: 1,
            name: "Getting started with English",
            image: IMAGES.france_image,
            description: "Nghe noi doc viet",
          },
          {
            id: 2,
            name: "Getting started with English",
            image: IMAGES.france_image,
            description: "Nghe noi doc viet",
          },
          {
            id: 3,
            name: "Getting started with English",
            image: IMAGES.france_image,
            description: "Nghe noi doc viet",
          },
          {
            id: 4,
            name: "Getting started with English",
            image: IMAGES.france_image,
            description: "Nghe noi doc viet",
          },
          {
            id: 5,
            name: "Getting started with English",
            image: IMAGES.france_image,
            description: "Nghe noi doc viet",
          },
          {
            id: 6,
            name: "Getting started with English",
            image: IMAGES.france_image,
            description: "Nghe noi doc viet",
          },
        ],
      },
      progress: 45,
    },
    {
      id: 4,
      student_id: 1,
      course: {
        name: "English A1",
        price: 1000,
        num_classes: 30,
        description:
          "Hoc lam quen voi tieng Anh\nHoc lam quen voi tieng Anh\nHoc lam quen voi tieng Anh\nHoc lam quen voi tieng Anh\nHoc lam quen voi tieng Anh",
        image: IMAGES.france_image,
        color: "4caf50",
        lectures: [
          {
            id: 1,
            name: "Getting started with English",
            image: IMAGES.france_image,
            description: "Nghe noi doc viet",
          },
          {
            id: 2,
            name: "Getting started with English",
            image: IMAGES.france_image,
            description: "Nghe noi doc viet",
          },
          {
            id: 3,
            name: "Getting started with English",
            image: IMAGES.france_image,
            description: "Nghe noi doc viet",
          },
          {
            id: 4,
            name: "Getting started with English",
            image: IMAGES.france_image,
            description: "Nghe noi doc viet",
          },
          {
            id: 5,
            name: "Getting started with English",
            image: IMAGES.france_image,
            description: "Nghe noi doc viet",
          },
          {
            id: 6,
            name: "Getting started with English",
            image: IMAGES.france_image,
            description: "Nghe noi doc viet",
          },
        ],
      },
      progress: 90,
    },
    {
      id: 5,
      student_id: 1,
      course: {
        name: "English A1",
        price: 1000,
        num_classes: 30,
        description:
          "Hoc lam quen voi tieng Anh\nHoc lam quen voi tieng Anh\nHoc lam quen voi tieng Anh\nHoc lam quen voi tieng Anh\nHoc lam quen voi tieng Anh",
        image: IMAGES.france_image,
        color: "4caf50",
        lectures: [
          {
            id: 1,
            name: "Getting started with English",
            image: IMAGES.france_image,
            description: "Nghe noi doc viet",
          },
          {
            id: 2,
            name: "Getting started with English",
            image: IMAGES.france_image,
            description: "Nghe noi doc viet",
          },
          {
            id: 3,
            name: "Getting started with English",
            image: IMAGES.france_image,
            description: "Nghe noi doc viet",
          },
          {
            id: 4,
            name: "Getting started with English",
            image: IMAGES.france_image,
            description: "Nghe noi doc viet",
          },
          {
            id: 5,
            name: "Getting started with English",
            image: IMAGES.france_image,
            description: "Nghe noi doc viet",
          },
          {
            id: 6,
            name: "Getting started with English",
            image: IMAGES.france_image,
            description: "Nghe noi doc viet",
          },
        ],
      },
      progress: 100,
    },
  ];

  const plans = [
    {
      id: 1,
      lecture: {
        id: 2,
        name: 1,
        student: {
          id: 1,
          name: "Khoi",
        },
      },
      name: "Reading - Beginner Topic 1",
      bookings: [
        {
          id: 1,
          teacher: {
            id: 1,
            name: "Kay",
          },
        },
      ],
      icon: "book-icon",
      time_start: "10:20 16/04/2025",
      time_end: "11:20 17/04/2025",
      rating: 5,
      comment: "",
      meeting_id: 1,
      created_at: "07:20 17/04/2025",
      updated_at: "07:20 17/04/2025",
    },
    {
      id: 2,
      llecture: {
        id: 2,
        name: 1,
        student: {
          id: 1,
          name: "Khoi",
        },
      },
      name: "Reading - Beginner Topic 1",
      bookings: [
        {
          id: 1,
          teacher: {
            id: 1,
            name: "Kay",
          },
        },
      ],
      icon: "book-icon",
      time_start: "10:20 17/04/2025",
      time_end: "11:20 17/04/2025",
      rating: 5,
      comment: "",
      meeting_id: 1,
      created_at: "07:20 17/04/2025",
      updated_at: "07:20 17/04/2025",
    },
    {
      id: 3,
      lecture: {
        id: 2,
        name: 1,
        student: {
          id: 1,
          name: "Khoi",
        },
      },
      name: "Reading - Beginner Topic 1",
      bookings: [
        {
          id: 1,
          teacher: {
            id: 1,
            name: "Kay",
          },
        },
      ],
      icon: "book-icon",
      time_start: "10:20 17/04/2025",
      time_end: "11:20 17/04/2025",
      rating: 5,
      comment: "",
      meeting_id: 1,
      created_at: "07:20 18/04/2025",
      updated_at: "07:20 18/04/2025",
    },
    {
      id: 4,
      lecture: {
        id: 2,
        name: 1,
        student: {
          id: 1,
          name: "Khoi",
        },
      },
      name: "Reading - Beginner Topic 1",
      bookings: [
        {
          id: 1,
          teacher: {
            id: 1,
            name: "Kay",
          },
        },
      ],
      icon: "book-icon",
      time_start: "10:20 17/04/2025",
      time_end: "11:20 17/04/2025",
      rating: 5,
      comment: "",
      meeting_id: 1,
      created_at: "07:20 18/04/2025",
      updated_at: "07:20 18/04/2025",
    },
  ];

  const parseDate = (dateStr) => {
    const [time, date] = dateStr.split(" ");
    return new Date(`${date.split("/").reverse().join("-")}T${time}`);
  };

  const isPlanFinished = (plan) => {
    const now = new Date();
    const end = parseDate(plan.time_end);
    return now > end;
  };

  const finishedPlans = plans.filter(isPlanFinished);

  const finishedPlansLength = plans.filter(isPlanFinished).length;

  const totalRatingFinished = finishedPlans.reduce(
    (sum, plan) => sum + (plan.rating || 0),
    0
  );

  const separateCoursesByProgress = (courses) => {
    return {
      finished: courses.filter((c) => c.progress === 100),
      unfinished: courses.filter((c) => c.progress < 100),
    };
  };

  const { finished, unfinished } = separateCoursesByProgress(courses);

  const filteredCourses = courses
    .filter((c) => c.progress < 100) // Bỏ các khoá đã hoàn thành 100%
    .sort((a, b) => b.progress - a.progress) // Sắp xếp giảm dần theo progress
    .slice(0, 4);

  const courseRows = [];
  for (let i = 0; i < filteredCourses.length; i += 2) {
    courseRows.push(filteredCourses.slice(i, i + 2));
  }

  return (
    <div className="course gap-5">
      <div className="course-container">
        <div className="course-header d-flex gap-3 align-items-center">
          <h2>My course</h2>
          <a href="">View all</a>
        </div>
        {courseRows.length > 0 ? (
          courseRows.map((row, index) => (
            <div key={index} className="d-flex  gap-5 mb-4">
              {row.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
              {row.length === 1 && <div className="flex-fill ms-4"></div>}
            </div>
          ))
        ) : (
          <p>No courses found for the selected date.</p>
        )}
        <div className="course-header d-flex gap-3 align-items-center">
          <h2>Available course</h2>
          <a href="">View all</a>
        </div>
        {courseRows.length > 0 ? (
          courseRows.map((row, index) => (
            <div key={index} className="d-flex  gap-5 mb-4">
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
          <p>No courses found for the selected date.</p>
        )}
      </div>
      {/* Modal hiển thị thông tin course */}
      {selectedCourse && (
        <div className="card-modal">
          <div
            className={`card-modal-content color-${selectedCourse.course.color}`}
          >
            <div className="position-relative d-flex justify-content-between">
              <h3 className="card-modal-header">
                {selectedCourse.course.name}
              </h3>
              <button className="card-close-btn" onClick={handleCloseModal}>
                <i className="fa fa-times"></i>
              </button>
            </div>
            <div className="d-flex justify-content-between">
              <div>
                <p className="card-num-classes">
                  {selectedCourse.course.num_classes} classes
                </p>
                <p className="card-description">
                  {selectedCourse.course.description}
                </p>
              </div>
              <div className="d-flex flex-column align-items-center">
                <p className="card-price">${selectedCourse.course.price}</p>
                <img
                  src={selectedCourse.course.image}
                  alt={selectedCourse.course.name}
                />
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

      {showDetailsModal && (
        <div className="card-modal">
          <div
            className={`card-modal-content classes color-${selectedCourse.course.color}`}
          >
            <div className="position-relative d-flex justify-content-between">
              <h3 className="mb-4">Classes for {selectedCourse.course.name}</h3>
              <button
                className="card-close-btn"
                onClick={handleCloseModalDetail}
              >
                <i className="fa fa-times"></i>
              </button>
            </div>
            <ul className="lecture-list">
              {selectedCourse.course.lectures.map((lecture) => (
                <li key={lecture.id} className="lecture-item d-flex">
                  <img
                    src={lecture.image}
                    alt={lecture.name}
                    className="lecture-image"
                  />
                  <div className="lecture-info">
                    <h4 className="lecture-name">{lecture.name}</h4>
                    <p className="lecture-description">{lecture.description}</p>
                  </div>
                </li>
              ))}
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
            title={"Total Points Gained"}
            quantity={totalRatingFinished}
          />
        </div>
        <div className="d-flex gap-5">
          <StatisticCard
            title={"Courses In Progress"}
            quantity={unfinished.length}
          />
          <StatisticCard
            title={"Lessons Finished"}
            quantity={finishedPlansLength}
          />
        </div>
      </div>
    </div>
  );
}

export default Course;
