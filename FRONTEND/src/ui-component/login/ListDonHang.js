/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import React from 'react';
import { useEffect } from 'react';
import { requestHuyDon, searchByTrangThai, searchCTSPofDH } from 'services/ServiceDonHang';
import '../../scss/CheckOut.scss';
import Button from 'react-bootstrap/Button';
import ButtonMUI from '@mui/material/Button';
import { useState } from 'react';
import { toast } from 'react-toastify';
import ModalHuyDon from './ModalHuyDon';
import { useNavigate } from 'react-router';
import ModalTraHang from './ModalTraHang';
import { addSPToDH, deleteSPDH, getAll, update, yeuCauDoiHang } from 'services/DoiHangService';
// import _ from 'lodash';
import ModalAddHangDoi from './ModalAddHangDoi';
import TableKCMS from 'views/ban-hang-tai-quay/TableKCMS';
import { getAllByIdSPTT } from 'services/SanPhamService';
import { payOnline } from 'services/PayService';

function ListDonHang(props) {
  const { tabs, data, dataLogin, values, setValues, size } = props;
  const [show, setShow] = useState(false);
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
  const [id, setId] = useState();
  const navigate = useNavigate();
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

  console.log(yeuCauDoi.doiHang.phuongThucThanhToan);

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

  const huyDon = async (id, value) => {
    const res = await requestHuyDon(id, value);
    if (res) {
      toast.success('Huỷ đơn thành công !');
      setShow(false);
      searchByTT(dataLogin.id, data.trangThai);
      setGhiChu();
      tabs.forEach((d) => {
        size(dataLogin.id, d.trangThai);
      });
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

  // const nhanDonHang = async (id, value) => {
  //   const res = await nhanHang(id, value);
  //   if (res) {
  //     toast.success('Nhận đơn hàng thành công !');
  //     setShow(false);
  //     searchByTT(dataLogin.id, data.trangThai);
  //     setGhiChu();
  //     tabs.forEach((d) => {
  //       size(dataLogin.id, d.trangThai);
  //     });
  //   }
  // };

  const handleClose = () => {
    setShow(false);
    setIsshow(false);
  };

  const handleDetail = (id) => {
    getAllMSKC(id);
    setIsshowMSKC(true);
    setIsshowDH(false);
  };

  const handleDetailSL = (id, donGia) => {
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
    if (valuesAdd.doiHang.phuongThucThanhToan === '') {
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

  const handleHuyDon = () => {
    if (!ghiChu.ghiChu) {
      toast.error('Vui lòng nhập lý do huỷ đơn');
      return;
    }
    huyDon(id, ghiChu);
  };

  function convertToCurrency(number) {
    // Chuyển đổi số thành định dạng tiền Việt Nam
    const formatter = new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    });
    return formatter.format(number);
  }

  const handleOpenModal = (id) => {
    setShow(true);
    setId(id);
  };

  return (
    <div>
      {values.map((d, i) => (
        <div key={i} className="card-box1 row" style={{ marginTop: '20px' }}>
          <div className="col-md-12 card-box-center">
            <div className=" d-flex justify-content-between" style={{ borderBottom: '1px solid gray', alignItems: 'center' }}>
              <Button variant="outline-info ms-3 mt-3 mb-3" onClick={() => navigate(`/history/${d.hoaDon.id}`)}>
                Chi tiết
              </Button>
              <p className="mt-3 me-3 mb-3" style={{ color: 'red' }}>
                {d.hoaDon.trangThai === 0
                  ? 'Chờ xác nhận'
                  : d.hoaDon.trangThai === 1
                  ? 'Chờ giao hàng'
                  : d.hoaDon.trangThai === 2
                  ? 'Huỷ đơn'
                  : d.hoaDon.trangThai === 3 || d.hoaDon.trangThai === 8 || d.hoaDon.trangThai === 9 || d.hoaDon.trangThai === 10
                  ? 'Đang giao hàng'
                  : d.hoaDon.trangThai === 5 || d.hoaDon.trangThai === 1 || d.hoaDon.trangThai === 12 || d.hoaDon.trangThai === 13
                  ? 'Đang giao hàng'
                  : d.hoaDon.trangThai === 4
                  ? 'Giao hàng thành công'
                  : d.hoaDon.trangThai === 14
                  ? 'Yêu cầu huỷ đơn'
                  : d.hoaDon.trangThai === 15
                  ? 'Yêu cầu đổi hàng'
                  : d.hoaDon.trangThai === 16
                  ? 'Đổi hàng thành công'
                  : d.hoaDon.trangThai === 17
                  ? 'Đổi hàng thất bại'
                  : d.hoaDon.trangThai === 6
                  ? 'Thanh toán thành công'
                  : 'Hoàn thành'}
              </p>
            </div>
          </div>
          <div className="col-md-12 card-box-center">
            {d.hoaDonChiTiet.map((h, i) => (
              <div key={i} className="card-box-center card-hdct mt-3 me-3">
                <div className="d-flex">
                  <div>
                    <img
                      src={`http://localhost:8080/api/chi-tiet-san-pham/${h.chiTietSanPham.id}`}
                      className="img-history rounded-start"
                      alt=""
                      width={100}
                      height={80}
                    />
                  </div>
                  <div className="mt-2 ms-3">
                    <h5>{h.chiTietSanPham.sanPham.ten}</h5>
                    <span>
                      {h.chiTietSanPham.kichCo.ten} -{' '}
                      <span
                        className="color-circle"
                        style={{
                          backgroundColor: h.chiTietSanPham.mauSac.ten,
                          display: 'inline-block',
                          verticalAlign: 'middle'
                        }}
                      ></span>
                    </span>
                    <p>x{h.soLuong}</p>
                  </div>
                </div>
                <div>
                  <span style={{ color: 'red' }}>{convertToCurrency(h.donGia)}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="col-md-12 card-box-center">
            <div className="d-flex justify-content-end mt-5" style={{ borderTop: '1px solid gray', height: '100%', alignItems: 'center' }}>
              <h5 className="me-3">
                Tổng tiền: <strong style={{ color: 'red' }}>{convertToCurrency(d.hoaDon.tongTienKhiGiam)}</strong>
              </h5>
            </div>
          </div>
          <div className="col-md-12 card-box-center">
            <div className="d-flex justify-content-end mb-5" style={{ height: '100%', alignItems: 'center' }}>
              {d.hoaDon.trangThai === 4 && (
                <>
                  {/* <ButtonMUI
                    variant="outlined"
                    className="mt-2 me-3 tra-hang"
                    color="primary"
                    onClick={() => {
                      setIsshow(true);
                      setDataHDCT(d.hoaDonChiTiet);
                    }}
                  >
                    Đổi hàng
                  </ButtonMUI> */}
                  {/* <ButtonMUI className="mt-2 me-3" variant="contained" color="primary" onClick={() => handleNhanDonHang(d.hoaDon.id)}>
                    Nhận hàng
                  </ButtonMUI> */}
                </>
              )}
              {d.hoaDon.trangThai === 1 || d.hoaDon.trangThai === 6 || d.hoaDon.trangThai === 0 ? (
                <ButtonMUI className="mt-2 me-3" variant="contained" color="error" onClick={() => handleOpenModal(d.hoaDon.id)}>
                  Huỷ đơn
                </ButtonMUI>
              ) : (
                ''
              )}
            </div>
          </div>
        </div>
      ))}
      <ModalHuyDon handleClose={handleClose} show={show} handleHuyDon={handleHuyDon} setGhiChu={setGhiChu}></ModalHuyDon>
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

export default ListDonHang;