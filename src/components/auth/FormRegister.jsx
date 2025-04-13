import styles from './FormAuth.scss';
import { ICONS } from '../../constants/icons';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PasswordInput from '../input/PasswordInput';
import { toast } from 'react-toastify';
import LoginAPI from '../../api/LoginAPI';

const FormRegister = () => {
  const navigate = useNavigate();

  const [password, setPassword] = useState();
  const [email, setEmail] = useState();
  const [name, setName] = useState();
  const [confirmPassword, setConfirmPassword] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(email)) {
      toast.error('Email không đúng định dạng');
    }

    if (password !== confirmPassword) {
      toast.error('Mật khẩu và xác nhận mật khẩu không khớp');
    }

    const formData = {
      name: name,
      email: email,
      password: password,
      confirmPassword: confirmPassword,
    };

    try {
      // Gọi API đăng ký
      const response = await LoginAPI.register(formData);

      // Xử lý khi đăng ký thành công
      toast.success('Đăng ký thành công. Kiểm tra email để kích hoạt tài khoản');
    } catch (error) {
      toast.error('Email đã tồn tại trong hệ thống');
    }
  };

  return (
    <div className="justify-content-center form-login">
      <button
        className="tab_button"
        onClick={() => {
          navigate('/auth/login');
        }}
      >
        Đăng nhập
      </button>
      <button className="tab_button actived">Đăng kí</button>
      <form className="form-data p-4">
        <div className="form-group mb-3">
          <label htmlFor="name" className="form-label text-color__black">
            Tên
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            placeholder="Nhập tên của bạn"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="email" className="form-label text-color__black">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="Nhập email của bạn"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <PasswordInput
          className={'form-group'}
          classNameLabel={'form-label text-color__black'}
          name="password"
          label="Mật khẩu hiện tại"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={'Nhập mật khẩu'}
          style={{ padding: '8px' }}
        />
        <PasswordInput
          className={'form-group'}
          classNameLabel={'form-label text-color__black'}
          name="confirm_password"
          label="Nhập lại mật khẩu"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder={'Nhập lại mật khẩu'}
          style={{ padding: '8px' }}
        />

        <button
          className="btn btn-primary border-0 w-100 mt-2"
          style={{ background: '#FA8232' }}
          type="submit"
          onClick={handleSubmit}
        >
          ĐĂNG KÍ
          <img src={ICONS.arrow_right_login} className="ms-2" />
        </button>
      </form>
    </div>
  );
};

export default FormRegister;
