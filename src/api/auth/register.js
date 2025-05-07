import axiosClient from "../../utils/axiosCustomize";
import { toast } from "react-toastify";

const authAPI = {
  register: async (fullName, email, password) => {
    try {
      const url = "/auth/register";
      const response = await axiosClient.applicationNoAuth.post(url, {
        fullName,
        email,
        password,
      });
      toast.success("Registration successful! Please login to continue.");
      return response;
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
      throw error;
    }
  },
};

export default authAPI;
