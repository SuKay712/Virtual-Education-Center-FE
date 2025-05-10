import React, { useState } from "react";
import { IMAGES } from "../../../constants/images";
import { BsGenderMale, BsGenderFemale } from "react-icons/bs";
import { toast } from "react-toastify";
import accountAPI from "../../../api/accountAPI";

import "./Profile.scss";

function Profile() {
  const userInfo = JSON.parse(localStorage.getItem("user_info")) || {};

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [formData, setFormData] = useState({
    ...userInfo,
    birthday: formatDate(userInfo.birthday),
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await accountAPI.updateAvatar(formData);
        console.log("API Response:", response);

        setFormData((prev) => ({ ...prev, avatar: response.data.avatar }));
        toast.success("Avatar updated successfully!");

        const userInfo = JSON.parse(localStorage.getItem("user_info")) || {};
        userInfo.avatar = response.data.avatar;
        localStorage.setItem("user_info", JSON.stringify(userInfo));
      } catch (error) {
        console.error("Error updating avatar:", error);
        toast.error("Failed to update avatar. Please try again.");
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated Account Info:", formData);
    toast.success("Account information updated successfully!");
  };

  const handleCancel = () => {
    setFormData({ ...userInfo });
  };

  const calculateAge = (birthday) => {
    const birthDate = new Date(birthday);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();

    // Kiểm tra nếu tháng hoặc ngày sinh chưa đến trong năm hiện tại
    if (
      today.getMonth() < birthDate.getMonth() || // Tháng hiện tại nhỏ hơn tháng sinh
      (today.getMonth() === birthDate.getMonth() &&
        today.getDate() < birthDate.getDate()) // Cùng tháng nhưng ngày hiện tại nhỏ hơn ngày sinh
    ) {
      age--;
    }

    return age;
  };

  const handlePasswordChange = async (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.warning("New passwords do not match!");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.warning("New password must be at least 6 characters long!");
      return;
    }
    try {
      const res = await accountAPI.changePassword(passwordData);
      toast.success("Password updated successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error("Failed to update password. Please try again.");
    }
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

      <div className="profile-container d-flex justify-content-center m-5">
        <div className="w-100" style={{ maxWidth: "500px" }}>
          <div className="profile-header d-flex gap-3 align-items-center justify-content-center">
            <h2>Change Password</h2>
          </div>
          <form onSubmit={handlePasswordSubmit} className="profile-form">
            <div className="form-group mb-3">
              <label htmlFor="currentPassword">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                className="form-control"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                className="form-control"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="form-control"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>
            <div className="form-actions d-flex gap-3 justify-content-center">
              <button type="submit" className="form-submit-btn btn btn-primary">
                Update Password
              </button>
              <button
                type="button"
                className="form-cancel-btn btn btn-secondary"
                onClick={() =>
                  setPasswordData({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                  })
                }
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="course-container right"></div>
    </div>
  );
}

export default Profile;
