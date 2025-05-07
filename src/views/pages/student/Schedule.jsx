import "./Schedule.scss";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import ClassModal from "../../../components/modal/ClassModal";
import { useEffect, useState } from "react";
import studentAPI from "../../../api/studentAPI";

function Schedule({ props }) {
  const [isModalOpen, setIsModalOpen] = useState(false); // Trạng thái mở modal
  const [selectedEvent, setSelectedEvent] = useState(null); // Trạng thái lưu sự kiện được chọn
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await studentAPI.getClasses();
      setClasses(response.data);
    } catch (error) {
      console.error("Error fetching classes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleEventClick = (info) => {
    setSelectedEvent(info.event.extendedProps); // Lưu thông tin sự kiện được chọn
    setIsModalOpen(true); // Mở modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Đóng modal
    setSelectedEvent(null); // Xóa thông tin sự kiện được chọn
  };

  // Các sự kiện mẫu
  const events = classes.map((plan) => ({
    id: plan.id,
    title: plan.lecture.name,
    start: plan.time_start,
    end: plan.time_end,
    extendedProps: plan,
  }));

  return (
    <div className="schedule">
      <h2>My Schedule</h2>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={events}
        editable={true}
        selectable={true}
        eventClick={handleEventClick}
        height="auto"
        eventTimeFormat={{
          hour: "2-digit",
          minute: "2-digit",
          hour12: false, // Sử dụng đồng hồ 24 giờ
        }}
      />
      {isModalOpen && (
        <ClassModal info={selectedEvent} handleCloseModal={handleCloseModal} />
      )}
    </div>
  );
}

export default Schedule;
