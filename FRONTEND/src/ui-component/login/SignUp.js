/* eslint-disable react/prop-types */
import React from 'react';
import { SignUp } from 'services/LoginService';
// import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../../scss/SignUp.scss';

function SignUpForm(props) {
  const { setStates, handleOnClick } = props;
  // const navigate = useNavigate();
  const [state, setState] = React.useState({
    name: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    passwordMatch: false, // Trạng thái kiểm tra mật khẩu xác nhận
    trangThai: 1
  });

  const handleChange = (evt) => {
    const { name, value } = evt.target;

    setState({
      ...state,
      [name]: value,
      // Kiểm tra mật khẩu xác nhận và cập nhật trạng thái passwordMatch
      passwordMatch: name === 'passwordConfirmation' ? state.password === value : state.passwordMatch,
      [evt.target.name]: value
    });
  };

  const post = async ({ name, email, password, passwordConfirmation }) => {
    if (!name || !email || !password || !passwordConfirmation) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }
    //Name
    if (/\d/.test(name)) {
      toast.error('Tên không được chứa chữ số');
      return;
    } else if (name.length > 30) {
      toast.error('Tên không được quá 30 ký tự');
      return;
    }
    //Email
    if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) {
      toast.error('Email không đúng định dạng');
      return;
    }
    //Password
    if (password.length > 16) {
      toast.error('Mật khẩu không được quá 16 ký tự');
      return;
    } else if (password.length < 6) {
      toast.error('Mật khẩu không được ít hơn 6 ký tự');
      return;
    }
    // Kiểm tra xem mật khẩu có ít nhất một chữ cái và ít nhất một số, và không có ký tự đặc biệt
    if (!/(?=.*[a-zA-Z])(?=.*\d)^[a-zA-Z0-9]*$/.test(password)) {
      toast.error('Mật khẩu phải chứa ít nhất một chữ cái và ít nhất một số, và không được chứa ký tự đặc biệt');
      return;
    }
    if (password !== passwordConfirmation) {
      toast.error('Mật khẩu và mật khẩu xác nhận không khớp');
      return;
    }

    const userData = {
      tenKhachHang: name,
      email: email,
      matKhau: password
    };

    try {
      const res = await SignUp(userData);
      if (res) {
        toast.success('Đăng Ký Thành Công');
        handleOnClick('signIn');
        setStates({
          email: email,
          password: password
        });
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // Xử lý khi email đã tồn tại
        toast.error(error.response.data);
      } else {
        // Xử lý lỗi khác nếu cần
        toast.error('Đã có lỗi xảy ra');
      }
    }
  };

  const handleOnSubmit = (evt) => {
    evt.preventDefault();
    post(state);
  };

  return (
    <div className="form-container sign-up-container">
      <form className="frm" onSubmit={handleOnSubmit}>
        <h1 id="title">Đăng ký</h1>
        <input className="ipt" type="text" name="name" value={state.name} onChange={handleChange} placeholder="Name" />
        <input className="ipt" type="email" name="email" value={state.email} onChange={handleChange} placeholder="Email" />
        <input className="ipt" type="password" name="password" value={state.password} onChange={handleChange} placeholder="Password" />
        <input
          className={`ipt ${state.passwordMatch ? 'valid' : ''}`}
          type="password"
          name="passwordConfirmation"
          value={state.passwordConfirmation}
          onChange={handleChange}
          placeholder="Repeat Password"
        />
        <button className="button-login" type="submit">
          Đăng ký
        </button>
      </form>
    </div>
  );
}

export default SignUpForm;