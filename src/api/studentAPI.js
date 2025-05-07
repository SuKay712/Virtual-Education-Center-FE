import axiosClient from "../utils/axiosCustomize";

const studentAPI = {
  getClasses: () => {
    const url = "/account/classes";
    return axiosClient.application.get(url);
  },
};
export default studentAPI;
