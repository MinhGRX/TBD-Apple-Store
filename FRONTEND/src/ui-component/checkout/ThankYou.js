import React from 'react';
import '../../scss/ThankYou.scss';
import Header from 'ui-component/trangchu/Header';
import Footer from 'ui-component/trangchu/Footer';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { useEffect } from 'react';
import { count } from 'services/GioHangService';

function ThankYou() {
  const navigate = useNavigate();
  const [productCount, setProductCount] = useState(0);
  const dataLogin = JSON.parse(localStorage.getItem('dataLogin'));
  const id = JSON.parse(localStorage.getItem('res'));
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
  }, [dataLogin, id, idGH, productCount]);

  const countSP = async (id) => {
    const res = await count(id);
    if (res) {
      setProductCount(res.data);
    }
  };

  return (
    <div>
      <Header productCount={productCount}></Header>
      <div className="container text-center thong-bao-thanh-cong">
        <i className="fa-regular fa-circle-check fa-xl icon-succsess"></i>
        <h3 className="title-tks mt-4">Cảm ơn bạn đã đặt hàng</h3>
        <p className="text mt-3">Chúng tôi sẽ liên hệ Quý khách để xác nhận đơn hàng trong thời gian sớm nhất</p>
        <button type="button" className="btn btn-warning" onClick={() => navigate('/trang-chu')}>
          Tiếp tục mua sắm
        </button>
      </div>
      <Footer></Footer>
    </div>
  );
}

export default ThankYou;