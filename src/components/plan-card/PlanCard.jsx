import moment from "moment";
import "./index.scss";

const PlanCard = ({ plan }) => {
  return (
    <div className="plan-card">
      <div className={`plan-card-image-holder ${plan.icon}`}>
        <div className={`plan-card-image ${plan.icon}`}></div>
      </div>
      <div>
        <div className="plan-card-content">
          <h5>{plan.name}</h5>
          <p>
            {moment(plan.time_start, "HH:mm DD/MM/YYYY").format("HH:mm")} -{" "}
            {moment(plan.time_end, "HH:mm DD/MM/YYYY").format("HH:mm")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlanCard;
