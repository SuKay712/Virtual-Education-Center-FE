import "./Schedule.scss";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import ClassModal from "../../../components/modal/ClassModal";
import { useState } from "react";

function Schedule({ props }) {
  const [isModalOpen, setIsModalOpen] = useState(false); // Trạng thái mở modal
  const [selectedEvent, setSelectedEvent] = useState(null); // Trạng thái lưu sự kiện được chọn

  const handleEventClick = (info) => {
    setSelectedEvent(info.event.extendedProps); // Lưu thông tin sự kiện được chọn
    setIsModalOpen(true); // Mở modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Đóng modal
    setSelectedEvent(null); // Xóa thông tin sự kiện được chọn
  };

  const plans = [
    {
      id: 3,
      lecture: {
        id: 2,
        name: 1,
        student: {
          id: 1,
          name: "Khoi",
        },
      },
      name: "Reading - Beginner Topic 1",
      bookings: [
        {
          id: 1,
          teacher: {
            id: 1,
            name: "Kay",
          },
        },
      ],
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
        student: {
          id: 1,
          name: "Khoi",
        },
      },
      name: "Reading - Beginner Topic 1",
      bookings: [
        {
          id: 1,
          teacher: {
            id: 1,
            name: "Kay",
          },
        },
      ],
      icon: "book-icon",
      time_start: "10:20 19/04/2025",
      time_end: "11:20 19/04/2025",
      rating: 5,
      comment: "",
      meeting_id: 1,
      created_at: "07:20 18/04/2025",
      updated_at: "07:20 18/04/2025",
    },
  ];
  // Các sự kiện mẫu
  const events = plans.map((plan) => ({
    id: plan.id,
    title: plan.name,
    start: moment(plan.time_start, "HH:mm DD/MM/YYYY").toDate(), // Chuyển đổi sang đối tượng Date
    end: moment(plan.time_end, "HH:mm DD/MM/YYYY").toDate(),
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
