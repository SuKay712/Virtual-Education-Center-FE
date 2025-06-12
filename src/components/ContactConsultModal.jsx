import React, { useState } from "react";
import "./ContactConsultModal.scss";
import authAPI from "../api/auth";

const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
const validatePhone = (phone) => /^\d{10}$/.test(phone);

const ContactConsultModal = ({ open, onClose }) => {
  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.email.trim()) {
      setError("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    if (!validatePhone(form.phone)) {
      setError("Số điện thoại không hợp lệ!");
      return;
    }
    if (!validateEmail(form.email)) {
      setError("Email không hợp lệ!");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await authAPI.createContact({
        email: form.email,
        phone_number: form.phone,
        name: form.name,
      });
      setSuccess(true);
    } catch (err) {
      setError("Đã có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-modal-overlay">
      <div className="contact-modal">
        <button className="contact-modal-close" onClick={onClose}>
          &times;
        </button>
        {success ? (
          <div className="contact-modal-success">
            <h3>Đăng ký nhận tư vấn thành công!</h3>
            <p>Trung tâm sẽ liên hệ với bạn trong thời gian sớm nhất.</p>
            <button className="contact-modal-btn" onClick={onClose}>
              Đóng
            </button>
          </div>
        ) : (
          <form
            className="contact-modal-form d-flex flex-column align-items-center"
            onSubmit={handleSubmit}
          >
            <h3>Nhận tư vấn miễn phí</h3>
            <div className="contact-modal-field">
              <label>Họ và tên</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Nhập họ tên..."
              />
            </div>
            <div className="contact-modal-field">
              <label>Số điện thoại</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Nhập số điện thoại..."
              />
            </div>
            <div className="contact-modal-field">
              <label>Email</label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Nhập email..."
              />
            </div>
            {error && <div className="contact-modal-error">{error}</div>}
            <button
              className="contact-modal-btn"
              type="submit"
              disabled={loading}
            >
              {loading ? "Đang gửi..." : "Gửi đăng ký"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ContactConsultModal;
