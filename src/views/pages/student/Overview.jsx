import CourseCard from "../../../components/course-card/CourseCard";
import "./Overview.scss";

function Overview() {
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
    </div>
  );
}

export default Overview;
