import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import viLocale from "@fullcalendar/core/locales/vi";
import { toast } from "react-toastify";
import teacherAPI from "../../../api/teacherAPI";
import { formatDateTime } from "../../../utils/dateFormat";
import ClassModal from "../../../components/modal/ClassModal";
import FreeTimeModal from "../../../components/modal/FreeTimeModal";
import "./Schedule.scss";

function TeacherSchedule() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showFreeTimeModal, setShowFreeTimeModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [editingFreeTime, setEditingFreeTime] = useState(null);
  const userInfo = JSON.parse(localStorage.getItem("user_info")) || {};
  const isTeacher = userInfo.role === "Teacher";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [bookingsRes, freeTimesRes] = await Promise.all([
        teacherAPI.getBookings(),
        teacherAPI.getFreeTimes(),
      ]);

      console.log("All free times from API:", freeTimesRes.data); // Debug log

      // Create a map to store unique classes with their bookings
      const classMap = new Map();

      bookingsRes.data.forEach((booking) => {
        const classData = booking.classEntity;
        if (!classMap.has(classData.id)) {
          classMap.set(classData.id, {
            classData,
            bookings: [],
          });
        }
        classMap.get(classData.id).bookings.push(booking);
      });

      const classEvents = Array.from(classMap.values()).map(({ classData }) => {
        // Parse the time strings to Date objects
        const startTime = new Date(
          classData.time_start.replace(
            /(\d{2}):(\d{2}) (\d{2})\/(\d{2})\/(\d{4})/,
            "$5-$4-$3T$1:$2:00"
          )
        );
        const endTime = new Date(
          classData.time_end.replace(
            /(\d{2}):(\d{2}) (\d{2})\/(\d{2})\/(\d{4})/,
            "$5-$4-$3T$1:$2:00"
          )
        );

        return {
          id: classData.id,
          title: classData.lecture.name,
          start: startTime,
          end: endTime,
          extendedProps: classData,
          backgroundColor: "#3788d8", // Blue color for classes
          borderColor: "#3788d8",
        };
      });

      const freeTimeEvents = freeTimesRes.data.map((freeTime) => {
        console.log("Processing free time:", freeTime); // Debug log
        const startTime = new Date(
          freeTime.time_start.replace(
            /(\d{2}):(\d{2}) (\d{2})\/(\d{2})\/(\d{4})/,
            "$5-$4-$3T$1:$2:00"
          )
        );
        const endTime = new Date(
          freeTime.time_end.replace(
            /(\d{2}):(\d{2}) (\d{2})\/(\d{2})\/(\d{4})/,
            "$5-$4-$3T$1:$2:00"
          )
        );

        return {
          id: `free-${freeTime.id}`,
          title: "Thời gian rảnh",
          start: startTime,
          end: endTime,
          extendedProps: freeTime,
          backgroundColor: "#4CAF50", // Green color for free times
          borderColor: "#4CAF50",
        };
      });

      console.log("Free time events:", freeTimeEvents); // Debug log
      setEvents([...classEvents, ...freeTimeEvents]);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load schedule");
    }
  };

  const handleEventClick = (info) => {
    if (info.event.id.startsWith("free-")) {
      // Handle free time click
      const freeTimeId = parseInt(info.event.id.replace("free-", ""));
      const freeTime = info.event.extendedProps;
      console.log("Clicked free time:", freeTime); // Debug log
      setEditingFreeTime({
        id: freeTime.id, // Use the ID directly from the freeTime object
        time_start: new Date(
          freeTime.time_start.replace(
            /(\d{2}):(\d{2}) (\d{2})\/(\d{2})\/(\d{4})/,
            "$5-$4-$3T$1:$2:00"
          )
        ),
        time_end: new Date(
          freeTime.time_end.replace(
            /(\d{2}):(\d{2}) (\d{2})\/(\d{2})\/(\d{4})/,
            "$5-$4-$3T$1:$2:00"
          )
        ),
        title: freeTime.title,
        note: freeTime.note,
      });
      setShowFreeTimeModal(true);
    } else {
      // Handle class click
      setSelectedEvent(info.event.extendedProps);
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
  };

  const handleDateSelect = (selectInfo) => {
    setSelectedDate({
      start: selectInfo.start,
      end: selectInfo.end,
    });
    setEditingFreeTime(null);
    setShowFreeTimeModal(true);
  };

  const handleCreateFreeTime = async (formData) => {
    try {
      const formattedData = {
        time_start: formatDateTime(formData.time_start),
        time_end: formatDateTime(formData.time_end),
        title: formData.title,
        note: formData.note,
      };

      if (editingFreeTime) {
        await teacherAPI.updateFreeTime(editingFreeTime.id, formattedData);
        toast.success("Cập nhật lịch rảnh thành công");
      } else {
        await teacherAPI.createFreeTime(formattedData);
        toast.success("Tạo lịch rảnh thành công");
      }

      setShowFreeTimeModal(false);
      setSelectedDate(null);
      setEditingFreeTime(null);
      fetchData();
    } catch (error) {
      toast.error(
        editingFreeTime
          ? "Không thể cập nhật lịch rảnh"
          : "Không thể tạo lịch rảnh"
      );
    }
  };

  return (
    <div className="teacher-schedule-container">
      <div className="teacher-calendar-container">
        <div className="calendar-header">
          <button
            className="create-free-time-btn"
            onClick={() => {
              setEditingFreeTime(null);
              setShowFreeTimeModal(true);
            }}
          >
            Tạo lịch rảnh
          </button>
        </div>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          locale={viLocale}
          events={events}
          eventClick={handleEventClick}
          selectable={true}
          select={handleDateSelect}
          height="auto"
          slotMinTime="06:00:00"
          slotMaxTime="22:00:00"
          allDaySlot={false}
          slotDuration="00:30:00"
          slotLabelInterval="01:00"
          slotLabelFormat={{
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }}
          eventTimeFormat={{
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }}
        />
      </div>

      {showModal && (
        <ClassModal
          info={selectedEvent}
          handleCloseModal={handleCloseModal}
          theme={isTeacher ? "cool" : "default"}
        />
      )}

      <FreeTimeModal
        isOpen={showFreeTimeModal}
        onClose={() => {
          setShowFreeTimeModal(false);
          setSelectedDate(null);
          setEditingFreeTime(null);
        }}
        onSubmit={handleCreateFreeTime}
        initialDate={selectedDate}
        editingFreeTime={editingFreeTime}
      />
    </div>
  );
}

export default TeacherSchedule;
