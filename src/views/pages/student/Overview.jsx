import CourseCard from "../../../components/course-card/CourseCard";
import PlanCard from "../../../components/plan-card/PlanCard";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Overview.scss";
import { useState } from "react";
import { FaCalendarAlt } from "react-icons/fa";

function Overview() {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);
  const plans = [
    {
      id: 1,
      lecture: {
        id: 2,
        name: 1,
        student_id: 10,
      },
      name: "Reading - Beginner Topic 1",
      teacher: {
        id: 1,
        name: "Kay",
      },
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
      lecture: {
        id: 2,
        name: 1,
        student_id: 10,
      },
      name: "Reading - Beginner Topic 1",
      teacher: {
        id: 1,
        name: "Kay",
      },
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
        student_id: 10,
      },
      name: "Reading - Beginner Topic 1",
      teacher: {
        id: 1,
        name: "Kay",
      },
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
        student_id: 10,
      },
      name: "Reading - Beginner Topic 1",
      teacher: {
        id: 1,
        name: "Kay",
      },
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

  // Chia plans thành các nhóm 2 để render 2 card mỗi hàng
  const planRows = [];
  for (let i = 0; i < filteredPlans.length; i += 2) {
    planRows.push(filteredPlans.slice(i, i + 2));
  }

  return (
    <div className="overview-container">
      <div className="overview-header d-flex gap-3 align-items-center">
        <h2>My course</h2>
        <a href="">View all</a>
      </div>
      <div className="d-flex gap-5 mb-4">
        <CourseCard />
        <CourseCard />
      </div>
      <div className="d-flex gap-5">
        <CourseCard />
        <CourseCard />
      </div>
      <div className="overview-header d-flex gap-3 align-items-center mt-4">
        <h2>My Plan</h2>
        <a href="">View all</a>
        <div className="react-datepicker-wrapper-wrap">
          <DatePicker
            selected={selectedDate}
            onSelect={selectedDate}
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
            {row.length === 1 && <div className="flex-fill"></div>}
          </div>
        ))
      ) : (
        <p>No plans found for the selected date.</p>
      )}
    </div>
  );
}

export default Overview;
