/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import React from 'react';
import { useEffect } from 'react';
import { searchByTrangThai, searchCTSPofDH } from 'services/ServiceDonHang';
import '../../scss/CheckOut.scss';
import ButtonMUI from '@mui/material/Button';
import { useState } from 'react';
import { toast } from 'react-toastify';
import ModalTraHang from 'ui-component/login/ModalTraHang';
import { addSPToDH, deleteSPDH, getAll, update, yeuCauDoiHang } from 'services/DoiHangService';
import ModalAddHangDoi from 'ui-component/login/ModalAddHangDoi';
import TableKCMS from 'views/ban-hang-tai-quay/TableKCMS';
import { getAllByIdSPTT } from 'services/SanPhamService';
import { payOnline } from 'services/PayService';

function DoiHang(props) {
  const { data, dataLogin, values, setValues } = props;
  const [isUpdate, setIsUpdate] = useState(false);
  const [isUpdateHD, setIsUpdateHD] = useState(false);
  const [dataHDCT, setDataHDCT] = useState([]);
  const [dataHDCTDH, setDataHDCTDH] = useState([]);
  const [dataSPDoi, setDataSPDoi] = useState([]);
  const [dataSP, setDataSP] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalAmountDH, setTotalAmountDH] = useState(0);
  const [totalAmountDHSP, setTotalAmountDHSP] = useState(0);
  const [mauSacKC, setMauSacKC] = useState([]);
  const [isShow, setIsshow] = useState(false);
  const [urlPay, setUrlPay] = useState('');
  const [isShowDH, setIsshowDH] = useState(false);
  const [isDoiHang, setIsDoiHang] = useState(false);
  const [isShowMSKC, setIsshowMSKC] = useState(false);
  const [term, setTerm] = useState('');
  const [ghiChu, setGhiChu] = useState({
    ghiChu: ''
  });
  const [yeuCauDoi, setYeuCauDoi] = useState({
    lichSuHoaDon: {
      ghiChu: ''
    },
    doiHang: {
      soHangDoi: 0,
      tongTienHangDoi: 0,
      phuongThucThanhToan: '',
      tienKhachPhaiTra: 0,
      nguoiTao: ''
    }
  });

  const [valuesAdd, setValuesAdd] = useState({
    hoaDonChiTiet: {
      chiTietSanPham: {
        id: ''
      },
      hoaDon: {
        id: ''
      },
      soLuongHangDoi: 0,
      soLuongYeuCauDoi: 1,
      donGia: 0
    },
    doiHang: {
      soHangDoi: 0,
      trangThai: 0,
      ghiChu: '',
      nguoiTao: '',
      tongTienHangDoi: 0,
      phuongThucThanhToan: '',
      tienKhachPhaiTra: 0
    }
  });

  const listLyDo = [
    {
      label: 'Hàng lỗi',
      value: 'Hàng lỗi'
    },
    {
      label: 'Thiếu hàng',
      value: 'Thiếu hàng'
    },
    {
      label: 'Người bán gửi sai hàng',
      value: 'Người bán gửi sai hàng'
    },
    {
      label: 'Khác',
      value: ''
    }
  ];

  useEffect(() => {
    searchSPofDH(term);
  }, [term]);

  useEffect(() => {
    let sum = 0;
    let count = 0;
    dataHDCT.forEach((d) => {
      sum += d.soLuongYeuCauDoi * d.donGia;
    });
    let sumDH = 0;
    let sumDG = 0;
    dataSPDoi.forEach((d) => {
      sumDH += d.soLuongHangDoi * d.donGia;
      sumDG += d.donGia;
      count += d.soLuongHangDoi;
    });
    setValuesAdd({
      ...valuesAdd,
      doiHang: {
        ...valuesAdd.doiHang,
        trangThai: 15,
        tongTienHangDoi: sumDH,
        soHangDoi: count,
        nguoiTao: dataLogin.tenKhachHang,
        tienKhachPhaiTra: sumDH - sum
      }
    });
    setTotalAmount(sumDH - sum);
    setTotalAmountDH(sum);
    setTotalAmountDHSP(sumDG);
  }, [dataHDCT, dataSPDoi]);

  useEffect(() => {
    setValuesAdd({
      ...valuesAdd,
      hoaDonChiTiet: {
        ...valuesAdd.hoaDonChiTiet,
        hoaDon: {
          id: dataHDCT[0] && dataHDCT[0].hoaDon && dataHDCT[0].hoaDon.id
        }
      }
    });
  }, [isShowDH]);

  useEffect(() => {
    searchByTT(dataLogin.id, data.trangThai);
  }, []);

  useEffect(() => {
    VNP(totalAmount);
  }, [yeuCauDoi, totalAmount]);

  useEffect(() => {
    if (isDoiHang) {
      if (yeuCauDoi.doiHang.phuongThucThanhToan === true) {
        requestDoiHang(dataHDCT[0].hoaDon.id, yeuCauDoi);
      } else {
        localStorage.setItem('idHDCT', dataHDCT[0].hoaDon.id);
        localStorage.setItem('yeuCauDoi', JSON.stringify(yeuCauDoi));
        window.location.href = urlPay;
      }
    }
  }, [isDoiHang]);

  useEffect(() => {
    if (dataHDCT[0] && dataHDCT[0].hoaDon && dataHDCT[0].hoaDon.id) {
      findAll(dataHDCT[0].hoaDon.id);
    }
  }, [dataHDCT]);

  useEffect(() => {
    if (isUpdate) {
      handleUpdateSL(dataHDCT);
      setIsUpdate(false);
    } else {
      handleUpdateSL(dataHDCTDH);
      setIsUpdateHD(false);
    }
  }, [isUpdate, isUpdateHD]);

  const searchSPofDH = async (term) => {
    const res = await searchCTSPofDH(term);
    if (res) {
      setDataSP(res.data);
    }
  };

  const deleteHD = async (idHDCT) => {
    const res = await deleteSPDH(idHDCT);
    if (res) {
      toast.success('Xoá thành công');
      let sum = 0;
      dataHDCT.forEach((d) => {
        sum += d.soLuongYeuCauDoi * d.donGia;
      });
      let sumDH = 0;
      let sumDG = 0;
      dataSPDoi.forEach((d) => {
        sumDH += d.soLuongHangDoi * d.donGia;
        sumDG += d.donGia;
      });
      // console.log(sumDH);
      setTotalAmount(sum - sumDH);
      setTotalAmountDH(sum);
      setTotalAmountDHSP(sumDG);
      findAll(dataHDCT[0].hoaDon.id);
    }
  };

  const findAll = async (id) => {
    const res = await getAll(id);
    if (res) {
      setDataSPDoi(res.data);
    }
  };

  const searchByTT = async (id, values) => {
    const res = await searchByTrangThai(id, values);
    if (res) {
      setValues(res.data.hoaDonList);
    }
  };

  const updateSL = async (value) => {
    const res = await update(value);
    if (res) {
      // findAll(dataHDCT[0].hoaDon.id);
    }
  };

  const handleUpdateSL = (value) => {
    updateSL(value);
  };

  const handleDelete = (id) => {
    deleteHD(id);
  };

  const handleClose = () => {
    setIsshow(false);
  };

  function convertToCurrency(number) {
    // Chuyển đổi số thành định dạng tiền Việt Nam
    const formatter = new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    });
    return formatter.format(number);
  }

  const handleDetail = (id) => {
    getAllMSKC(id);
    setIsshowMSKC(true);
    setIsshowDH(false);
  };

  const handleDetailSL = (id, donGia) => {
    // setIdCTSP(id);
    setValuesAdd({
      ...valuesAdd,
      hoaDonChiTiet: {
        ...valuesAdd.hoaDonChiTiet,
        chiTietSanPham: {
          id: id
        },
        donGia: donGia
      }
    });
  };

  const addSP = async (value) => {
    let res = await addSPToDH(value);
    if (res) {
      setIsshow(true);
      setIsshowDH(false);
      setIsshowMSKC(false);
      findAll(dataHDCT[0].hoaDon.id);
      toast.success('Chọn sản phẩm thành công');
      let sum = 0;
      let count = 0;
      dataHDCT.forEach((d) => {
        sum += d.soLuongYeuCauDoi * d.donGia;
      });
      let sumDH = 0;
      let sumDG = 0;
      dataSPDoi.forEach((d) => {
        sumDH += d.soLuongHangDoi * d.donGia;
        sumDG += d.donGia;
        count += d.soLuongHangDoi;
      });
      setValuesAdd({
        ...valuesAdd,
        doiHang: {
          ...valuesAdd.doiHang,
          trangThai: 15,
          tongTienHangDoi: sumDH,
          soHangDoi: count,
          nguoiTao: dataLogin.tenKhachHang,
          tienKhachPhaiTra: sumDH - sum
        }
      });
      setTotalAmount(sumDH - sum);
      setTotalAmountDH(sum);
      setTotalAmountDHSP(sumDG);
    }
  };

  const handleAddSP = () => {
    addSP(valuesAdd);
  };

  const requestDoiHang = async (id, value) => {
    let res = await yeuCauDoiHang(id, value);
    if (res) {
      toast.success('Thành công');
      window.location.reload();
    }
  };

  const handleDoiHang = () => {
    if (yeuCauDoi.lichSuHoaDon.ghiChu === '') {
      toast.error('Vui lòng nhập ghi chú');
      return;
    }
    if (yeuCauDoi.doiHang.phuongThucThanhToan === '' && totalAmount < 0) {
      toast.error('Vui lòng chọn phương thức thanh toán');
      return;
    }
    setIsDoiHang(true);
    let count = 0;
    let sumDH = 0;
    dataSPDoi.forEach((d) => {
      sumDH += d.soLuongHangDoi * d.donGia;
      count += d.soLuongHangDoi;
    });
    setYeuCauDoi({
      ...yeuCauDoi,
      doiHang: {
        soHangDoi: count,
        tongTienHangDoi: sumDH,
        phuongThucThanhToan: valuesAdd.doiHang.phuongThucThanhToan,
        tienKhachPhaiTra: totalAmount,
        nguoiTao: dataLogin.tenKhachHang
      }
    });
  };

  const getAllMSKC = async (id) => {
    let res = await getAllByIdSPTT(id);
    if (res) {
      setMauSacKC(res.data);
    }
  };

  const VNP = async (tien) => {
    try {
      const res = await payOnline(tien, 'http://localhost:3000/loading');
      if (res) {
        setUrlPay(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {values.map((d, i) => (
        <div key={i} className="card-box1 row" style={{ marginTop: '20px' }}>
          <div className="col-md-12 card-box-center">
            <div className="d-flex justify-content-end mb-5" style={{ height: '100%', alignItems: 'center' }}>
              {d.hoaDon.trangThai === 4 && (
                <>
                  <ButtonMUI
                    variant="outlined"
                    className="mt-2 me-3 tra-hang"
                    color="primary"
                    onClick={() => {
                      setIsshow(true);
                      setDataHDCT(d.hoaDonChiTiet);
                    }}
                  >
                    Đổi hàng
                  </ButtonMUI>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
      <ModalTraHang
        handleClose={handleClose}
        show={isShow}
        setValuesAdd={setValuesAdd}
        setTotalAmount={setTotalAmount}
        dataLogin={dataLogin}
        valuesAdd={valuesAdd}
        dataHDCT={dataHDCT}
        convertToCurrency={convertToCurrency}
        setDataHDCT={setDataHDCT}
        setIsUpdate={setIsUpdate}
        setGhiChu={setGhiChu}
        ghiChu={ghiChu}
        setYeuCauDoi={setYeuCauDoi}
        yeuCauDoi={yeuCauDoi}
        listLyDo={listLyDo}
        dataSPDoi={dataSPDoi}
        handleOpen={() => {
          setIsshow(false);
          setIsshowDH(true);
        }}
        setDataHDCTDH={setDataHDCTDH}
        setIsUpdateHD={setIsUpdateHD}
        handleDelete={handleDelete}
        setDataSPDoi={setDataSPDoi}
        totalAmount={totalAmount}
        setTotalAmountDH={setTotalAmountDH}
        totalAmountDH={totalAmountDH}
        setTotalAmountDHSP={setTotalAmountDHSP}
        totalAmountDHSP={totalAmountDHSP}
        handleDoiHang={handleDoiHang}
      ></ModalTraHang>
      <ModalAddHangDoi
        handleClose={() => {
          setIsshow(true);
          setIsshowDH(false);
        }}
        show={isShowDH}
        setTerm={setTerm}
        term={term}
        dataSP={dataSP}
        convertToCurrency={convertToCurrency}
        handleDetail={handleDetail}
      ></ModalAddHangDoi>
      <TableKCMS
        handleClose={() => {
          setIsshowMSKC(false);
          setIsshowDH(true);
        }}
        show={isShowMSKC}
        values={mauSacKC}
        handleDetail={handleDetailSL}
        setValuesAdd={setValuesAdd}
        valuesAdd={valuesAdd}
        handleAdd={handleAddSP}
      ></TableKCMS>
    </div>
  );
}

export default DoiHang;