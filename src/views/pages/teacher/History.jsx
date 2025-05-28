import { parse, format, startOfMonth, endOfMonth } from "date-fns";
import { IoMdTime } from "react-icons/io";
import "./History.scss";
import { useEffect, useState } from "react";
import teacherAPI from "../../../api/teacherAPI";
import { toast } from "react-toastify";
import { IMAGES } from "../../../constants/images";

const statusMap = {
  1: { label: "Approved", color: "#4caf50" },
  2: { label: "Cancelled", color: "#f44336" },
  3: { label: "Complete", color: "#2196f3" },
};

const History = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const fetchBookings = async () => {
    try {
      const res = await teacherAPI.getHistory();
      setBookings(res.data);
    } catch (error) {
      toast.error("Failed to load schedule");
    }
  };
  useEffect(() => {
    fetchBookings();
  }, []);

  const groupByDate = (bookings) => {
    const groups = {};
    bookings.forEach((b) => {
      // Lấy ngày dạng yyyy-MM-dd để group
      const dateObj = parse(
        b.classEntity.time_start,
        "HH:mm dd/MM/yyyy",
        new Date()
      );
      const dateKey = format(dateObj, "yyyy-MM-dd");
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(b);
    });
    return groups;
  };

  const monthStart = startOfMonth(selectedMonth);
  const monthEnd = endOfMonth(selectedMonth);

  const filteredBookings = bookings.filter((b) => {
    const dateObj = parse(
      b.classEntity.time_start,
      "HH:mm dd/MM/yyyy",
      new Date()
    );
    return dateObj >= monthStart && dateObj <= monthEnd;
  });

  const grouped = groupByDate(filteredBookings);

  const getAmount = (booking) => {
    if (booking.status === 3) return 80000;
    return 0;
  };

  const gross = filteredBookings.reduce((sum, b) => sum + getAmount(b), 0);
  const tax = 0;
  const net = gross - tax;

  return (
    <div className="history">
      <h2>History Bookings</h2>
      <div className="history-table">
        <div className="income-summary-container">
          <div className="income-summary-header">
            <span>Your income</span>
            <div style={{ flex: 1 }}></div>
            <div className="income-summary-month">
              <button
                onClick={() =>
                  setSelectedMonth(
                    (prev) =>
                      new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
                  )
                }
              >
                &laquo;
              </button>
              <span>{format(selectedMonth, "MMMM, yyyy")}</span>
              <button
                onClick={() =>
                  setSelectedMonth(
                    (prev) =>
                      new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
                  )
                }
              >
                &raquo;
              </button>
            </div>
          </div>
          <div className="income-summary-cards">
            <div className="income-card">
              <div>
                <div className="income-card-title">Income GROSS</div>
                <div className="income-card-value">
                  {gross.toLocaleString()}₫
                </div>
              </div>
            </div>
            <div className="income-card">
              <div>
                <div className="income-card-title">Tax</div>
                <div className="income-card-value">
                  -{tax.toLocaleString()}₫
                </div>
              </div>
            </div>
            <div className="income-card">
              <div>
                <div className="income-card-title">Income NET</div>
                <div className="income-card-value">{net.toLocaleString()}₫</div>
              </div>
            </div>
          </div>
        </div>
        <div className="history-header-row">
          <span className="history-id">#ID</span>
          <span className="history-time">Time</span>
          <span className="history-lesson">Lesson</span>
          <span className="history-status">Status</span>
          <span className="history-amount">Amount</span>
        </div>
        {Object.keys(grouped)
          .sort((a, b) => new Date(b) - new Date(a))
          .map((dateKey) => {
            const dateObj = new Date(dateKey);
            const weekday = format(dateObj, "EEE");
            const dayMonth = format(dateObj, "dd/MMM");
            return (
              <div key={dateKey} className="history-group">
                <div className="history-date">
                  <b>
                    {weekday}, {dayMonth}
                  </b>
                </div>
                {grouped[dateKey].map((b) => {
                  const timeStart = b.classEntity.time_start.split(" ")[0];
                  const timeEnd = b.classEntity.time_end.split(" ")[0];
                  const status = statusMap[b.status] || {
                    label: "Unknown",
                    color: "#aaa",
                  };
                  return (
                    <div className="history-row" key={b.id}>
                      <span className="history-id">{b.id}</span>
                      <span className="history-time">
                        <IoMdTime style={{ marginRight: 4 }} />
                        {timeStart} - {timeEnd}
                      </span>
                      <span className="history-lesson">
                        {b.classEntity.lecture.name}
                      </span>
                      <span
                        className="history-status"
                        style={{ color: status.color }}
                      >
                        {status.label}
                        <span
                          style={{
                            display: "inline-block",
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            background: status.color,
                            marginLeft: 6,
                            verticalAlign: "middle",
                          }}
                        />
                      </span>
                      <span
                        className="history-amount"
                        style={{
                          color: b.status === 2 ? "#f44336" : "#222",
                          fontWeight: 600,
                        }}
                      >
                        {b.status === 2 ? "-80,000" : "0"}
                      </span>
                    </div>
                  );
                })}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default History;
