import { formatTime } from "../../utils/dateFormat";
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
            {formatTime(plan.time_start)} - {formatTime(plan.time_end)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlanCard;
