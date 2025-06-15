import React, { useState, useEffect } from "react";
import {
  Table,
  DatePicker,
  Select,
  Space,
  Tag,
  Typography,
  Card,
  Button,
  Modal,
  Form,
  TimePicker,
  Row,
  Col,
  Divider,
  Input,
} from "antd";
import {
  CalendarOutlined,
  EditOutlined,
  ClockCircleOutlined,
  UserOutlined,
  BookOutlined,
} from "@ant-design/icons";
import "./AdminPages.scss";
import adminAPI from "../../../api/adminAPI";
import { toast } from "react-toastify";
import moment from "moment";
import { parse } from "date-fns";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
const { RangePicker } = DatePicker;
const { Option } = Select;
const { Text } = Typography;

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

const AdminSchedule = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState([]);
  const [bookingStatus, setBookingStatus] = useState("all");
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [availableTeachers, setAvailableTeachers] = useState([]);
  const [allFreeTimes, setAllFreeTimes] = useState([]);
  const [form] = Form.useForm();

  const columns = [
    {
      title: "Thời gian",
      dataIndex: "time_start",
      key: "time",
      width: "15%",
      render: (time_start, record) => {
        // Parse time_start và time_end từ format "HH:mm DD/MM/YYYY"
        const [startTime, startDate] = time_start.split(" ");
        const [endTime, endDate] = record.time_end.split(" ");
        const [day, month, year] = startDate.split("/");

        // Tạo moment object với format đúng
        const classStartTime = moment(
          `${day}/${month}/${year} ${startTime}`,
          "DD/MM/YYYY HH:mm"
        );
        const classEndTime = moment(
          `${day}/${month}/${year} ${endTime}`,
          "DD/MM/YYYY HH:mm"
        );

        return (
          <Space direction="vertical" size="small">
            <Text
              strong
            >{`${classStartTime.format("HH:mm")} - ${classEndTime.format("HH:mm")}`}</Text>
            <Text type="secondary">{classStartTime.format("DD/MM/YYYY")}</Text>
          </Space>
        );
      },
    },
    {
      title: "Khóa học",
      dataIndex: ["lecture", "course", "name"],
      key: "course",
      width: "20%",
      ellipsis: true,
    },
    {
      title: "Bài giảng",
      dataIndex: ["lecture", "name"],
      key: "lecture",
      width: "20%",
      ellipsis: true,
    },
    {
      title: "Học viên",
      dataIndex: ["student", "name"],
      key: "student",
      width: "15%",
      ellipsis: true,
      render: (name, record) => name || "Chưa có học viên",
    },
    {
      title: "Trạng thái",
      key: "status",
      width: "15%",
      align: "center",
      render: (_, record) => {
        if (!record.bookings || record.bookings.length === 0) {
          return <span style={{ color: "#ff4d4f" }}>Đang trống</span>;
        }

        const hasConfirmed = record.bookings.some((b) => b.status === 1);
        const hasPending = record.bookings.some((b) => b.status === 2);

        if (hasConfirmed) {
          return <span style={{ color: "#52c41a" }}>Đã nhận lớp</span>;
        }
        if (hasPending) {
          return <span style={{ color: "#faad14" }}>Đang chờ nhận lớp</span>;
        }

        return <span style={{ color: "#ff4d4f" }}>Đang trống</span>;
      },
    },
    {
      title: "Thao tác",
      key: "actions",
      width: "10%",
      align: "center",
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() => handleEdit(record)}
        >
          Chỉnh sửa
        </Button>
      ),
    },
  ];

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getClasses();
      setClasses(response.data);
    } catch (error) {
      console.error("Error fetching classes:", error);
      toast.error("Không thể tải danh sách lớp học");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleEdit = async (classData) => {
    setSelectedClass(classData);
    form.resetFields();
    setIsEditModalVisible(true);

    // Fetch free times
    try {
      const response = await adminAPI.getFreeTimes();
      console.log("Free times response:", response.data);
      setAllFreeTimes(response.data);
      setAvailableTeachers([]); // clear khi chưa chọn thời gian
    } catch (error) {
      console.error("Error fetching free times:", error);
      setAllFreeTimes([]);
      setAvailableTeachers([]);
    }
  };

  const handleEditModalOk = async () => {
    try {
      const values = await form.validateFields();
      const teacherIds = values.teacherIds
        ? values.teacherIds.map((id) => Number(id))
        : [];

      let startDateTime, endDateTime;

      // Nếu lớp đã có giáo viên nhận thì lấy từ selectedClass
      if (selectedClass.bookings?.some((b) => b.status === 1)) {
        startDateTime = moment(selectedClass.time_start, "HH:mm DD/MM/YYYY");
        endDateTime = moment(selectedClass.time_end, "HH:mm DD/MM/YYYY");
      } else {
        startDateTime = values.edit_time_start;
        endDateTime = values.edit_time_end;
        if (typeof startDateTime === "string") {
          startDateTime = moment(startDateTime, "HH:mm DD/MM/YYYY");
        }
        if (typeof endDateTime === "string") {
          endDateTime = moment(endDateTime, "HH:mm DD/MM/YYYY");
        }
      }

      if (!startDateTime || !endDateTime) {
        toast.error("Vui lòng chọn thời gian bắt đầu và kết thúc!");
        return;
      }

      const updateData = {
        time_start: `${startDateTime.format("HH:mm DD/MM/YYYY")}`,
        time_end: `${endDateTime.format("HH:mm DD/MM/YYYY")}`,
        teacherIds: teacherIds,
        meeting_url: values.meeting_url,
      };

      try {
        const response = await adminAPI.updateClass(
          selectedClass.id,
          updateData
        );
        console.log("Update response:", response);
        toast.success("Cập nhật lớp học thành công");
        setIsEditModalVisible(false);
        fetchClasses();
      } catch (error) {
        console.error("Error response data:", error.response?.data);
        console.error("Error response status:", error.response?.status);
        console.error("Error response headers:", error.response?.headers);

        // Hiển thị thông báo lỗi cụ thể từ server
        const errorMessage =
          error.response?.data?.message || "Không thể cập nhật lớp học";
        if (errorMessage.includes("Student has another class scheduled")) {
          toast.error("Học viên đã có lớp học khác trong khoảng thời gian này");
        } else {
          toast.error(errorMessage);
        }
        throw error;
      }
    } catch (error) {
      console.error("Error updating class:", error);
      // Không cần hiển thị toast ở đây vì đã hiển thị ở trên
    }
  };

  const handleEditModalCancel = () => {
    setIsEditModalVisible(false);
    setSelectedClass(null);
    form.resetFields();
  };

  const handleDateRangeChange = (dates) => {
    if (dates) {
      setDateRange(dates);
    } else {
      setDateRange([]);
    }
  };

  const handleBookingStatusChange = (value) => {
    setBookingStatus(value);
  };

  const getFilteredClasses = () => {
    let filtered = [...classes];

    // Filter by date range
    if (dateRange.length === 2) {
      const startDate = dateRange[0].startOf("day");
      const endDate = dateRange[1].endOf("day");

      filtered = filtered.filter((cls) => {
        // Parse time_start từ format "HH:mm DD/MM/YYYY"
        const [time, date] = cls.time_start.split(" ");
        const [day, month, year] = date.split("/");

        // Tạo moment object với format đúng
        const classTime = moment(
          `${day}/${month}/${year} ${time}`,
          "DD/MM/YYYY HH:mm"
        );

        // So sánh ngày tháng (bỏ qua giờ phút)
        const classDate = classTime.format("DD/MM/YYYY");
        const startDateStr = startDate.format("DD/MM/YYYY");
        const endDateStr = endDate.format("DD/MM/YYYY");

        return classDate >= startDateStr && classDate <= endDateStr;
      });
    }

    // Filter by booking status
    if (bookingStatus !== "all") {
      filtered = filtered.filter((cls) => {
        if (bookingStatus === "empty") {
          return !cls.bookings || cls.bookings.length === 0;
        }
        if (bookingStatus === "pending") {
          return cls.bookings && cls.bookings.some((b) => b.status === 2);
        }
        if (bookingStatus === "confirmed") {
          return cls.bookings && cls.bookings.some((b) => b.status === 1);
        }
        return true;
      });
    }

    return filtered;
  };

  const filterAvailableTeachers = (freeTimes, start, end) => {
    console.log("Filtering with:", {
      freeTimes,
      start: start.format("HH:mm DD/MM/YYYY"),
      end: end.format("HH:mm DD/MM/YYYY"),
    });

    const filtered = freeTimes.filter((freeTime) => {
      if (!freeTime.time_start || !freeTime.time_end) {
        console.log(
          "Skipping free time - missing start or end time:",
          freeTime
        );
        return false;
      }

      const freeStart = dayjs(freeTime.time_start, "HH:mm DD/MM/YYYY");
      const freeEnd = dayjs(freeTime.time_end, "HH:mm DD/MM/YYYY");

      // Kiểm tra xem thời gian rảnh của giáo viên có chứa thời gian lớp học không
      const isValid =
        freeStart.isSameOrBefore(start) && freeEnd.isSameOrAfter(end);

      console.log("Comparing times for teacher:", freeTime.teacher.name, {
        freeTimeStart: freeStart.format("HH:mm DD/MM/YYYY"),
        freeTimeEnd: freeEnd.format("HH:mm DD/MM/YYYY"),
        classStart: start.format("HH:mm DD/MM/YYYY"),
        classEnd: end.format("HH:mm DD/MM/YYYY"),
        isStartValid: freeStart.isSameOrBefore(start),
        isEndValid: freeEnd.isSameOrAfter(end),
      });

      console.log("Is time slot valid for this teacher?", isValid);

      return isValid;
    });

    console.log(
      "Final filtered results:",
      filtered.map((ft) => ({
        teacherName: ft.teacher.name,
        teacherId: ft.teacher.id,
        timeStart: ft.time_start,
        timeEnd: ft.time_end,
      }))
    );
    return filtered;
  };

  const handleStartDateTimeChange = (date) => {
    if (date && typeof date.add === "function") {
      const endTime = date.add(1, "hour");
      console.log("Selected time range:", {
        start: date.format("HH:mm DD/MM/YYYY"),
        end: endTime.format("HH:mm DD/MM/YYYY"),
        allFreeTimes: allFreeTimes,
      });

      form.setFieldsValue({
        edit_time_end: endTime,
      });

      // Filter available teachers based on free times
      const available = filterAvailableTeachers(allFreeTimes, date, endTime);
      console.log(
        "Available teachers after filtering:",
        available.map((t) => ({
          name: t.teacher.name,
          timeStart: t.time_start,
          timeEnd: t.time_end,
        }))
      );
      setAvailableTeachers(available);
    } else {
      setAvailableTeachers([]);
    }
  };

  const getDisabledTime = (date) => {
    // Bỏ logic disable giờ, cho phép chọn bất kỳ giờ nào
    return {};
  };

  return (
    <div className="admin-schedules">
      <div className="admin-page-header" style={{ marginBottom: "24px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "600", color: "#1a1a1a" }}>
          Lịch học
        </h2>
      </div>

      <Card
        className="mb-4"
        style={{ borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
      >
        <Space
          size="large"
          style={{ width: "100%", justifyContent: "flex-start" }}
        >
          <Space
            style={{
              background: "#f5f5f5",
              padding: "8px 16px",
              borderRadius: "6px",
            }}
          >
            <CalendarOutlined style={{ fontSize: "18px", color: "#1890ff" }} />
            <RangePicker
              onChange={handleDateRangeChange}
              format="DD/MM/YYYY"
              placeholder={["Từ ngày", "Đến ngày"]}
              style={{ width: "280px" }}
            />
          </Space>
          <Select
            defaultValue="all"
            style={{ width: 200 }}
            onChange={handleBookingStatusChange}
            dropdownStyle={{ borderRadius: "8px" }}
          >
            <Option value="all">Tất cả trạng thái</Option>
            <Option value="empty">Đang trống</Option>
            <Option value="pending">Đang chờ nhận lớp</Option>
            <Option value="confirmed">Đã nhận lớp</Option>
          </Select>
        </Space>
      </Card>

      <div className="admin-page-content">
        <Table
          columns={columns}
          dataSource={getFilteredClasses()}
          loading={loading}
          rowKey="id"
          scroll={{ x: "100%" }}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `Tổng ${total} lớp học`,
          }}
          className="admin-table"
          bordered={false}
          size="middle"
          style={{
            background: "#fff",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        />
      </div>

      {/* Edit Modal */}
      <Modal
        title={
          <div
            style={{
              fontSize: "24px",
              fontWeight: "600",
              color: "#1a1a1a",
              padding: "16px 0",
              borderBottom: "1px solid #f0f0f0",
            }}
          >
            Chỉnh sửa lớp học
          </div>
        }
        open={isEditModalVisible}
        onOk={handleEditModalOk}
        onCancel={handleEditModalCancel}
        width={800}
        styles={{
          body: { padding: "24px 32px" },
          header: { padding: "0 32px" },
          footer: { padding: "16px 32px", borderTop: "1px solid #f0f0f0" },
        }}
      >
        {selectedClass && (
          <Form form={form} layout="vertical">
            <Row gutter={[24, 24]}>
              <Col span={24}>
                <Card
                  bordered={false}
                  style={{
                    background: "#fafafa",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  }}
                >
                  <Space
                    direction="vertical"
                    size="large"
                    style={{ width: "100%" }}
                  >
                    <div>
                      <Text
                        strong
                        style={{
                          fontSize: "20px",
                          display: "block",
                          marginBottom: "24px",
                          color: "#1a1a1a",
                        }}
                      >
                        <BookOutlined
                          style={{ marginRight: "12px", color: "#1890ff" }}
                        />
                        Thông tin khóa học
                      </Text>
                      <div style={{ paddingLeft: "32px" }}>
                        <Text
                          style={{
                            fontSize: "16px",
                            display: "block",
                            marginBottom: "12px",
                            color: "#262626",
                          }}
                        >
                          Khóa học: {selectedClass.lecture?.course?.name}
                        </Text>
                        <Text
                          style={{
                            fontSize: "16px",
                            display: "block",
                            color: "#262626",
                          }}
                        >
                          Bài giảng: {selectedClass.lecture?.name}
                        </Text>
                      </div>
                    </div>

                    <Divider style={{ margin: "16px 0" }} />

                    <div>
                      <Text
                        strong
                        style={{
                          fontSize: "20px",
                          display: "block",
                          marginBottom: "24px",
                          color: "#1a1a1a",
                        }}
                      >
                        <UserOutlined
                          style={{ marginRight: "12px", color: "#1890ff" }}
                        />
                        Thông tin học viên
                      </Text>
                      <div style={{ paddingLeft: "32px" }}>
                        {selectedClass.student ? (
                          <>
                            <Text
                              style={{
                                fontSize: "16px",
                                display: "block",
                                marginBottom: "12px",
                                color: "#262626",
                              }}
                            >
                              Tên: {selectedClass.student.name}
                            </Text>
                            <Text
                              style={{
                                fontSize: "16px",
                                display: "block",
                                marginBottom: "12px",
                                color: "#262626",
                              }}
                            >
                              Email: {selectedClass.student.email}
                            </Text>
                            <Text
                              style={{
                                fontSize: "16px",
                                display: "block",
                                color: "#262626",
                              }}
                            >
                              Số điện thoại: {selectedClass.student.phone}
                            </Text>
                          </>
                        ) : (
                          <Text type="secondary" style={{ fontSize: "16px" }}>
                            Chưa có học viên
                          </Text>
                        )}
                      </div>
                    </div>

                    <Divider style={{ margin: "16px 0" }} />

                    <div>
                      <Text
                        strong
                        style={{
                          fontSize: "20px",
                          display: "block",
                          marginBottom: "24px",
                          color: "#1a1a1a",
                        }}
                      >
                        <ClockCircleOutlined
                          style={{ marginRight: "12px", color: "#1890ff" }}
                        />
                        Thời gian học
                      </Text>
                      <div style={{ paddingLeft: "32px" }}>
                        {selectedClass.bookings?.some((b) => b.status === 1) ? (
                          <>
                            <Text
                              style={{
                                fontSize: "16px",
                                display: "block",
                                marginBottom: "12px",
                                color: "#262626",
                              }}
                            >
                              Bắt đầu: {selectedClass.time_start}
                            </Text>
                            <Text
                              style={{
                                fontSize: "16px",
                                display: "block",
                                color: "#262626",
                              }}
                            >
                              Kết thúc: {selectedClass.time_end}
                            </Text>
                          </>
                        ) : (
                          <div>
                            <Row gutter={16}>
                              <Col span={12}>
                                <Form.Item
                                  name="edit_time_start"
                                  rules={[
                                    {
                                      required: true,
                                      message:
                                        "Vui lòng chọn thời gian bắt đầu!",
                                    },
                                  ]}
                                  style={{ marginBottom: 0 }}
                                >
                                  <DatePicker
                                    showTime
                                    format="HH:mm DD/MM/YYYY"
                                    style={{ width: "100%" }}
                                    placeholder="Thời gian bắt đầu"
                                    disabledDate={(current) =>
                                      current &&
                                      current < moment().startOf("day")
                                    }
                                    onChange={handleStartDateTimeChange}
                                  />
                                </Form.Item>
                              </Col>
                              <Col span={12}>
                                <Form.Item
                                  name="edit_time_end"
                                  style={{ marginBottom: 0 }}
                                >
                                  <DatePicker
                                    showTime
                                    format="HH:mm DD/MM/YYYY"
                                    style={{ width: "100%" }}
                                    placeholder="Thời gian kết thúc"
                                    disabled
                                  />
                                </Form.Item>
                              </Col>
                            </Row>
                          </div>
                        )}
                      </div>
                    </div>

                    <Divider style={{ margin: "16px 0" }} />

                    <div>
                      <Text
                        strong
                        style={{
                          fontSize: "20px",
                          display: "block",
                          marginBottom: "24px",
                          color: "#1a1a1a",
                        }}
                      >
                        <UserOutlined
                          style={{ marginRight: "12px", color: "#1890ff" }}
                        />
                        Thông tin giáo viên
                      </Text>
                      <div style={{ paddingLeft: "32px" }}>
                        {selectedClass.bookings?.length > 0 ? (
                          <div>
                            {selectedClass.bookings.map((booking) => {
                              if (booking.status === 1) {
                                return (
                                  <div key={booking.id}>
                                    <Tag
                                      color="success"
                                      style={{
                                        fontSize: "15px",
                                        padding: "6px 12px",
                                        borderRadius: "4px",
                                        marginBottom: "16px",
                                      }}
                                    >
                                      Đã nhận lớp
                                    </Tag>
                                    <div style={{ marginTop: "12px" }}>
                                      <Text
                                        style={{
                                          fontSize: "16px",
                                          display: "block",
                                          marginBottom: "12px",
                                          color: "#262626",
                                        }}
                                      >
                                        Tên: {booking.teacher.name}
                                      </Text>
                                      <Text
                                        style={{
                                          fontSize: "16px",
                                          display: "block",
                                          marginBottom: "12px",
                                          color: "#262626",
                                        }}
                                      >
                                        Email: {booking.teacher.email}
                                      </Text>
                                      <Text
                                        style={{
                                          fontSize: "16px",
                                          display: "block",
                                          color: "#262626",
                                        }}
                                      >
                                        Số điện thoại: {booking.teacher.phone}
                                      </Text>
                                    </div>
                                  </div>
                                );
                              }
                              if (booking.status === 2) {
                                return (
                                  <div
                                    key={booking.id}
                                    style={{ marginBottom: "16px" }}
                                  >
                                    <Tag
                                      color="error"
                                      style={{
                                        fontSize: "15px",
                                        padding: "6px 12px",
                                        borderRadius: "4px",
                                      }}
                                    >
                                      Đã hủy
                                    </Tag>
                                    <Text
                                      style={{
                                        fontSize: "16px",
                                        marginLeft: "12px",
                                        color: "#262626",
                                      }}
                                    >
                                      {booking.teacher.name}
                                    </Text>
                                  </div>
                                );
                              }
                              return (
                                <div
                                  key={booking.id}
                                  style={{ marginBottom: "16px" }}
                                >
                                  <Tag
                                    color="warning"
                                    style={{
                                      fontSize: "15px",
                                      padding: "6px 12px",
                                      borderRadius: "4px",
                                    }}
                                  >
                                    Đang chờ nhận
                                  </Tag>
                                  <Text
                                    style={{
                                      fontSize: "16px",
                                      marginLeft: "12px",
                                      color: "#262626",
                                    }}
                                  >
                                    {booking.teacher.name}
                                  </Text>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <>
                            <Text
                              type="secondary"
                              style={{
                                fontSize: "16px",
                                display: "block",
                                marginBottom: "16px",
                                color: "#8c8c8c",
                              }}
                            >
                              Chưa có giáo viên
                            </Text>
                            {availableTeachers.length > 0 ? (
                              <Form.Item
                                name="teacherIds"
                                label={
                                  <Text
                                    style={{
                                      fontSize: "16px",
                                      color: "#262626",
                                    }}
                                  >
                                    Chọn giáo viên
                                  </Text>
                                }
                                style={{ marginBottom: 0 }}
                              >
                                <Select
                                  placeholder="Chọn giáo viên"
                                  style={{ width: "100%" }}
                                  mode="multiple"
                                  dropdownStyle={{ borderRadius: "8px" }}
                                >
                                  {availableTeachers.map((freeTime) => (
                                    <Option
                                      key={freeTime.id}
                                      value={freeTime.teacher.id}
                                    >
                                      {freeTime.teacher.name}
                                    </Option>
                                  ))}
                                </Select>
                              </Form.Item>
                            ) : (
                              <Text
                                type="danger"
                                style={{
                                  fontSize: "16px",
                                  color: "#ff4d4f",
                                }}
                              >
                                Không có giáo viên rảnh trong khung giờ này
                              </Text>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    <Divider style={{ margin: "16px 0" }} />

                    <div>
                      <Text
                        strong
                        style={{
                          fontSize: "20px",
                          display: "block",
                          marginBottom: "24px",
                          color: "#1a1a1a",
                        }}
                      >
                        <BookOutlined
                          style={{ marginRight: "12px", color: "#1890ff" }}
                        />
                        Thông tin Google Meet
                      </Text>
                      <Form.Item
                        name="meeting_url"
                        label="Link Google Meet"
                        initialValue={selectedClass.meeting_url}
                        rules={[
                          { type: "url", message: "Vui lòng nhập URL hợp lệ!" },
                        ]}
                      >
                        <Input placeholder="Nhập link Google Meet" />
                      </Form.Item>
                    </div>
                  </Space>
                </Card>
              </Col>
            </Row>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default AdminSchedule;
