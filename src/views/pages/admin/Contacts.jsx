import React, { useEffect, useState } from "react";
import { Table, Input, Row, Col, message, Select } from "antd";
import adminAPI from "../../../api/adminAPI";
import moment from "moment";
import "./AdminPages.scss";

const { Search } = Input;

const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const handleStatusChange = async (contactId, newStatus) => {
    try {
      await adminAPI.updateContact(contactId, { status: newStatus });
      message.success("Contact status updated successfully");
      fetchContacts();
    } catch (error) {
      message.error("Failed to update contact status");
    }
  };
  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getContacts();
      setContacts(res.data);
      setFilteredContacts(res.data);
    } catch (err) {
      message.error("Không thể tải danh sách liên hệ");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
    if (!value) {
      setFilteredContacts(contacts);
      return;
    }
    setFilteredContacts(
      contacts.filter(
        (c) =>
          c.name?.toLowerCase().includes(value.toLowerCase()) ||
          c.email?.toLowerCase().includes(value.toLowerCase()) ||
          c.phone_number?.toLowerCase().includes(value.toLowerCase())
      )
    );
  };
  const statusColors = {
    0: { bg: "#fffbe6", color: "#faad14", text: "Chưa tư vấn" },
    1: { bg: "#e6f7ff", color: "#1890ff", text: "Đã tư vấn" },
  };
  const statusOptions = [{ value: 0 }, { value: 1 }];
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
      align: "center",
    },
    {
      title: "Tên người liên hệ",
      dataIndex: "name",
      key: "name",
      width: 180,
      align: "center",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone_number",
      key: "phone_number",
      width: 160,
      align: "center",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 220,
      align: "center",
    },
    {
      title: "Thời gian tạo",
      dataIndex: "created_at",
      key: "created_at",
      width: 180,
      align: "center",
      render: (created_at) => moment(created_at).format("HH:mm DD/MM/YYYY"),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
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
    <div className="admin-contacts">
      <div className="admin-page-header">
        <h2>Quản lý liên hệ</h2>
      </div>
      <div className="admin-page-content">
        <Row
          gutter={[16, 16]}
          className="filter-section"
          style={{ marginBottom: 16 }}
        >
          <Col xs={24} sm={12} md={8} lg={6}>
            <Search
              placeholder="Tìm kiếm theo tên, email, số điện thoại..."
              allowClear
              onSearch={handleSearch}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </Col>
        </Row>
        <Table
          columns={columns}
          dataSource={filteredContacts}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 900 }}
        />
      </div>
    </div>
  );
};

export default AdminContacts;
