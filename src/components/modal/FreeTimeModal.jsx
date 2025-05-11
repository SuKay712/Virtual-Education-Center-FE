import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import teacherAPI from "../../api/teacherAPI";
import "./FreeTimeModal.scss";

// Set the app element for react-modal
Modal.setAppElement("#root");

const DATE_FORMAT = {
  time: "HH:mm",
  date: "dd/MM/yyyy",
  full: "HH:mm dd/MM/yyyy",
};

const TIME_INTERVALS = 30;

const initialFormData = () => ({
  time_start: null,
  time_end: null,
  title: "",
  note: "",
});

const getInitialFormData = (editingFreeTime, initialDate) => {
  if (editingFreeTime) {
    return {
      time_start: editingFreeTime.time_start,
      time_end: editingFreeTime.time_end,
      title: editingFreeTime.title || "",
      note: editingFreeTime.note || "",
    };
  }
  if (initialDate) {
    return {
      time_start: initialDate.start,
      time_end: initialDate.end,
      title: "",
      note: "",
    };
  }
  return initialFormData();
};

const FreeTimeModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialDate,
  editingFreeTime,
}) => {
  const [formData, setFormData] = useState(initialFormData());
  const [errors, setErrors] = useState({});
  const [freeTimes, setFreeTimes] = useState([]);
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  useEffect(() => {
    setFormData(getInitialFormData(editingFreeTime, initialDate));
    setErrors({});
  }, [isOpen, initialDate, editingFreeTime]);

  const fetchData = async () => {
    try {
      const [freeTimesRes, bookingsRes] = await Promise.all([
        teacherAPI.getFreeTimes(),
        teacherAPI.getBookings(),
      ]);
      console.log("Free times in modal:", freeTimesRes.data);
      setFreeTimes(freeTimesRes.data);
      setClasses(extractUniqueClasses(bookingsRes.data));
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Không thể tải dữ liệu");
    }
  };

  const extractUniqueClasses = (bookings) => {
    const classMap = new Map();
    bookings.forEach((booking) => {
      const classData = booking.classEntity;
      if (!classMap.has(classData.id)) {
        classMap.set(classData.id, classData);
      }
    });
    return Array.from(classMap.values());
  };

  const parseAPIDate = (dateStr) => {
    if (!dateStr) return null;
    const [time, date] = dateStr.split(" ");
    const [hours, minutes] = time.split(":");
    const [day, month, year] = date.split("/");

    // Create date with explicit timezone
    const parsedDate = new Date(year, month - 1, day, hours, minutes);
    console.log("Parsed date:", {
      input: dateStr,
      output: parsedDate.toLocaleString(),
      timestamp: parsedDate.getTime(),
    });
    return parsedDate;
  };

  const checkTimeOverlap = (start, end, existingStart, existingEnd) => {
    if (!start || !end || !existingStart || !existingEnd) return false;

    console.log("Comparing times:", {
      newStart: start.toLocaleString(),
      newEnd: end.toLocaleString(),
      existingStart: existingStart.toLocaleString(),
      existingEnd: existingEnd.toLocaleString(),
    });

    // Check if the new time range overlaps with the existing time range
    const isOverlapping =
      (start < existingEnd && end > existingStart) || // New time starts before existing ends and ends after existing starts
      (start >= existingStart && start < existingEnd) || // New time starts during existing time
      (end > existingStart && end <= existingEnd); // New time ends during existing time

    console.log("Overlap check result:", isOverlapping);
    return isOverlapping;
  };

  const isTimeOverlapping = (start, end) => {
    if (!start || !end) return false;

    console.log("Checking overlap for:", {
      start: start.toLocaleString(),
      end: end.toLocaleString(),
    });

    // Check against other free times
    const hasOverlappingFreeTime = freeTimes
      .map((freeTime) => {
        console.log("Comparing with free time:", {
          id: freeTime.id,
          start: freeTime.time_start,
          end: freeTime.time_end,
        });

        if (editingFreeTime && freeTime.id === editingFreeTime.id) {
          console.log("Skipping current editing free time");
          return false;
        }

        const existingStart = parseAPIDate(freeTime.time_start);
        const existingEnd = parseAPIDate(freeTime.time_end);
        const isOverlapping = checkTimeOverlap(
          start,
          end,
          existingStart,
          existingEnd
        );

        console.log("Overlap result:", isOverlapping);
        return isOverlapping;
      })
      .some((isOverlapping) => isOverlapping);

    console.log("Final overlap result:", hasOverlappingFreeTime);

    if (hasOverlappingFreeTime) return true;

    // Check against classes
    const hasOverlappingClass = classes.some((classData) => {
      const classStart = parseAPIDate(classData.time_start);
      const classEnd = parseAPIDate(classData.time_end);
      return checkTimeOverlap(start, end, classStart, classEnd);
    });

    return hasOverlappingClass;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.time_start) {
      newErrors.time_start = "Vui lòng chọn thời gian bắt đầu";
    }
    if (!formData.time_end) {
      newErrors.time_end = "Vui lòng chọn thời gian kết thúc";
    }
    if (
      formData.time_start &&
      formData.time_end &&
      formData.time_start >= formData.time_end
    ) {
      newErrors.time_end = "Thời gian kết thúc phải sau thời gian bắt đầu";
    }
    if (isTimeOverlapping(formData.time_start, formData.time_end)) {
      newErrors.time_start =
        "Khung giờ này đã có lịch học hoặc đã được đăng ký trước đó";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      try {
        onSubmit(formData);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const renderDatePicker = (field, label) => (
    <div className="form-group">
      <label>{label}:</label>
      <DatePicker
        selected={formData[field]}
        onChange={(date) => handleInputChange(field, date)}
        showTimeSelect
        timeFormat={DATE_FORMAT.time}
        timeIntervals={TIME_INTERVALS}
        timeCaption="Thời gian"
        dateFormat={DATE_FORMAT.full}
        className={errors[field] ? "error" : ""}
      />
      {errors[field] && <span className="error-message">{errors[field]}</span>}
    </div>
  );

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Tạo lịch rảnh"
      className="free-time-modal"
      overlayClassName="free-time-modal-overlay"
      shouldCloseOnOverlayClick={true}
      shouldCloseOnEsc={true}
    >
      <div className="free-time-modal-content">
        <h2>{editingFreeTime ? "Chỉnh sửa lịch rảnh" : "Tạo lịch rảnh"}</h2>
        <form onSubmit={handleSubmit}>
          {renderDatePicker("time_start", "Thời gian bắt đầu")}
          {renderDatePicker("time_end", "Thời gian kết thúc")}

          <div className="form-group">
            <label>Tiêu đề:</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Nhập tiêu đề (không bắt buộc)"
            />
          </div>

          <div className="form-group">
            <label>Ghi chú:</label>
            <textarea
              value={formData.note}
              onChange={(e) => handleInputChange("note", e.target.value)}
              placeholder="Nhập ghi chú (không bắt buộc)"
            />
          </div>

          <div className="modal-buttons">
            <button type="button" onClick={onClose} className="cancel-button">
              Hủy
            </button>
            <button
              type="submit"
              className="submit-button"
              disabled={isLoading}
            >
              {isLoading
                ? "Đang xử lý..."
                : editingFreeTime
                  ? "Cập nhật"
                  : "Tạo"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default FreeTimeModal;
