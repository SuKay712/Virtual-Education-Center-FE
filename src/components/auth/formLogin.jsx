import { ICONS } from '../../constants/icons';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LoginAPI from '../../api/LoginAPI';
import { useAuth } from '../../contexts/AccountContext';
import { ArrowRightOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';

const FormLogin = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [hasShownMessage, setHasShownMessage] = useState(false);

  const [password, setPassword] = useState();

  const [email, setEmail] = useState();
  const [textError, setTextError] = useState();

  const { setAccount, setToken } = useAuth();
  const location = useLocation();
  const fetchLogin = async (formData) => {
    try {
      const res = await LoginAPI.login(formData);
      toast.success('Login successfully!');
      const accessToken = res.data.acess_token;
      const userInfo = {
        name: res.data.name,
        displayName: res.data.displayName,
        address: res.data.address,
        avatar: res.data.avatar,
        tel: res.data.tel,
        gender: res.data.gender,
        email: res.data.email,
        role: res.data.role,
      };
      if (accessToken) {
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('user_info', JSON.stringify(userInfo));
        setToken(accessToken);
        setAccount(userInfo);
        setTimeout(() => {
          if (res.data.role === 'customer') {
            navigate('/');
          } else {
            navigate('/admin/dashboard');
          }
        }, 2000);
      } else {
        setTextError('* Login failed, no access token received');
      }
    } catch (error) {
      toast.error('Email or password was incorrect, please entry again!');
    }
  };

  const handleHidePassword = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleSubmitLogin = (event) => {
    event.preventDefault();
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(email)) {
      setTextError('*Vui lòng nhập email hợp lệ');
      return;
    }

    const formData = {
      email,
      password,
    };

    fetchLogin(formData);
  };
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const message = params.get('message');
    if (message && !hasShownMessage) {
      toast.success(message);
      setHasShownMessage(true);
    }
  }, [location]);
  return (
    <div className="justify-content-center form-login">
      <div>
        <button className="tab_button actived">Đăng nhập</button>
        <button
          className="tab_button"
          onClick={() => {
            navigate('/auth/register');
          }}
        >
          Đăng ký
        </button>
        <form className="form-data p-4">
          <div className="form-group mb-3">
            <label htmlFor="email" className="form-label text-color__black">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {textError && <p className="text-danger">{textError}</p>}
          </div>
          <div className="form-group mb-3">
            <label htmlFor="password" className="form-label text-color__black">
              Mật khẩu
            </label>
            <div className="position-relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <img
                src={ICONS.eye}
                className="position-absolute hide-password"
                alt="Eye Icon"
                onClick={handleHidePassword}
              />
            </div>
          </div>
          <div className="text-end mt-3">
            <a href="/auth/reset-password" className="forgot-password-link">
              Quên mật khẩu?
            </a>
          </div>
          <button
            className="btn btn-primary border-0 w-100 mt-2"
            style={{ background: '#FA8232' }}
            type="submit"
            onClick={handleSubmitLogin}
          >
            ĐĂNG NHẬP
            <ArrowRightOutlined className="ms-2" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormLogin;
