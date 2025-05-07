import axiosClient from "../../utils/axiosCustomize";
import { toast } from "react-toastify";

const authAPI = {
  login: async (email, password) => {
    try {
      const url = "/auth/login";
      const response = await axiosClient.applicationNoAuth.post(url, {
        email,
        password,
      });
      toast.success("Login successfully!");
      return response;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Login failed. Please try again."
      );
      throw error;
    }
  },
};

export default authAPI;
