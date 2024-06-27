/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import Footer from 'ui-component/trangchu/Footer';
import Header from 'ui-component/trangchu/Header';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { count } from 'services/GioHangService';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { yeuCauDoiHang } from 'services/DoiHangService';

function LoadingPay() {
  const urlParams = new URLSearchParams(window.location.search);
  const transactionNo = urlParams.get('vnp_TransactionNo');
  const transactionStaus = urlParams.get('vnp_TransactionStatus');
  const idHDCT = localStorage.getItem('idHDCT');
  const yeuCauDoi = JSON.parse(localStorage.getItem('yeuCauDoi'));
  const [productCount, setProductCount] = useState(0);
  const dataLogin = JSON.parse(localStorage.getItem('dataLogin'));
  const idGH = localStorage.getItem('idGH') || '';

  useEffect(() => {
    if (transactionStaus === '00') {
      // So sánh với chuỗi '00' thay vì số
      requestDoiHang(idHDCT, yeuCauDoi);
    }
    if (transactionStaus === '02') {
      toast.error('Giao dịch thất bại');
    }
  }, [idHDCT, transactionNo, transactionStaus]);

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
  }, [dataLogin, idGH, productCount]);

  const countSP = async (id) => {
    const res = await count(id);
    if (res) {
      setProductCount(res.data);
    }
  };

  const requestDoiHang = async (id, value) => {
    let res = await yeuCauDoiHang(id, value);
    if (res) {
      toast.success('Thành công');
      window.location.href = 'http://localhost:3000/don-hang/chi-tiet/' + idHDCT;
    }
  };

  return (
    <div>
      <Header productCount={productCount}></Header>
      <Box sx={{ display: 'flex', justifyContent: 'center', height: 550, alignItems: 'center' }}>
        <CircularProgress />
      </Box>
      <Footer></Footer>
    </div>
  );
}

export default LoadingPay;