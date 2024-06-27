import React from 'react';
import '../../../scss/ThankYou.scss';
import Header from 'ui-component/trangchu/Header';
import Footer from 'ui-component/trangchu/Footer';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { useEffect } from 'react';
import { count, saveTransactionNo } from 'services/GioHangService';

function ThanhToanThatBai() {
  const navigate = useNavigate();
  const [productCount, setProductCount] = useState(0);
  const dataLogin = JSON.parse(localStorage.getItem('dataLogin'));
  const id = JSON.parse(localStorage.getItem('res'));
  const idGH = localStorage.getItem('idGH') || '';
  const urlParams = new URLSearchParams(window.location.search);
  const transactionNo = urlParams.get('vnp_TransactionNo');

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
    if (transactionNo) {
      save(id, transactionNo);
    }
  }, [dataLogin, id, idGH, productCount, transactionNo]);

  const save = async (id, transactionNo) => {
    const res = await saveTransactionNo(id, transactionNo);
    if (res) {
      console.log(res.data);
    }
  };

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
        <i className="fa-regular fa-circle-xmark fa-xl icon-error"></i>
        <h3 className="title-tks mt-4">Thanh toán thất bại</h3>
        <p className="text mt-3">Đơn của quý khách không thể hoàn thành thanh toán</p>
        <button type="button" className="btn btn-warning" onClick={() => navigate('/trang-chu')}>
          Thanh toán lại
        </button>
      </div>
      <Footer></Footer>
    </div>
  );
}

export default ThanhToanThatBai;