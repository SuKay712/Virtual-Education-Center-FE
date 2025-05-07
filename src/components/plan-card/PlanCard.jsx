import moment from "moment";
import "./index.scss";

const PlanCard = ({ plan, onClick }) => {
  return (
    <div className="plan-card" onClick={onClick}>
      <div className={`plan-card-image-holder book-icon`}>
        <div className={`plan-card-image book-icon`}></div>
      </div>
      <div>
        <div className="plan-card-content">
          <h5>{plan.lecture.name}</h5>
          <p>
            {new Date(plan.time_start).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            -
            {new Date(plan.time_end).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlanCard;
