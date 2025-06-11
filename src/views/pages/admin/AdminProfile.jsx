import React, { useState } from "react";
import { IMAGES } from "../../../constants/images";
import { BsGenderMale, BsGenderFemale } from "react-icons/bs";
import { toast } from "react-toastify";
import accountAPI from "../../../api/accountAPI";
import { formatDateForInput } from "../../../utils/dateFormat";
import { AvatarImage } from "../../../utils/avatarUtils";
import "./AdminProfile.scss";

function AdminProfile() {
  const userInfo = JSON.parse(localStorage.getItem("user_info")) || {};

  const [formData, setFormData] = useState({
    ...userInfo,
    birthday: formatDateForInput(userInfo.birthday),
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
        const formDataUpload = new FormData();
        formDataUpload.append("file", file);
        const response = await accountAPI.updateAvatar(formDataUpload);
        setFormData((prev) => ({ ...prev, avatar: response.data.avatar }));
        toast.success("Avatar updated successfully!");
        const userInfo = JSON.parse(localStorage.getItem("user_info")) || {};
        userInfo.avatar = response.data.avatar;
        localStorage.setItem("user_info", JSON.stringify(userInfo));
      } catch (error) {
        toast.error("Failed to update avatar. Please try again.");
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Account information updated successfully!");
  };

  const handleCancel = () => {
    setFormData({ ...userInfo });
  };

  const calculateAge = (birthday) => {
    const birthDate = new Date(birthday).getTime();
    const today = new Date().getTime();
    const ageDate = new Date(today - birthDate);
    return ageDate.getUTCFullYear() - 1970;
  };

  const handlePasswordChange = (e) => {
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
      await accountAPI.changePassword(passwordData);
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
    <div className="admin-profile">
      <div className="admin-profile-container">
        <div className="admin-profile-header d-flex gap-3 align-items-center">
          <h2>Admin Profile</h2>
        </div>
        <form
          onSubmit={handleSubmit}
          className="admin-profile-form d-flex gap-4"
        >
          {/* Avatar Column */}
          <div className="admin-avatar-column text-center position-relative me-5">
            <AvatarImage
              avatar={formData.avatar}
              style={{ width: "150px", height: "150px" }}
              className="img-fluid rounded-circle mb-3 admin-avatar-image"
            />
            <label
              htmlFor="avatarUpload"
              className="admin-upload-overlay d-flex align-items-center justify-content-center"
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
              <span className="admin-age">
                Age: {calculateAge(formData.birthday)}
              </span>
              <span className="admin-gender-icon ms-2">
                {formData.gender === "Female" ? (
                  <BsGenderFemale style={{ color: "#007bff" }} />
                ) : (
                  <BsGenderMale style={{ color: "#007bff" }} />
                )}
              </span>
            </div>
          </div>

          {/* User Info Column */}
          <div className="admin-info-column flex-grow-1">
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
          <div className="admin-info-column flex-grow-1">
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
                value={formData.address || ""}
                onChange={handleChange}
              />
            </div>
          </div>
        </form>
        <div className="admin-profile-actions gap-3 mt-3">
          <button
            type="submit"
            className="admin-form-submit-btn"
            onClick={handleSubmit}
          >
            Save
          </button>
          <button
            type="button"
            className="admin-form-cancel-btn"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
        {/* Change Password Section */}
        <div className="admin-password-form-wrapper mt-5">
          <form
            onSubmit={handlePasswordSubmit}
            className="admin-profile-form d-flex gap-4 flex-column"
            style={{ width: "100%" }}
          >
            <div
              className="admin-info-column"
              style={{ maxWidth: "100%", width: "100%" }}
            >
              <div className="form-group mb-3">
                <label htmlFor="currentPassword">Current Password</label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  className="form-control"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  style={{ width: "100%" }}
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
                  style={{ width: "100%" }}
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
                  style={{ width: "100%" }}
                />
              </div>
              <div className="admin-profile-actions gap-3 mt-3">
                <button type="submit" className="admin-form-submit-btn">
                  Update Password
                </button>
                <button
                  type="button"
                  className="admin-form-cancel-btn"
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
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminProfile;
