import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Input,
  Space,
  Modal,
  Form,
  Select,
  DatePicker,
} from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import "./AdminPages.scss";
import adminAPI from "../../../api/adminAPI"; // Import adminAPI
import { formatDateForInput } from "../../../utils/dateFormat";
import { BsGenderMale, BsGenderFemale } from "react-icons/bs";
import { toast } from "react-toastify";
import moment from "moment";
import { IMAGES } from "../../../constants/images";
import { getAvatarUrl, AvatarImage } from "../../../utils/avatarUtils";

const { Option } = Select;

const AdminAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [createForm] = Form.useForm();
  const [editingAccount, setEditingAccount] = useState(null);
  const [isFormChanged, setIsFormChanged] = useState(false);

  const columns = [
    {
      title: "Ảnh đại diện",
      dataIndex: "avatar",
      key: "avatar",
      width: "6%",
      align: "center",
      render: (avatar) => <AvatarImage avatar={avatar} />,
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      width: "8%",
      ellipsis: true,
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      width: "5%",
      ellipsis: true,
      align: "center",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      width: "8%",
      ellipsis: true,
      render: (address) => (
        <span
          style={{
            display: "inline-block",
            maxWidth: "100%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
          title={address}
        >
          {address || "Chưa cập nhật"}
        </span>
      ),
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      width: "8%",
      align: "center",
      filters: [
        { text: "Học viên", value: "Student" },
        { text: "Giảng viên", value: "Teacher" },
        { text: "Quản trị viên", value: "Admin" },
      ],
      onFilter: (value, record) => record.role === value,
    },
    {
      title: "Trạng thái",
      dataIndex: "isActived",
      key: "status",
      width: "6%",
      align: "center",
      render: (isActived) => (
        <span style={{ color: isActived ? "#52c41a" : "#ff4d4f" }}>
          {isActived ? "Hoạt động" : "Không hoạt động"}
        </span>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: "6%",
      align: "center",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Button danger size="small" onClick={() => handleDelete(record.id)}>
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  // Fetch accounts from API
  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getAccounts();
      // Set default avatar for accounts without avatar
      const accountsWithDefaultAvatar = response.data.map((account) => ({
        ...account,
        avatar: getAvatarUrl(account.avatar),
      }));
      setAccounts(accountsWithDefaultAvatar);
    } catch (error) {
      console.error("Error fetching accounts:", error);
      // Optionally show an error message to the user
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []); // Empty dependency array means this runs once on mount

  const handleEdit = (account) => {
    setEditingAccount(account);
    // Convert birthday string to moment object if it exists
    const formValues = {
      ...account,
      birthday: account.birthday ? moment(account.birthday) : null,
    };
    form.setFieldsValue(formValues);
    setIsFormChanged(false);
    setIsModalVisible(true);
  };

  const handleFormValuesChange = () => {
    const currentValues = form.getFieldsValue();
    const initialValues = {
      ...editingAccount,
      birthday: editingAccount.birthday
        ? moment(editingAccount.birthday)
        : null,
    };

    // Compare current values with initial values
    const hasChanges = Object.keys(currentValues).some((key) => {
      if (key === "birthday") {
        return (
          currentValues[key]?.format("YYYY-MM-DD") !==
          initialValues[key]?.format("YYYY-MM-DD")
        );
      }
      return currentValues[key] !== initialValues[key];
    });

    setIsFormChanged(hasChanges);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xóa tài khoản này?",
      content: "Hành động này không thể hoàn tác.",
      okText: "Có",
      okType: "danger",
      cancelText: "Không",
      onOk() {
        adminAPI
          .deleteAccount(id)
          .then((response) => {
            toast.success("Xóa tài khoản thành công!");
            fetchAccounts();
          })
          .catch((error) => {
            toast.error(
              error.response?.data?.message || "Không thể xóa tài khoản"
            );
          });
      },
    });
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      // Convert moment object to string format before submitting
      const submitData = {
        ...values,
        birthday: values.birthday ? values.birthday.format("YYYY-MM-DD") : null,
      };

      if (editingAccount) {
        adminAPI
          .updateAccount(editingAccount.id, submitData)
          .then((response) => {
            toast.success("Account updated successfully!");
            setIsModalVisible(false);
            form.resetFields();
            setEditingAccount(null);
            fetchAccounts();
          })
          .catch((error) => {
            toast.error(
              error.response?.data?.message || "Failed to update account"
            );
          });
      }
    });
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingAccount(null);
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file && editingAccount) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await adminAPI.updateAvatar(
          editingAccount.id,
          formData
        );
        form.setFieldsValue({ avatar: response.data.avatar });
        toast.success("Avatar updated successfully!");
        fetchAccounts(); // Refresh the list to show updated avatar
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to update avatar");
      }
    }
  };

  const handleCreateAccount = () => {
    setIsCreateModalVisible(true);
  };

  const handleCreateModalOk = () => {
    createForm
      .validateFields()
      .then((values) => {
        // Format data according to CreateAccountDto
        const submitData = {
          email: values.email,
          password: values.password,
          confirmPassword: values.confirmPassword, // Include confirmPassword as required by backend
          role: values.role,
          isActived: values.isActived,
        };

        console.log("Submitting data:", submitData);

        adminAPI
          .createAccount(submitData)
          .then((response) => {
            toast.success("Account created successfully!");
            setIsCreateModalVisible(false);
            createForm.resetFields();
            fetchAccounts();
          })
          .catch((error) => {
            console.log("API Error:", error);
            const errorMessage =
              error.response?.data?.message || "Failed to create account";
            toast.error(errorMessage);
          });
      })
      .catch((error) => {
        console.log("Form validation error:", error);
        if (error.errorFields) {
          error.errorFields.forEach((field) => {
            if (field.name[0] === "confirmPassword") {
              toast.error("Passwords do not match!");
            }
          });
        }
      });
  };

  const handleCreateModalCancel = () => {
    setIsCreateModalVisible(false);
    createForm.resetFields();
  };

  return (
    <div className="admin-accounts">
      <div className="admin-page-header">
        <h2>Quản lý tài khoản</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreateAccount}
        >
          Thêm tài khoản mới
        </Button>
      </div>

      <div className="admin-page-content">
        <Table
          columns={columns}
          dataSource={accounts}
          loading={loading}
          rowKey="id"
          scroll={{ x: "100%" }}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `Tổng ${total} tài khoản`,
          }}
        />
      </div>

      {/* Create Account Modal */}
      <Modal
        title="Tạo tài khoản mới"
        open={isCreateModalVisible}
        onOk={handleCreateModalOk}
        onCancel={handleCreateModalCancel}
        width={500}
      >
        <Form
          form={createForm}
          layout="vertical"
          initialValues={{
            role: "Student",
            isActived: true,
          }}
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu!" },
              { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Xác nhận mật khẩu"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu!" },
              { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject("Mật khẩu không khớp!");
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="role"
            label="Vai trò"
            rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}
          >
            <Select>
              <Option value="Student">Học viên</Option>
              <Option value="Teacher">Giảng viên</Option>
              <Option value="Admin">Quản trị viên</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="isActived"
            label="Trạng thái"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
          >
            <Select>
              <Option value={true}>Hoạt động</Option>
              <Option value={false}>Không hoạt động</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Account Modal */}
      <Modal
        title={editingAccount ? "Chỉnh sửa tài khoản" : "Thêm tài khoản mới"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={800}
        okButtonProps={{ disabled: !isFormChanged }}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ status: "active" }}
          onValuesChange={handleFormValuesChange}
        >
          <div className="d-flex gap-4">
            <div className="flex-grow-1">
              <Form.Item name="name" label="Tên">
                <Input />
              </Form.Item>

              <Form.Item name="phone" label="Số điện thoại">
                <Input />
              </Form.Item>

              <Form.Item name="gender" label="Giới tính">
                <Select>
                  <Option value="Male">Nam</Option>
                  <Option value="Female">Nữ</Option>
                  <Option value="Other">Khác</Option>
                </Select>
              </Form.Item>

              <Form.Item name="birthday" label="Ngày sinh">
                <DatePicker
                  style={{ width: "100%" }}
                  format="YYYY-MM-DD"
                  disabledDate={(current) => {
                    return current && current >= moment().startOf("day");
                  }}
                />
              </Form.Item>

              <Form.Item
                name="isActived"
                label="Trạng thái"
                rules={[
                  { required: true, message: "Vui lòng chọn trạng thái!" },
                ]}
              >
                <Select>
                  <Option value={true}>Hoạt động</Option>
                  <Option value={false}>Không hoạt động</Option>
                </Select>
              </Form.Item>

              <Form.Item name="avatar" hidden>
                <Input />
              </Form.Item>
            </div>

            <div
              className="d-flex flex-column align-items-center"
              style={{ width: "200px" }}
            >
              <div className="position-relative mb-3">
                <AvatarImage
                  avatar={form.getFieldValue("avatar")}
                  style={{
                    width: "150px",
                    height: "150px",
                  }}
                  className="img-fluid rounded-circle"
                />
                <label
                  htmlFor="avatarUpload"
                  className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                  style={{
                    background: "rgba(0,0,0,0.5)",
                    borderRadius: "50%",
                    cursor: "pointer",
                    opacity: 0,
                    transition: "opacity 0.3s",
                  }}
                  onMouseEnter={(e) => (e.target.style.opacity = 1)}
                  onMouseLeave={(e) => (e.target.style.opacity = 0)}
                >
                  <span className="text-white">Tải ảnh lên</span>
                </label>
                <input
                  type="file"
                  id="avatarUpload"
                  className="d-none"
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </div>
            </div>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminAccounts;
