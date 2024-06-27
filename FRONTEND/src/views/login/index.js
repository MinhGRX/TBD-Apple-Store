import React from 'react';
import Footer from 'ui-component/trangchu/Footer';
import Header from 'ui-component/trangchu/Header';
import IndexLogin from 'ui-component/login';
import { useState } from 'react';
import { useEffect } from 'react';
import { count } from 'services/GioHangService';
import ForgotPasswordModal from 'ui-component/login/ForgotPasswordModal';

function Login() {
  const [productCount, setProductCount] = useState(0);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = React.useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);

  const dataLogin = JSON.parse(localStorage.getItem('dataLogin'));
  const idGH = localStorage.getItem('idGH') || '';

  useEffect(() => {
    if (!dataLogin) {
      const storedProductList = JSON.parse(localStorage.getItem('product'));
      if (storedProductList) {
        const totalCount = storedProductList.reduce((count, product) => count + product.soLuong, 0);
        setProductCount(totalCount);
      }
    }

    // Kiểm tra nếu idGH không tồn tại thì không gọi countSP
    if (idGH) {
      countSP(idGH);
    }
  }, [dataLogin, idGH]);
  const toggleSearchInput = () => {
    setShowSearchInput(!showSearchInput);
  };

  const countSP = async (id) => {
    const res = await count(id);
    if (res) {
      setProductCount(res.data);
    }
  };

  const openForgotPasswordModal = () => {
    setShowForgotPasswordModal(true);
  };

  const closeForgotPasswordModal = () => {
    setShowForgotPasswordModal(false);
  };

  return (
    <div>
      <Header productCount={productCount} toggleSearchInput={toggleSearchInput} showSearchInput={showSearchInput} />
      <IndexLogin show={showForgotPasswordModal} onHide={closeForgotPasswordModal} openForgotPasswordModal={openForgotPasswordModal} />
      <Footer />
      <ForgotPasswordModal show={showForgotPasswordModal} onHide={closeForgotPasswordModal} />
    </div>
  );
}

export default Login;