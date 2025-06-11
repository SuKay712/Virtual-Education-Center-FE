import axiosClient from "../utils/axiosCustomize";

const adminAPI = {
  getAccounts: () => {
    const url = "/account/admin";
    return axiosClient.application.get(url);
  },

  createAccount: (formData) => {
    const url = "/account/admin";
    return axiosClient.application.post(url, formData);
  },

  updateAccount: (accountId, formData) => {
    const url = `/account/admin/${accountId}`;
    return axiosClient.application.put(url, formData);
  },

  deleteAccount: (accountId) => {
    const url = `/account/admin/${accountId}`;
    return axiosClient.application.delete(url);
  },

  updateAvatar: (accountId, formData) => {
    const url = `/account/admin/${accountId}/upload-avatar`;
    return axiosClient.formData.put(url, formData);
  },

  getCourses: () => {
    const url = "/course/admin";
    return axiosClient.application.get(url);
  },

  addLecture: (formData) => {
    const url = "/lecture/admin";
    return axiosClient.formData.post(url, formData);
  },

  updateLecture: (lectureId, formData) => {
    const url = `/lecture/admin/${lectureId}`;
    return axiosClient.formData.put(url, formData);
  },

  downloadTheory: (theoryId) => {
    const url = `/theory/${theoryId}/download`;
    return axiosClient.download.get(url);
  },

  deleteTheory: (theoryId) => {
    const url = `/theory/admin/${theoryId}`;
    return axiosClient.application.delete(url);
  },

  getClasses: () => {
    const url = "/class/admin";
    return axiosClient.application.get(url);
  },

  updateClass: (classId, data) => {
    const url = `/class/admin/${classId}`;
    return axiosClient.application.put(url, data);
  },

  getFreeTimes: () => {
    const url = "/free-times/admin";
    return axiosClient.application.get(url);
  },

  createBooking: (formData) => {
    const url = "/booking/admin";
    return axiosClient.formData.post(url, formData);
  },

  getBookings: () => {
    const url = "/booking/admin";
    return axiosClient.application.get(url);
  },

  updateBooking: (bookingId, data) => {
    const url = `/booking/admin/${bookingId}/update-status`;
    return axiosClient.application.put(url, data);
  },
};

export default adminAPI;
