import React, { useState, useEffect } from "react";
import {
  Table,
  Tag,
  Select,
  Space,
  message,
  DatePicker,
  Input,
  Row,
  Col,
} from "antd";
import adminAPI from "../../../api/adminAPI";
import moment from "moment";
import "./AdminPages.scss";
import { ClockCircleOutlined } from "@ant-design/icons";

const { Search } = Input;
const { RangePicker } = DatePicker;

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [dateRange, setDateRange] = useState(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getBookings();
      setBookings(response.data);
      setFilteredBookings(response.data);
    } catch (error) {
      message.error("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await adminAPI.updateBooking(bookingId, { status: newStatus });
      message.success("Booking status updated successfully");
      fetchBookings();
    } catch (error) {
      message.error("Failed to update booking status");
    }
  };

  const getStatusTag = (status) => {
    const statusMap = {
      0: { color: "warning", text: "Pending" },
      1: { color: "processing", text: "Approved" },
      2: { color: "error", text: "Cancelled" },
      3: { color: "success", text: "Completed" },
    };
    const { color, text } = statusMap[status] || {
      color: "default",
      text: "Unknown",
    };
    return <Tag color={color}>{text}</Tag>;
  };

  const getStatusColor = (status) => {
    const statusMap = {
      0: "#faad14", // warning
      1: "#1890ff", // processing
      2: "#ff4d4f", // error
      3: "#52c41a", // success
    };
    return statusMap[status] || "#d9d9d9";
  };

  const handleSearch = (value) => {
    setSearchText(value);
    filterBookings(value, dateRange);
  };

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
    filterBookings(searchText, dates);
  };

  const filterBookings = (text, dates) => {
    let filtered = [...bookings];

    // Filter by search text
    if (text) {
      filtered = filtered.filter(
        (booking) =>
          booking.classEntity.student.name
            .toLowerCase()
            .includes(text.toLowerCase()) ||
          booking.teacher.name.toLowerCase().includes(text.toLowerCase()) ||
          booking.classEntity.lecture.name
            .toLowerCase()
            .includes(text.toLowerCase())
      );
    }

    // Filter by date range
    if (dates && dates[0] && dates[1]) {
      filtered = filtered.filter((booking) => {
        const bookingDate = moment(
          booking.classEntity.time_start,
          "HH:mm DD/MM/YYYY"
        );
        return bookingDate.isBetween(dates[0], dates[1], "day", "[]");
      });
    }

    setFilteredBookings(filtered);
  };

  const statusColors = {
    0: { bg: "#fffbe6", color: "#faad14", text: "Pending" },
    1: { bg: "#e6f7ff", color: "#1890ff", text: "Approved" },
    2: { bg: "#fff1f0", color: "#ff4d4f", text: "Cancelled" },
    3: { bg: "#f6ffed", color: "#52c41a", text: "Completed" },
  };

  const statusOptions = [
    { value: 0 },
    { value: 1 },
    { value: 2 },
    { value: 3 },
  ];

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
      align: "center",
    },
    {
      title: "Student",
      dataIndex: ["classEntity", "student", "name"],
      key: "student",
      width: 150,
      align: "center",
    },
    {
      title: "Teacher",
      dataIndex: ["teacher", "name"],
      key: "teacher",
      width: 150,
      align: "center",
    },
    {
      title: "Lecture",
      dataIndex: ["classEntity", "lecture", "name"],
      key: "lecture",
      width: 200,
    },
    {
      title: "Thời gian lớp học",
      key: "classTime",
      width: 220,
      align: "center",
      render: (_, record) => {
        const startTime = record.classEntity.time_start.split(" ")[0];
        const endTime = record.classEntity.time_end.split(" ")[0];
        const date = record.classEntity.time_start.split(" ")[1];
        return (
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
            }}
          >
            <ClockCircleOutlined style={{ color: "#bfbfbf", marginRight: 4 }} />
            {`${startTime} - ${endTime}, ${date}`}
          </span>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 170,
      align: "center",
      render: (status, record) => {
        const { bg, color, text } = statusColors[status] || {};
        return (
          <div
            style={{
              background: bg,
              color,
              borderRadius: 4,
              padding: "2px 8px",
              textAlign: "center",
              display: "inline-block",
              minWidth: 110,
            }}
          >
            <Select
              value={status}
              optionLabelProp="label"
              bordered={false}
              dropdownStyle={{ minWidth: 120 }}
              style={{
                background: "transparent",
                color,
                fontWeight: 600,
                width: "100%",
                textAlign: "center",
              }}
              onChange={(value) => handleStatusChange(record.id, value)}
              options={statusOptions.map((opt) => ({
                value: opt.value,
                label: (
                  <div
                    style={{
                      background: statusColors[opt.value].bg,
                      color: statusColors[opt.value].color,
                      borderRadius: 4,
                      padding: "2px 8px",
                      textAlign: "center",
                      fontWeight: 600,
                    }}
                  >
                    {statusColors[opt.value].text}
                  </div>
                ),
              }))}
            />
          </div>
        );
      },
    },
  ];

  return (
    <div className="admin-bookings">
      <div className="admin-page-header">
        <h2>Booking Management</h2>
      </div>
      <div className="admin-page-content">
        <Row
          gutter={[16, 16]}
          className="filter-section"
          style={{ marginBottom: "16px" }}
        >
          <Col xs={24} sm={12} md={8} lg={6}>
            <Search
              placeholder="Search by name..."
              allowClear
              onSearch={handleSearch}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <RangePicker
              onChange={handleDateRangeChange}
              style={{ width: "100%" }}
            />
          </Col>
        </Row>
        <Table
          columns={columns}
          dataSource={filteredBookings}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1000 }}
        />
      </div>
    </div>
  );
};

export default BookingManagement;
