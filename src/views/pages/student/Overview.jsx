import CourseCard from "../../../components/course-card/CourseCard";
import PlanCard from "../../../components/plan-card/PlanCard";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Overview.scss";
import { useState } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import StatisticCard from "../../../components/statistic/StatisticCard";
import { IMAGES } from "../../../constants/images";

function Overview() {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);
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

  // lectures
  const courses = [
    {
      id: 1,
      student_id: 1,
      course: {
        name: "English A1",
        price: 1000,
        num_classes: 30,
        description: "Hoc lam quen voi tieng Anh",
        image: IMAGES.france_image,
        color: "4caf50",
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
        description: "Hoc lam quen voi tieng Anh",
        image: IMAGES.france_image,
        color: "4caf50",
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
        description: "Hoc lam quen voi tieng Anh",
        image: IMAGES.france_image,
        color: "4caf50",
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
        description: "Hoc lam quen voi tieng Anh",
        image: IMAGES.france_image,
        color: "4caf50",
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
        description: "Hoc lam quen voi tieng Anh",
        image: IMAGES.france_image,
        color: "4caf50",
      },
      progress: 100,
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

  // Hàm so sánh ngày
  const isSameDate = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  // Lọc plans theo ngày được chọn
  const filteredPlans = plans.filter((plan) => {
    const planDate = new Date(
      plan.time_start.split(" ")[1].split("/").reverse().join("-")
    ); // Chuyển "17/04/2025" thành Date
    return isSameDate(planDate, selectedDate);
  });

  const filteredCourses = courses
    .filter((c) => c.progress < 100) // Bỏ các khoá đã hoàn thành 100%
    .sort((a, b) => b.progress - a.progress) // Sắp xếp giảm dần theo progress
    .slice(0, 4);

  // Chia plans thành các nhóm 2 để render 2 card mỗi hàng
  const planRows = [];
  for (let i = 0; i < filteredPlans.length; i += 2) {
    planRows.push(filteredPlans.slice(i, i + 2));
  }

  const courseRows = [];
  for (let i = 0; i < filteredCourses.length; i += 2) {
    courseRows.push(filteredCourses.slice(i, i + 2));
  }

  return (
    <div className="overview gap-5">
      <div className="overview-container">
        <div className="overview-header d-flex gap-3 align-items-center">
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
        <div className="overview-header d-flex gap-3 align-items-center mt-4">
          <h2>My Plan</h2>
          <a href="">View all</a>
          <div className="react-datepicker-wrapper-wrap">
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
            />
            <FaCalendarAlt />
          </div>
        </div>
        {planRows.length > 0 ? (
          planRows.map((row, index) => (
            <div key={index} className="d-flex  gap-5 mb-4">
              {row.map((plan) => (
                <PlanCard key={plan.id} plan={plan} />
              ))}
              {row.length === 1 && <div className="flex-fill ms-4"></div>}
            </div>
          ))
        ) : (
          <p>No plans found for the selected date.</p>
        )}
      </div>
      <div className="overview-container right">
        <div className="overview-header d-flex gap-3 align-items-center">
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

export default Overview;
