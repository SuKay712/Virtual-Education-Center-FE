import StudentSideBar from "../sidebar/StudentSideBar";
import "./StudentLayout.scss";

function StudentLayout(props) {
  const userInfo = JSON.parse(localStorage.getItem("user_info")) || {};
  return (
    <div className="student-frame-wrapper">
      <StudentSideBar />
      <div className="frame-body">
        <div className="frame-header">
          <h4>Hello Bruno, welcome back!</h4>
        </div>
        <props.component />
      </div>
    </div>
  );
}

export default StudentLayout;
