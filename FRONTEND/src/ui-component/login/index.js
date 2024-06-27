/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import '../../scss/Login.scss';
import SignInForm from './SignIn';
import SignUpForm from './SignUp';

export default function IndexLogin(props) {
  const [type, setType] = useState('signIn');
  const { openForgotPasswordModal, showForgotPasswordModal, closeForgotPasswordModal } = props;
  const [state, setState] = React.useState({
    email: '',
    password: ''
  });
  const handleOnClick = (text) => {
    if (text !== type) {
      setType(text);
      return;
    }
  };
  const containerClass = 'ctnn container ' + (type === 'signUp' ? 'right-panel-active' : '');
  return (
    <div className="App">
      <div className={containerClass} id="container">
        <SignUpForm handleOnClick={handleOnClick} setStates={setState} />
        <SignInForm
          state={state}
          setState={setState}
          show={showForgotPasswordModal}
          onHide={closeForgotPasswordModal}
          openForgotPasswordModal={openForgotPasswordModal}
        />
        <div className="overlay-container">
          <div className="overlay1">
            <div className="overlay-panel overlay-left">
              <h1>Chào mừng trở lại</h1>
              <p className="text-login">Để duy trì kết nối với chúng tôi vui lòng đăng nhập bằng thông tin cá nhân của bạn</p>
              <button className="ghost button-login" id="signIn" onClick={() => handleOnClick('signIn')}>
                Đăng nhập
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Xin chào bạn!</h1>
              <p className="text-login">Nhập thông tin cá nhân của bạn và bắt đầu hành trình với chúng tôi</p>
              <button className="ghost button-login" id="signUp" onClick={() => handleOnClick('signUp')}>
                Đăng ký
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}