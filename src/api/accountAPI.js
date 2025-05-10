import axiosClient from "../utils/axiosCustomize";

const accountAPI = {
  updateAvatar: (formData) => {
    const url = "/account/upload-avatar";
    return axiosClient.formData.put(url, formData);
  },
  changePassword: (formData) => {
    const url = "/account/update-password";
    return axiosClient.application.put(url, formData);
  },
};
export default accountAPI;
