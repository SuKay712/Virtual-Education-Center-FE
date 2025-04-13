import axiosClient from '../utils/axiosCustomize';

const accountAPI = {
  adminListAccount: (page, limit, role) => {
    const url = '/admin/accounts';
    const params = {
      page: page,
      limit: limit,
      role: role,
    };
    return axiosClient.application.get(url, { params });
  },
  adminUpdateAccount: (accountId, account) => {
    const url = '/admin/accounts';
    return axiosClient.application.put(url, { accountId: accountId, ...account });
  },
  userUpdateAccount: (formData) => {
    const url = '/accounts/update';
    return axiosClient.formData.put(url, formData);
  },
  adminCreateStaffAccount: (formData) => {
    const url = '/admin/accounts';
    return axiosClient.formDataAuth.post(url, formData);
  },
  changePassword: (formData) => {
    const url = '/accounts/changePassword';
    return axiosClient.application.put(url, formData);
  },
};
export default accountAPI;
