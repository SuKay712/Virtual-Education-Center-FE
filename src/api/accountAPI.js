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
  getNotifications: () => {
    const url = "/notifications";
    return axiosClient.application.get(url);
  },

  getRoadmaps: () => {
    const url = "/roadmap";
    return axiosClient.application.get(url);
  },
  getRoadmapDetail: (roadmapId) => {
    const url = `/roadmap/${roadmapId}`;
    return axiosClient.application.get(url);
  },
};
export default accountAPI;
