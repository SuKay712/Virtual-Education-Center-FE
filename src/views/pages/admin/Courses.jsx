import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Input,
  Space,
  Modal,
  Form,
  Select,
  InputNumber,
  Typography,
  List,
  Tag,
  Upload,
  message,
} from "antd";
import {
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  UploadOutlined,
  FilePdfOutlined,
  RightOutlined,
  DeleteOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import "./AdminPages.scss";
import adminAPI from "../../../api/adminAPI";
import { toast } from "react-toastify";

const { Option } = Select;
const { TextArea } = Input;
const { Text } = Typography;

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingCourse, setEditingCourse] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm] = Form.useForm();
  const [isAddingLecture, setIsAddingLecture] = useState(false);
  const [lectureForm] = Form.useForm();
  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [isLectureEditModalVisible, setIsLectureEditModalVisible] =
    useState(false);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [lectureEditFileList, setLectureEditFileList] = useState([]);
  const [lectureEditForm] = Form.useForm();
  const [isAddLectureModalVisible, setIsAddLectureModalVisible] =
    useState(false);

  const columns = [
    {
      title: "Tên khóa học",
      dataIndex: "name",
      key: "name",
      width: "15%",
      ellipsis: true,
    },
    {
      title: "Giá tiền",
      dataIndex: "price",
      key: "price",
      width: "10%",
      align: "center",
      render: (price) => `${price}VND`,
    },
    {
      title: "Số lớp học",
      dataIndex: "num_classes",
      key: "num_classes",
      width: "8%",
      align: "center",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      width: "35%",
      ellipsis: true,
      render: (description) => (
        <span
          style={{
            display: "inline-block",
            maxWidth: "100%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
          title={description}
        >
          {description}
        </span>
      ),
    },
    {
      title: "",
      key: "actions",
      width: "10%",
      align: "center",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
          >
            Xem chi tiết
          </Button>
        </Space>
      ),
    },
  ];

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getCourses();
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error("Không thể tải danh sách khóa học");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleEdit = (course) => {
    setEditingCourse(course);
    form.setFieldsValue(course);
    setIsModalVisible(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this course?",
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        // TODO: Implement delete course
        console.log("Delete course:", id);
      },
    });
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      if (editingCourse) {
        // TODO: Implement update course
        console.log("Update course:", values);
      } else {
        // TODO: Implement create course
        console.log("Create course:", values);
      }
      setIsModalVisible(false);
      form.resetFields();
      setEditingCourse(null);
    });
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingCourse(null);
  };

  const handleViewDetails = (course) => {
    setSelectedCourse(course);
    setIsDetailsModalVisible(true);
  };

  const handleDetailsModalCancel = () => {
    setIsDetailsModalVisible(false);
    setSelectedCourse(null);
    setIsEditing(false);
    editForm.resetFields();
  };

  const handleEditSubmit = (values) => {
    // TODO: Implement update course
    console.log("Update course:", values);
    setIsEditing(false);
    handleModalCancel();
  };

  const handleAddLecture = () => {
    setIsAddLectureModalVisible(true);
  };

  const handleAddLectureModalCancel = () => {
    setIsAddLectureModalVisible(false);
    lectureForm.resetFields();
    setFileList([]);
  };

  const handleLectureSubmit = async (values) => {
    try {
      setUploading(true);

      // Create FormData with lecture info and files
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("courseId", selectedCourse.id);

      // Log file information before upload
      console.log("Files to upload:", fileList);

      // Append each file to FormData
      fileList.forEach((file, index) => {
        // Kiểm tra file type
        if (!file.type || !file.type.startsWith("application/pdf")) {
          throw new Error("Only PDF files are allowed");
        }

        console.log(`File ${index + 1}:`, {
          name: file.name,
          type: file.type,
          size: file.size,
        });

        formData.append("theories", file);
      });

      // Log FormData contents
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const response = await adminAPI.addLecture(formData);
      console.log("Upload response:", response);

      message.success("Thêm lớp học thành công");
      handleAddLectureModalCancel();
      fetchCourses(); // Refresh course list
    } catch (error) {
      console.error("Error creating lecture:", error);
      message.error(error.message || "Không thể thêm lớp học");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    // Update form value when file list changes
    lectureForm.setFieldsValue({
      theories: newFileList.map((file) => file.originFileObj),
    });
  };

  const beforeUpload = (file) => {
    const isPDF = file.type === "application/pdf";
    if (!isPDF) {
      message.error("Chỉ có thể upload file PDF!");
      return false;
    }
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.error("File phải nhỏ hơn 10MB!");
      return false;
    }
    return false; // Prevent auto upload
  };

  const handleEditLecture = async (lecture) => {
    try {
      // Fetch latest course data

      // Cập nhật lại selectedCourse với dữ liệu mới nhất
      const updatedCourse = courses.find((c) => c.id === selectedCourse.id);
      if (updatedCourse) {
        setSelectedCourse(updatedCourse); // Cập nhật selectedCourse trước

        const updatedLecture = updatedCourse.lectures.find(
          (l) => l.id === lecture.id
        );
        if (updatedLecture) {
          setSelectedLecture(updatedLecture);
          lectureEditForm.setFieldsValue(updatedLecture);

          // Convert existing theories to fileList format with complete file info
          const existingFiles =
            updatedLecture.theories?.map((theory) => ({
              uid: `-${theory.id}`, // Use negative file ID as uid
              name: theory.name || `File ${theory.id}`, // Use theory name or fallback
              status: "done",
              id: theory.id,
              mimeType: theory.mimeType || "application/pdf",
              originFileObj: null,
            })) || [];

          console.log("Existing files:", existingFiles); // Debug log
          setLectureEditFileList(existingFiles);
          setIsLectureEditModalVisible(true);
        }
        await fetchCourses();
      }
    } catch (error) {
      console.error("Error fetching course data:", error);
      message.error("Không thể tải dữ liệu khóa học");
    }
  };

  const handleLectureEditFileChange = ({ fileList: newFileList }) => {
    console.log("New file list:", newFileList); // Debug log

    // Lọc ra các file đã có sẵn (uid < 0)
    const existingFiles = lectureEditFileList.filter((file) => file.uid < 0);

    // Lấy tất cả file mới từ newFileList
    const newFiles = newFileList
      .filter((file) => file.originFileObj) // Chỉ lấy file có originFileObj
      .map((file) => ({
        uid: Date.now() + Math.random(), // Tạo uid dương duy nhất cho mỗi file
        name: file.name,
        status: "done",
        originFileObj: file.originFileObj,
      }));

    // Kết hợp file mới với danh sách hiện tại
    const combinedFileList = [...existingFiles, ...newFiles];
    setLectureEditFileList(combinedFileList);

    // Cập nhật form value
    lectureEditForm.setFieldsValue({
      theories: combinedFileList
        .filter((f) => f.uid > 0)
        .map((f) => f.originFileObj),
    });
  };

  const handleLectureEditSubmit = async () => {
    try {
      const values = await lectureEditForm.validateFields();
      setUploading(true);

      // Create FormData with lecture info and files
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);

      // Log file information before upload
      console.log("Files to upload:", lectureEditFileList);

      // Append each file to FormData
      lectureEditFileList.forEach((file, index) => {
        console.log(`File ${index + 1}:`, {
          name: file.name,
          type: file.type,
          size: file.size,
          originFileObj: file.originFileObj,
        });
        formData.append("theories", file.originFileObj);
      });

      // Log FormData contents
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const response = await adminAPI.updateLecture(
        selectedLecture.id,
        formData
      );
      console.log("Upload response:", response);

      message.success("Cập nhật lớp học thành công");
      setIsLectureEditModalVisible(false);

      // Cập nhật lại dữ liệu sau khi đóng modal
      await fetchCourses();
      const updatedCourse = courses.find((c) => c.id === selectedCourse.id);
      if (updatedCourse) {
        setSelectedCourse(updatedCourse);
      }
    } catch (error) {
      console.error("Error updating lecture:", error);
      message.error("Không thể cập nhật lớp học");
    } finally {
      setUploading(false);
    }
  };

  const handleDownloadTheory = async (theoryId) => {
    try {
      const response = await adminAPI.downloadTheory(theoryId);

      // Tạo blob URL
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      // Tạo link và click để tải
      const link = document.createElement("a");
      link.href = url;

      // Lấy tên file từ header Content-Disposition hoặc sử dụng tên mặc định
      const contentDisposition = response.headers["content-disposition"];
      let filename = "document.pdf";
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1].replace(/\.[^/.]+$/, "") + ".pdf";
        }
      }

      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();

      // Cleanup
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading theory:", error);
      message.error("Không thể tải xuống tài liệu");
    }
  };

  const handleDeleteTheory = async (theoryId) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa tài liệu này không?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await adminAPI.deleteTheory(theoryId);
          message.success("Xóa tài liệu thành công");

          // Cập nhật lại danh sách file trong modal
          const newFileList = lectureEditFileList.filter(
            (f) => f.uid !== `-${theoryId}`
          );
          setLectureEditFileList(newFileList);

          // Cập nhật lại dữ liệu khóa học
          await fetchCourses();

          // Cập nhật lại selectedCourse để modal hiển thị đúng
          if (selectedCourse) {
            const updatedCourse = courses.find(
              (course) => course.id === selectedCourse.id
            );
            if (updatedCourse) {
              setSelectedCourse(updatedCourse);
            }
          }
        } catch (error) {
          console.error("Error deleting theory:", error);
          message.error("Không thể xóa tài liệu");
        }
      },
    });
  };

  return (
    <div className="admin-courses">
      <div className="admin-page-header">
        <h2>Quản lý khóa học</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalVisible(true)}
        >
          Add New Course
        </Button>
      </div>

      <div className="admin-page-content">
        <Table
          columns={columns}
          dataSource={courses}
          loading={loading}
          rowKey="id"
          scroll={{ x: "100%" }}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `Tổng ${total} khóa học`,
          }}
        />
      </div>

      <Modal
        title={editingCourse ? "Edit Course" : "Add New Course"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ status: "active" }}
        >
          <Form.Item
            name="name"
            label="Course Name"
            rules={[{ required: true, message: "Please input course name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="teacher"
            label="Teacher"
            rules={[{ required: true, message: "Please select teacher!" }]}
          >
            <Select>
              <Option value="teacher1">Teacher 1</Option>
              <Option value="teacher2">Teacher 2</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="level"
            label="Level"
            rules={[{ required: true, message: "Please select level!" }]}
          >
            <Select>
              <Option value="Beginner">Beginner</Option>
              <Option value="Intermediate">Intermediate</Option>
              <Option value="Advanced">Advanced</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: "Please input price!" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              formatter={(value) => `${value}$`}
              parser={(value) => value.replace("$", "")}
              min={0}
            />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please input description!" }]}
          >
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select status!" }]}
          >
            <Select>
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Course Details Modal */}
      <Modal
        title={`Chi tiết khóa học: ${selectedCourse?.name}`}
        open={isDetailsModalVisible}
        onCancel={handleDetailsModalCancel}
        width={800}
        footer={[
          <Space key="footer">
            <Button onClick={handleDetailsModalCancel}>Đóng</Button>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "Xem chi tiết" : "Chỉnh sửa"}
            </Button>
          </Space>,
        ]}
        closable={false}
      >
        {selectedCourse && (
          <div className="course-details">
            {isEditing ? (
              <>
                <Form
                  form={editForm}
                  layout="vertical"
                  initialValues={selectedCourse}
                  onFinish={handleEditSubmit}
                >
                  <Form.Item
                    name="name"
                    label="Tên khóa học"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập tên khóa học!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name="price"
                    label="Giá tiền"
                    rules={[
                      { required: true, message: "Vui lòng nhập giá tiền!" },
                    ]}
                  >
                    <InputNumber
                      style={{ width: "100%" }}
                      formatter={(value) => `${value}$`}
                      parser={(value) => value.replace("$", "")}
                      min={0}
                    />
                  </Form.Item>
                  <Form.Item
                    name="description"
                    label="Mô tả"
                    rules={[
                      { required: true, message: "Vui lòng nhập mô tả!" },
                    ]}
                  >
                    <TextArea rows={4} />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      Lưu thay đổi
                    </Button>
                  </Form.Item>
                </Form>
              </>
            ) : (
              <>
                {/* Course Header */}
                <div
                  className="course-header mb-4 p-4"
                  style={{
                    background:
                      "linear-gradient(135deg, #f6f8fd 0%, #f1f4f9 100%)",
                    borderRadius: "12px",
                  }}
                >
                  <h3 className="mb-3" style={{ color: "#1a1a1a" }}>
                    {selectedCourse.name}
                  </h3>
                  <div className="d-flex gap-4">
                    <div className="course-stat">
                      <span style={{ color: "#666" }}>Giá tiền:</span>
                      <span
                        className="ms-2 fw-bold"
                        style={{ color: "#1890ff" }}
                      >
                        {selectedCourse.price}$
                      </span>
                    </div>
                    <div className="course-stat">
                      <span style={{ color: "#666" }}>Số lớp học:</span>
                      <span
                        className="ms-2 fw-bold"
                        style={{ color: "#52c41a" }}
                      >
                        {selectedCourse.num_classes}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Course Description */}
                <div className="course-description mb-4">
                  <h4 className="mb-3" style={{ color: "#1a1a1a" }}>
                    Mô tả khóa học
                  </h4>
                  <div
                    className="p-3"
                    style={{
                      background:
                        "linear-gradient(135deg, #f6f8fd 0%, #f1f4f9 100%)",
                      borderRadius: "12px",
                    }}
                  >
                    <p className="mb-0" style={{ color: "#333" }}>
                      {selectedCourse.description}
                    </p>
                  </div>
                </div>

                {/* Lectures List */}
                <div className="lectures-list">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="mb-0" style={{ color: "#1a1a1a" }}>
                      Danh sách bài giảng
                    </h4>
                    <Space>
                      <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleAddLecture}
                      >
                        Thêm lớp học
                      </Button>
                      <span
                        className="badge"
                        style={{ background: "#1890ff", padding: "6px 12px" }}
                      >
                        {selectedCourse.lectures.length} bài giảng
                      </span>
                    </Space>
                  </div>

                  <List
                    dataSource={selectedCourse.lectures}
                    renderItem={(lecture, index) => (
                      <List.Item>
                        <div
                          className="lecture-item p-3 w-100"
                          style={{
                            background:
                              "linear-gradient(135deg, #f6f8fd 0%, #f1f4f9 100%)",
                            borderRadius: "12px",
                            transition: "all 0.3s ease",
                            cursor: "pointer",
                            ":hover": {
                              transform: "translateY(-2px)",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                            },
                          }}
                        >
                          <div className="d-flex align-items-center">
                            <div className="lecture-number me-3">
                              <span
                                className="badge"
                                style={{
                                  background: "#1890ff",
                                  padding: "8px 12px",
                                  borderRadius: "50%",
                                }}
                              >
                                {index + 1}
                              </span>
                            </div>
                            <div className="lecture-content flex-grow-1">
                              <h5 className="mb-1" style={{ color: "#1a1a1a" }}>
                                {lecture.name}
                              </h5>
                            </div>
                            <div className="lecture-actions">
                              <Button
                                type="text"
                                icon={<RightOutlined />}
                                onClick={() => handleEditLecture(lecture)}
                              />
                            </div>
                          </div>
                        </div>
                      </List.Item>
                    )}
                    className="lectures-container"
                    style={{ maxHeight: "400px", overflowY: "auto" }}
                  />
                </div>
              </>
            )}
          </div>
        )}
      </Modal>

      {/* Add Lecture Modal */}
      <Modal
        title="Thêm lớp học mới"
        open={isAddLectureModalVisible}
        onCancel={handleAddLectureModalCancel}
        footer={[
          <Space key="footer">
            <Button onClick={handleAddLectureModalCancel}>Hủy</Button>
            <Button
              type="primary"
              onClick={() => lectureForm.submit()}
              loading={uploading}
              disabled={fileList.length === 0}
            >
              Thêm lớp học
            </Button>
          </Space>,
        ]}
        closable={false}
      >
        <Form
          form={lectureForm}
          layout="vertical"
          onFinish={handleLectureSubmit}
          initialValues={{
            courseId: selectedCourse?.id,
            theories: [],
          }}
        >
          <Form.Item
            name="name"
            label="Tên lớp học"
            rules={[{ required: true, message: "Vui lòng nhập tên lớp học!" }]}
          >
            <Input placeholder="Nhập tên lớp học" />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <TextArea
              rows={3}
              placeholder="Nhập mô tả lớp học (không bắt buộc)"
            />
          </Form.Item>
          <Form.Item
            name="theories"
            label="Tài liệu lý thuyết"
            rules={[
              {
                required: true,
                message: "Vui lòng upload ít nhất một tài liệu!",
              },
            ]}
          >
            <div>
              {fileList.length > 0 && (
                <div className="mb-3">
                  {fileList.map((file, index) => (
                    <div
                      key={file.uid}
                      className="d-flex align-items-center justify-content-between p-2 mb-2"
                      style={{
                        background: "#f5f5f5",
                        borderRadius: "4px",
                        border: "1px solid #d9d9d9",
                      }}
                    >
                      <div className="d-flex align-items-center">
                        <FilePdfOutlined
                          style={{
                            color: "#ff4d4f",
                            fontSize: "20px",
                            marginRight: "8px",
                          }}
                        />
                        <span>{file.name}</span>
                      </div>
                      <Space>
                        <Button
                          type="text"
                          icon={<DownloadOutlined />}
                          onClick={() => {
                            const url = URL.createObjectURL(file.originFileObj);
                            window.open(url, "_blank");
                          }}
                        />
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => {
                            const newFileList = fileList.filter(
                              (f) => f.uid !== file.uid
                            );
                            setFileList(newFileList);
                            lectureForm.setFieldsValue({
                              theories: newFileList.map((f) => f.originFileObj),
                            });
                          }}
                        />
                      </Space>
                    </div>
                  ))}
                </div>
              )}
              <Upload
                accept=".pdf"
                multiple
                fileList={fileList}
                onChange={handleFileChange}
                beforeUpload={beforeUpload}
                showUploadList={false}
              >
                <Button icon={<UploadOutlined />}>Chọn file PDF</Button>
              </Upload>
              <div className="text-muted mt-2">
                Chỉ chấp nhận file PDF, kích thước tối đa 10MB
              </div>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      {/* Lecture Edit Modal */}
      <Modal
        title="Chỉnh sửa lớp học"
        open={isLectureEditModalVisible}
        onCancel={() => setIsLectureEditModalVisible(false)}
        footer={[
          <Space key="footer">
            <Button onClick={() => setIsLectureEditModalVisible(false)}>
              Đóng
            </Button>
            <Button
              type="primary"
              onClick={handleLectureEditSubmit}
              loading={uploading}
            >
              Lưu thay đổi
            </Button>
          </Space>,
        ]}
        closable={false}
      >
        <Form
          form={lectureEditForm}
          layout="vertical"
          initialValues={selectedLecture}
        >
          <Form.Item
            name="name"
            label="Tên lớp học"
            rules={[{ required: true, message: "Vui lòng nhập tên lớp học!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <TextArea rows={3} />
          </Form.Item>
          <Form.Item name="theories" label="Tài liệu lý thuyết">
            <div>
              {/* Hiển thị file đã có sẵn */}
              {lectureEditFileList.filter((file) => file.uid < 0).length >
                0 && (
                <div className="mb-3">
                  <div className="text-muted mb-2">Tài liệu đã có:</div>
                  {lectureEditFileList
                    .filter((file) => file.uid < 0)
                    .map((file) => (
                      <div
                        key={file.uid}
                        className="d-flex align-items-center justify-content-between p-2 mb-2"
                        style={{
                          background: "#f5f5f5",
                          borderRadius: "4px",
                          border: "1px solid #d9d9d9",
                        }}
                      >
                        <div className="d-flex align-items-center">
                          <FilePdfOutlined
                            style={{
                              color: "#ff4d4f",
                              fontSize: "20px",
                              marginRight: "8px",
                            }}
                          />
                          <span>{file.name}</span>
                        </div>
                        <Space>
                          <Button
                            type="text"
                            icon={<DownloadOutlined />}
                            onClick={() => handleDownloadTheory(file.id)}
                          />
                          <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => handleDeleteTheory(file.id)}
                          />
                        </Space>
                      </div>
                    ))}
                </div>
              )}

              <Upload
                accept=".pdf"
                multiple
                fileList={lectureEditFileList.filter((file) => file.uid > 0)}
                onChange={handleLectureEditFileChange}
                beforeUpload={beforeUpload}
                showUploadList={false}
              >
                <Button icon={<UploadOutlined />}>Chọn file PDF</Button>
              </Upload>
              <div className="text-muted mt-2">
                Chỉ chấp nhận file PDF, kích thước tối đa 10MB
              </div>

              {/* Hiển thị file mới upload */}
              {lectureEditFileList.filter((file) => file.uid > 0).length >
                0 && (
                <div className="mt-3">
                  <div className="text-muted mb-2">Tài liệu mới:</div>
                  {lectureEditFileList
                    .filter((file) => file.uid > 0)
                    .map((file) => (
                      <div
                        key={file.uid}
                        className="d-flex align-items-center justify-content-between p-2 mb-2"
                        style={{
                          background: "#f5f5f5",
                          borderRadius: "4px",
                          border: "1px solid #d9d9d9",
                        }}
                      >
                        <div className="d-flex align-items-center">
                          <FilePdfOutlined
                            style={{
                              color: "#ff4d4f",
                              fontSize: "20px",
                              marginRight: "8px",
                            }}
                          />
                          <span>{file.name}</span>
                        </div>
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => {
                            const newFileList = lectureEditFileList.filter(
                              (f) => f.uid !== file.uid
                            );
                            setLectureEditFileList(newFileList);
                            lectureEditForm.setFieldsValue({
                              theories: newFileList
                                .filter((f) => f.uid > 0)
                                .map((f) => f.originFileObj),
                            });
                          }}
                        />
                      </div>
                    ))}
                </div>
              )}
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminCourses;
