/* eslint-disable react-hooks/exhaustive-deps */
import { Box, CircularProgress } from '@mui/material';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { clearGH, saveTransactionNo, thanhToan } from 'services/GioHangService';

function CheckThanhToan() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const transactionNo = urlParams.get('vnp_TransactionNo');
  const idHDCT = localStorage.getItem('idHDCT');
  const transactionStaus = urlParams.get('vnp_TransactionStatus');
  const product = JSON.parse(localStorage.getItem('productHDUpdate'));
  const idGH = localStorage.getItem('idGH') || '';

  useEffect(() => {
    if (transactionStaus === '00') {
      // So sánh với chuỗi '00' thay vì số
      clear(idGH, product.id);
      thanhToanHD(product.id, product, '');
      navigate('/checkout/thankyou');
    }
    if (transactionStaus === '02') {
      navigate('/pay-error');
    }
  }, [idHDCT, transactionNo, transactionStaus]);

  const save = async (id, transactionNo) => {
    const res = await saveTransactionNo(id, transactionNo);
    if (res) {
      console.log(res.data);
    }
  };

  const clear = async (id, idHD) => {
    try {
      await clearGH(id, idHD);
    } catch (error) {
      console.log(error);
    }
  };

  const thanhToanHD = async (id, value, nguoiTao) => {
    try {
      const res = await thanhToan(id, value, nguoiTao);
      if (res) {
        save(res.data.hinhThucThanhToan.id, transactionNo);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', height: 800, alignItems: 'center' }}>
      <CircularProgress />
    </Box>
  );
}

export default CheckThanhToan;