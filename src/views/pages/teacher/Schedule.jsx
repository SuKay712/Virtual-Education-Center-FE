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
import PlanCard from "../../../components/plan-card/PlanCard";
import "./Schedule.scss";
import DatePicker from "react-datepicker";
import { FaCalendarAlt } from "react-icons/fa";
import { parse } from "date-fns";

function TeacherSchedule() {
  const [events, setEvents] = useState([]);
  const [waitingClasses, setWaitingClasses] = useState([]);
  const [confirmedClasses, setConfirmedClasses] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showFreeTimeModal, setShowFreeTimeModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [freeTimeSelection, setFreeTimeSelection] = useState(null);
  const [editingFreeTime, setEditingFreeTime] = useState(null);
  const [filteredConfirmedClassRows, setFilteredConfirmedClassRows] = useState(
    []
  );
  const userInfo = JSON.parse(localStorage.getItem("user_info")) || {};
  const isTeacher = userInfo.role === "Teacher";

  const calculateAge = (birthdate) => {
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

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

      // Tách riêng class có booking status 1 và class chưa có booking status 1
      const confirmedClasses = Array.from(classMap.values()).filter(
        ({ bookings }) => bookings.some((booking) => booking.status === 1)
      );

      const waitingClasses = Array.from(classMap.values()).filter(
        ({ classData }) =>
          classData.bookings.every(
            (booking) => booking.status !== 1 && booking.status !== 3
          )
      );
      // Tạo events cho calendar từ confirmed classes
      const classEvents = confirmedClasses.map(({ classData }) => {
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
      setWaitingClasses(waitingClasses);
      setConfirmedClasses(confirmedClasses);
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
    setFreeTimeSelection({
      start: selectInfo.start,
      end: selectInfo.end,
    });
    setEditingFreeTime(null);
    setShowFreeTimeModal(true);
  };

  const handleCreateFreeTime = async (formData) => {
    try {
      console.log(
        "formData.time_start before formatDateTime:",
        formData.time_start
      ); // Debug log
      console.log(
        "formData.time_end before formatDateTime:",
        formData.time_end
      ); // Debug log

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
      setFreeTimeSelection(null);
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

  const updateBookingStatus = async (bookingId, status) => {
    try {
      await teacherAPI.updateBookingStatus(bookingId, { status: status });
      if (status === 1) {
        toast.success("Đã chấp nhận lịch học");
      } else {
        toast.success("Đã từ chối lịch học");
      }
      fetchData();
    } catch (error) {
      toast.error("Không thể chấp nhận lịch học");
    }
  };

  const isSameDate = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  useEffect(() => {
    // Only filter if selectedDate is a valid Date object
    if (!selectedDate || isNaN(selectedDate.getTime())) {
      setFilteredConfirmedClassRows([]); // Clear the list if selected date is not valid
      return;
    }

    const filteredClasses = confirmedClasses.filter((plan) => {
      const planDate = parse(
        plan.classData.time_start,
        "HH:mm dd/MM/yyyy",
        new Date()
      );
      // Ensure the parsed date is valid before comparing
      if (isNaN(planDate.getTime())) {
        return false; // Exclude items with invalid date strings
      }
      return isSameDate(planDate, selectedDate);
    });

    // Chia plans thành các nhóm 2 để render 2 card mỗi hàng
    const planRows = [];
    for (let i = 0; i < filteredClasses.length; i += 2) {
      planRows.push(filteredClasses.slice(i, i + 2));
    }
    setFilteredConfirmedClassRows(planRows);
  }, [confirmedClasses, selectedDate]); // Re-run when confirmedClasses or selectedDate changes

  console.log("events", waitingClasses);
  return (
    <div className="teacher-schedule-page">
      <div className="teacher-schedule-container">
        <div className="teacher-calendar-container">
          <h2 className="teacher-schedule-header">My Schedule</h2>
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
        </div>
        <div className="plan-rows">
          <div className="d-flex gap-3 align-items-center">
            <h2>My Plan</h2>
            <div className="react-datepicker-wrapper-wrap">
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
              />
              <FaCalendarAlt />
            </div>
          </div>
          {filteredConfirmedClassRows.length > 0 ? (
            filteredConfirmedClassRows.map((row, index) => (
              <div key={index} className="d-flex gap-5 mb-4">
                {row.map(({ classData }) => (
                  <PlanCard
                    key={classData.id}
                    plan={classData} // Pass classData as plan prop
                    onClick={() => {
                      /* Handle PlanCard click if needed */
                    }}
                  />
                ))}
                {row.length === 1 && <div className="flex-fill ms-4"></div>}
              </div>
            ))
          ) : (
            <p>No confirmed classes found.</p>
          )}
        </div>
      </div>
      <div className="teacher-bookings-container">
        <h2>Waiting bookings</h2>
        <div className="booking-list">
          {waitingClasses.map(({ classData, bookings }) => (
            <div key={classData.id} className="booking-item">
              <div className="booking-header">
                <h3>{classData.lecture.name}</h3>
              </div>
              <div className="booking-details">
                <div>
                  <strong>Khóa học:</strong> {classData.lecture.course.name}
                </div>
                <div className="student-info">
                  <strong>Học viên:</strong>
                  <span className="student-name">
                    {classData.student.name}
                    <i
                      className={`fas fa-${classData.student.gender === "female" ? "venus" : "mars"}`}
                    ></i>
                    <span className="student-age">
                      {calculateAge(classData.student.birthday)} tuổi
                    </span>
                  </span>
                </div>
              </div>
              <div className="booking-time">
                <div className="time-item">
                  <strong>Thời gian:</strong>
                  {new Date(
                    classData.time_start.replace(
                      /(\d{2}):(\d{2}) (\d{2})\/(\d{2})\/(\d{4})/,
                      "$5-$4-$3T$1:$2:00"
                    )
                  ).toLocaleString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {" - "}
                  {new Date(
                    classData.time_end.replace(
                      /(\d{2}):(\d{2}) (\d{2})\/(\d{2})\/(\d{4})/,
                      "$5-$4-$3T$1:$2:00"
                    )
                  ).toLocaleString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  {new Date(
                    classData.time_start.replace(
                      /(\d{2}):(\d{2}) (\d{2})\/(\d{2})\/(\d{4})/,
                      "$5-$4-$3T$1:$2:00"
                    )
                  ).toLocaleString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </div>
              </div>
              <div className="booking-actions">
                <button
                  className="accept-btn"
                  onClick={() => updateBookingStatus(bookings[0].id, 1)}
                >
                  Chấp nhận
                </button>
                <button
                  className="reject-btn"
                  onClick={() => updateBookingStatus(bookings[0].id, 2)}
                >
                  Từ chối
                </button>
              </div>
            </div>
          ))}
        </div>
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
          setFreeTimeSelection(null);
          setEditingFreeTime(null);
        }}
        onSubmit={handleCreateFreeTime}
        initialDate={freeTimeSelection}
        editingFreeTime={editingFreeTime}
      />
    </div>
  );
}

export default TeacherSchedule;
