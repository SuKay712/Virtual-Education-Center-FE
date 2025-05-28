import axiosClient from "../utils/axiosCustomize";

const teacherAPI = {
  getBookings: () => {
    const url = "/account/bookings";
    return axiosClient.application.get(url);
  },
  getHistory: () => {
    const url = "/booking/history";
    return axiosClient.application.get(url);
  },
  updateBookingStatus: (bookingId, formData) => {
    const url = `/booking/${bookingId}/update-status`;
    return axiosClient.application.put(url, formData);
  },
  createFreeTime: (formData) => {
    const url = "/free-times/create";
    return axiosClient.application.post(url, formData);
  },
  updateFreeTime: (freeTimeId, formData) => {
    const url = `/free-times/${freeTimeId}/update`;
    return axiosClient.application.put(url, formData);
  },
  getFreeTimes: () => {
    const url = "/free-times/list";
    return axiosClient.application.get(url);
  },
};

export default teacherAPI;
