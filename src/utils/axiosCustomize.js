import axios from "axios";
import queryString from "query-string";

const getToken = () => localStorage.getItem("access_token");

const axiosClient = {
  application: axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
      "content-type": "application/json",
      "Accept-Language": "vi",
    },
    paramsSerializer: (params) => queryString.stringify(params),
  }),

  applicationNoAuth: axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
      "content-type": "application/json",
    },
    paramsSerializer: (params) => queryString.stringify(params),
  }),

  formData: axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
      "content-type": "multipart/form-data",
      "Accept-Language": "vi",
    },
  }),

  formDataAuth: axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
      "content-type": "multipart/form-data",
      "Accept-Language": "vi",
    },
  }),

  formDataNoAuth: axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
      "content-type": "multipart/form-data",
      "Accept-Language": "vi",
    },
  }),

  download: axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    responseType: "blob",
    headers: {
      Accept: "application/pdf",
    },
  }),
};

// Add request interceptor to add token to every request
axiosClient.application.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosClient.formDataAuth.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add interceptor for download instance
axiosClient.download.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const handleLogout = (navigate, toast) => {
  toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại");
  setTimeout(() => {
    localStorage.removeItem("user_info");
    localStorage.removeItem("access_token");
    navigate("/login");
  }, 5000);
};

export const setupInterceptors = (navigate, toast) => {
  axiosClient.application.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response) {
        const { status, data } = error.response;
        if (
          status === 401 ||
          (status === 403 && data.message === "Token has expired")
        ) {
          handleLogout(navigate, toast);
        }
      }
      return Promise.reject(error);
    }
  );

  axiosClient.formDataAuth.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response) {
        const { status, data } = error.response;
        if (
          status === 401 ||
          (status === 403 && data.message === "Token has expired")
        ) {
          handleLogout(navigate, toast);
        }
      }
      return Promise.reject(error);
    }
  );
};

export default axiosClient;
