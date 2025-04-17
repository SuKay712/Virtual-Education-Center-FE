import "./index.scss";

const StatisticCard = ({ title, quantity }) => {
  return (
    <div className="statistic-card">
      <h5 className="statistic-title">{title}</h5>
      <div className="statistic-body">
        <span>{quantity}</span>
      </div>
    </div>
  );
};

export default StatisticCard;
