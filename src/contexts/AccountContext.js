import { createContext, useState, useEffect, useMemo, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../utils/axiosCustomize';
const AccountContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('access_token'));
  const [account, setAccount] = useState(JSON.parse(localStorage.getItem('user_info')));

  const providerValue = useMemo(
    () => ({ token, setToken, account, setAccount }),
    [token, setToken, account, setAccount],
  );

  const navigate = useNavigate();

  useEffect(() => {
    if (token !== 'null') {
      axiosClient.application.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      axiosClient.formData.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      // User logout
      delete axiosClient.application.defaults.headers.common['Authorization'];
      delete axiosClient.formData.defaults.headers.common['Authorization'];

      setAccount(null);
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_info');
    }
  }, [token, navigate]);

  return <AccountContext.Provider value={providerValue}>{children}</AccountContext.Provider>;
};

export const useAuth = () => {
  return useContext(AccountContext);
};

export default AccountContext;
