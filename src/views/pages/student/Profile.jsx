import React, { useState } from "react";
import { IMAGES } from "../../../constants/images";
import { BsGenderMale, BsGenderFemale } from "react-icons/bs";

import "./Profile.scss";

function Profile() {
  const initialAccount = {
    name: "Nguyễn Văn A",
    email: "a@gmail.com",
    phone: "0123456789",
    gender: "Male",
    birthday: "01/01/2000",
    address: "Hà Nội",
    avatar: IMAGES.student1_image,
    role: "Student",
  };

  const formatDate = (date) => {
    const [day, month, year] = date.split("/");
    return `${year}-${month}-${day}`; // Chuyển sang định dạng YYYY-MM-DD
  };

  const [account, setAccount] = useState({
    ...initialAccount,
    birthday: formatDate(initialAccount.birthday),
  });

  const [formData, setFormData] = useState({
    ...account,
    birthday: formatDate(account.birthday),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData({ ...formData, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setAccount({ ...formData }); // Cập nhật lại thông tin của account
    console.log("Updated Account Info:", formData);
    alert("Account information updated successfully!");
    // Thực hiện logic gửi API tại đây nếu cần
  };

  const handleCancel = () => {
    setFormData({ ...account }); // Reset về thông tin ban đầu
  };

  const calculateAge = (birthday) => {
    const birthYear = new Date(birthday).getFullYear();
    const currentYear = new Date().getFullYear();
    return currentYear - birthYear;
  };

  return (
    <div className="profile gap-5">
      <div className="profile-container">
        <div className="profile-header d-flex gap-3 align-items-center">
          <h2>My Profile</h2>
        </div>
        <form onSubmit={handleSubmit} className="profile-form d-flex gap-4">
          {/* Avatar Column */}
          <div className="avatar-column text-center position-relative me-5">
            <img
              src={formData.avatar}
              alt="Avatar"
              className="img-fluid rounded-circle mb-3 avatar-image"
              style={{ width: "150px", height: "150px", objectFit: "cover" }}
            />
            <label
              htmlFor="avatarUpload"
              className="upload-overlay d-flex align-items-center justify-content-center"
            >
              Upload Image
            </label>
            <input
              type="file"
              id="avatarUpload"
              className="form-control d-none"
              accept="image/*"
              onChange={handleAvatarChange}
            />
            {/* Hiển thị số tuổi và icon giới tính */}
            <div className="mt-2">
              <span className="age">
                Age: {calculateAge(formData.birthday)}
              </span>
              <span className="gender-icon ms-2">
                {formData.gender === "Female" ? (
                  <BsGenderFemale style={{ color: "female" }} />
                ) : (
                  <BsGenderMale style={{ color: "blue" }} />
                )}
              </span>
            </div>
          </div>

          {/* User Info Column */}
          <div className="info-column flex-grow-1">
            <div className="form-group mb-3">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                value={formData.email}
                disabled
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="phone">Phone</label>
              <input
                type="text"
                id="phone"
                name="phone"
                className="form-control"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="info-column flex-grow-1">
            <div className="form-group mb-3">
              <label htmlFor="gender">Gender</label>
              <select
                id="gender"
                name="gender"
                className="form-select"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group mb-3">
              <label htmlFor="birthday">Birthday</label>
              <input
                type="date"
                id="birthday"
                name="birthday"
                className="form-control"
                value={formData.birthday}
                onChange={handleChange}
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                className="form-control"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
            <div className="form-actions d-flex gap-3 flex-row-reverse">
              <button
                type="button"
                className="form-cancel-btn btn btn-secondary"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button type="submit" className="form-submit-btn btn btn-primary">
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
      <div className="course-container right"></div>
    </div>
  );
}

export default Profile;
