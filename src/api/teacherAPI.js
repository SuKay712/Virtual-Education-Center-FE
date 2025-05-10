import axiosClient from "../utils/axiosCustomize";

const teacherAPI = {
  getClasses: () => {
    const url = "/teacher/classes";
    return axiosClient.application.get(url);
  },
  getStudents: () => {
    const url = "/teacher/students";
    return axiosClient.application.get(url);
  },
  getSchedule: () => {
    const url = "/teacher/schedule";
    return axiosClient.application.get(url);
  },
  updateClass: (classId, data) => {
    const url = `/teacher/classes/${classId}`;
    return axiosClient.application.put(url, data);
  },
  createClass: (data) => {
    const url = "/teacher/classes";
    return axiosClient.application.post(url, data);
  },
  deleteClass: (classId) => {
    const url = `/teacher/classes/${classId}`;
    return axiosClient.application.delete(url);
  },
};

export default teacherAPI;
