import axiosClient from "../utils/axiosCustomize";

const authAPI = {
  register: (formData) => {
    const url = "/auth/register";
    return axiosClient.applicationNoAuth.post(url, formData);
  },
  login: (formData) => {
    const url = "/auth/login";
    return axiosClient.applicationNoAuth.post(url, formData);
  },

  getCourses: () => {
    const url = "/courses/public";
    return axiosClient.applicationNoAuth.get(url);
  },

  createContact: (formData) => {
    const url = "/contacts";
    return axiosClient.applicationNoAuth.post(url, formData);
  },
};

export default authAPI;
