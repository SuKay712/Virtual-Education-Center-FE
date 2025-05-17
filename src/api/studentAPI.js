import axiosClient from "../utils/axiosCustomize";

const studentAPI = {
  getClasses: () => {
    const url = "/account/classes";
    return axiosClient.application.get(url);
  },

  getNextWeekClasses: () => {
    const url = "/account/classes/next-week";
    return axiosClient.application.get(url);
  },

  createMomoPayment: (paymentData) => {
    const url = "/momo-payment/payment";
    return axiosClient.application.post(url, paymentData);
  },
};
export default studentAPI;
