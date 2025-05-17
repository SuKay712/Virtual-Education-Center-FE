import { useState, useEffect } from "react";
import "./ScheduleSelectionModal.scss";
import {
  format,
  addDays,
  startOfWeek,
  endOfWeek,
  parse,
  isWithinInterval,
} from "date-fns";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import studentAPI from "../../api/studentAPI";
import { toast } from "react-toastify";
import Select from "react-select";

const DAYS_OF_WEEK = [
  { id: 1, label: "Monday" },
  { id: 2, label: "Tuesday" },
  { id: 3, label: "Wednesday" },
  { id: 4, label: "Thursday" },
  { id: 5, label: "Friday" },
  { id: 6, label: "Saturday" },
  { id: 7, label: "Sunday" },
];

const TIME_SLOTS = [
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
];

const ScheduleSelectionModal = ({ onClose, onSubmit, courseId }) => {
  const [timeStart, setTimeStart] = useState({
    value: "16:00",
    label: "16:00",
  });
  const [timeEnd, setTimeEnd] = useState({ value: "17:00", label: "17:00" });
  const [selectedDays, setSelectedDays] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState([]);

  const timeOptions = TIME_SLOTS.map((time) => ({
    value: time,
    label: time,
  }));

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        const response = await studentAPI.getNextWeekClasses();
        const classesData = response.data.classes;
        setClasses(classesData);

        // Transform classes data to FullCalendar events format
        const calendarEvents = classesData.map((cls) => {
          const startDate = parse(
            cls.time_start,
            "HH:mm dd/MM/yyyy",
            new Date()
          );
          const endDate = parse(cls.time_end, "HH:mm dd/MM/yyyy", new Date());

          return {
            title: cls.lecture.name,
            start: startDate,
            end: endDate,
            backgroundColor: "#4caf50",
            borderColor: "#4caf50",
            extendedProps: {
              timeStart: format(startDate, "HH:mm"),
              timeEnd: format(endDate, "HH:mm"),
              date: format(startDate, "dd/MM/yyyy"),
            },
          };
        });

        setEvents(calendarEvents);
      } catch (error) {
        console.error("Error fetching classes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  const handleTimeStartChange = (selectedOption) => {
    setTimeStart(selectedOption);
    // Tự động set timeEnd = timeStart + 1 giờ
    const startIndex = TIME_SLOTS.indexOf(selectedOption.value);
    if (startIndex !== -1 && startIndex < TIME_SLOTS.length - 1) {
      setTimeEnd({
        value: TIME_SLOTS[startIndex + 1],
        label: TIME_SLOTS[startIndex + 1],
      });
    }
  };

  const handleDayToggle = (dayId) => {
    if (selectedDays.includes(dayId)) {
      setSelectedDays(selectedDays.filter((id) => id !== dayId));
    } else if (selectedDays.length < 3) {
      setSelectedDays([...selectedDays, dayId]);
    }
  };

  const checkScheduleConflict = (
    selectedTimeStart,
    selectedTimeEnd,
    selectedDays
  ) => {
    const nextWeekStart = startOfWeek(addDays(new Date(), 7), {
      weekStartsOn: 1,
    });

    return selectedDays.some((dayId) => {
      const dayDate = addDays(nextWeekStart, dayId - 1);
      const selectedStart = parse(
        `${selectedTimeStart} ${format(dayDate, "dd/MM/yyyy")}`,
        "HH:mm dd/MM/yyyy",
        new Date()
      );
      const selectedEnd = parse(
        `${selectedTimeEnd} ${format(dayDate, "dd/MM/yyyy")}`,
        "HH:mm dd/MM/yyyy",
        new Date()
      );

      return classes.some((cls) => {
        const classStart = parse(
          cls.time_start,
          "HH:mm dd/MM/yyyy",
          new Date()
        );
        const classEnd = parse(cls.time_end, "HH:mm dd/MM/yyyy", new Date());

        return (
          isWithinInterval(selectedStart, {
            start: classStart,
            end: classEnd,
          }) ||
          isWithinInterval(selectedEnd, { start: classStart, end: classEnd }) ||
          isWithinInterval(classStart, {
            start: selectedStart,
            end: selectedEnd,
          })
        );
      });
    });
  };

  const handleSubmit = async () => {
    if (selectedDays.length === 0) {
      toast.warning("Vui lòng chọn ít nhất một ngày trong tuần");
      return;
    }

    if (checkScheduleConflict(timeStart.value, timeEnd.value, selectedDays)) {
      toast.warning("Thời gian đã chọn trùng với lịch học hiện tại");
      return;
    }

    try {
      const response = await studentAPI.createMomoPayment({
        courseId: courseId,
        paymentMethod: "MOMO",
        time_start: timeStart.value,
        time_end: timeEnd.value,
        day_of_week: selectedDays,
      });

      toast.success("Trang web sẽ chuyển hướng đến phiên giao dịch");
      setTimeout(() => {
        window.open(response.data.payUrl, "_blank");
      }, 2000);
    } catch (error) {
      console.error("Error processing payment:", error);
      toast.error("Có lỗi xảy ra khi xử lý thanh toán");
    }
  };

  // Get next week's dates
  const today = new Date();
  const nextWeekStart = startOfWeek(addDays(today, 7), { weekStartsOn: 1 }); // Start from Monday
  const nextWeekEnd = endOfWeek(addDays(today, 7), { weekStartsOn: 1 }); // End on Sunday

  return (
    <div className="schedule-modal">
      <div className="schedule-modal-content">
        <div className="schedule-modal-header">
          <h3>Select Schedule</h3>
          <button className="close-btn" onClick={onClose}>
            <i className="fa fa-times"></i>
          </button>
        </div>

        <div className="schedule-container">
          {/* Weekly Schedule */}
          <div className="weekly-schedule">
            {loading ? (
              <div className="loading">Loading schedule...</div>
            ) : (
              <div className="calendar-container">
                <FullCalendar
                  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                  initialView="timeGridWeek"
                  events={events}
                  initialDate={nextWeekStart}
                  validRange={{
                    start: nextWeekStart,
                    end: nextWeekEnd,
                  }}
                  height="auto"
                  eventTimeFormat={{
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  }}
                  slotMinTime="07:00:00"
                  slotMaxTime="21:00:00"
                  allDaySlot={false}
                  slotDuration="01:00:00"
                  expandRows={true}
                  weekends={true}
                  nowIndicator={true}
                  selectMirror={true}
                  dayMaxEvents={true}
                  eventDisplay="block"
                  headerToolbar={{
                    left: "",
                    center: "title",
                    right: "",
                  }}
                  titleFormat={() => "Lịch học tuần tới hiện tại của bạn"}
                  navLinks={false}
                  editable={false}
                  selectable={false}
                  firstDay={1}
                  eventContent={(eventInfo) => {
                    return {
                      html: `
                        <div class="fc-event-main-content">
                          <div class="fc-event-title" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${eventInfo.event.title}</div>
                        </div>
                      `,
                    };
                  }}
                  eventDidMount={(info) => {
                    const { event } = info;
                    const { timeStart, timeEnd } = event.extendedProps;

                    info.el.setAttribute(
                      "data-tooltip",
                      `${event.title}\n${timeStart} - ${timeEnd}`
                    );
                  }}
                />
              </div>
            )}
          </div>

          {/* Selection Form */}
          <div className="selection-form">
            <div className="time-selection">
              <div className="form-group">
                <label>Start Time:</label>
                <Select
                  value={timeStart}
                  onChange={handleTimeStartChange}
                  options={timeOptions}
                  isSearchable={false}
                  className="time-select"
                  classNamePrefix="time-select"
                />
              </div>

              <div className="form-group">
                <label>End Time:</label>
                <div className="time-display">{timeEnd.label}</div>
              </div>
            </div>

            <div className="days-selection">
              <label>Select Days (Max 3):</label>
              <div className="days-grid">
                {DAYS_OF_WEEK.map((day) => (
                  <div
                    key={day.id}
                    className={`day-item ${selectedDays.includes(day.id) ? "selected" : ""}`}
                    onClick={() => handleDayToggle(day.id)}
                  >
                    {day.label}
                  </div>
                ))}
              </div>
            </div>

            <div className="submit-section">
              <button
                className="submit-btn"
                onClick={handleSubmit}
                disabled={selectedDays.length === 0}
              >
                Xác nhận lịch học và tiến hành thanh toán
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleSelectionModal;
