import axiosClient from "../utils/axiosCustomize";

const chatAPI = {
  getOrCreateChatbox: () => {
    const url = "/chat/chatbox";
    return axiosClient.application.get(url);
  },

  getAdminChatboxes: () => {
    const url = "/chat/admin/chatboxes";
    return axiosClient.application.get(url);
  },

  getStudentChatboxes: () => {
    const url = "/chat/student/chatboxes";
    return axiosClient.application.get(url);
  },

  getChatHistory: (chatboxId) => {
    const url = `/chat/chatbox/${chatboxId}/history`;
    return axiosClient.application.get(url);
  },

  sendMessage: (chatboxId, content) => {
    const url = `/chat/chatbox/${chatboxId}/message`;
    return axiosClient.application.post(url, { content });
  },
};

export default chatAPI;
