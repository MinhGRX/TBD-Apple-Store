/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import '../../scss/DonHang.scss';
import { Button, Table } from 'react-bootstrap';
import { useState } from 'react';
import _ from 'lodash';
import { useEffect } from 'react';
import { searchCTSP, getAllByIdSPTT, detailCTSP } from 'services/SanPhamService';
import SearchResult from './SearchResultList';
import {
  getById,
  updateSL,
  deleteHDCT,
  updateHD,
  addKM,
  getKmById,
  detailHD,
  thanhToan,
  searchCTSPofDH,
  addSP,
  getAllKH,
  getAllSP,
  searchKHofDH,
  addKH2
} from 'services/ServiceDonHang';
import InputSpinner from 'react-bootstrap-input-spinner';
import TableKM from './TableKM';
import { detailKM, getAllKM } from 'services/ServiceKhuyenMai';
import { toast } from 'react-toastify';
import Modal from 'react-bootstrap/Modal';
import { PDFDownloadLink, Document, Page, Text, StyleSheet, Font, View } from '@react-pdf/renderer';
import myFont from '../../fonts/Roboto Việt Hóa/Roboto-Regular.ttf';
import { pay } from 'services/PayService';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import QrReader from 'react-qr-reader';
import { Avatar, TextField } from '@mui/material';
import ModalUpdateKH from './ModalUpdateKH';
import { detailKH } from 'services/KhachHangService';
function DonHang(props) {
  // eslint-disable-next-line react/prop-types
  const { id, getAllHD, handleAddHoaDonTabs, valuesHoaDonTabs } = props;
  const [inputValue, setInputValue] = useState('');
  const [show, setShow] = useState(false);
  const [check, setCheck] = useState(true);
  const [idHDCT, setIdHDCT] = useState('');
  const [idKM, setIdKM] = useState('');
  const [idKH, setIdKH] = useState('');
  const [isShowUPKH, setIsShowUPKH] = useState(false);
  const [httt, setHttt] = useState('Tiền mặt');
  const [urlPay, setUrlPay] = useState('');
  const [values, setValues] = useState([]);
  const [dataKM, setDataKM] = useState([]);
  const [valuesSanPham, setValuesSanPham] = useState([]);
  const [dataHDKM, setDataHDKM] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [tienThua, setTienThua] = useState(0);
  const [tienGiam, setTienGiam] = useState(0);
  const [tienKhachDua, setTienKhachDua] = useState(0);
  const [tongSoLuong, setTongSoLuong] = useState(0);
  const [activeIndex, setActiveIndex] = useState(null);
  const [dataDetailHD, setDataDetailHD] = useState({});
  const [dataDetailKM, setDataDetailKM] = useState({});
  const dataLoginAD = JSON.parse(localStorage.getItem('dataLoginAD'));
  const dataLoginNV = JSON.parse(localStorage.getItem('dataLoginNV'));
  Font.register({ family: 'Roboto', src: myFont });
  const [valuesAddKM, setValuesAddKM] = useState({
    khuyenMai: {
      id: ''
    },
    hoaDon: {
      id: id
    },
    tienGiam: 0
  });

  console.log(dataDetailKM);

  const [valuesUpdateHD, setValuesUpdateHD] = useState({
    tenNguoiNhan: 'Khách lẻ',
    soDienThoai: '',
    tongTien: 0,
    tongTienKhiGiam: 0.0,
    hinhThucThanhToan: {
      id: dataDetailHD.hinhThucThanhToan && dataDetailHD.hinhThucThanhToan.id,
      trangThai: 1,
      tien: 0
    },
    trangThai: 0
  });

  const [valuesUpdate, setValuesUpdate] = useState({
    chiTietSanPham: {
      id: ''
    },
    hoaDon: {
      id: id
    },
    soLuong: ''
  });

  const styles = StyleSheet.create({
    container: {
      marginLeft: '40px'
    },
    title: {
      paddingTop: '50px',
      paddingBottom: '20px',
      fontSize: '20px',
      textAlign: 'center',
      fontFamily: 'Roboto',
      fontWeight: 'bold'
    },
    titleHD: {
      paddingTop: '20px',
      fontSize: '20px',
      fontFamily: 'Roboto',
      textAlign: 'center',
      fontWeight: 'bold'
    },
    titleTB: {
      fontSize: '15px',
      textAlign: 'center',
      fontFamily: 'Roboto',
      fontWeight: 'bold',
      paddingBottom: '10px'
    },
    text: {
      fontSize: '13px',
      fontFamily: 'Roboto',
      textAlign: 'center'
    },
    textMaHD: {
      fontSize: '13px',
      fontFamily: 'Roboto',
      textAlign: 'center',
      paddingBottom: '20px'
    },
    textThuocTinh: {
      fontSize: '10px',
      fontFamily: 'Roboto',
      marginBottom: '3px',
      marginTop: '3px'
    },
    table: {
      width: '100%',
      marginLeft: '40px',
      marginRight: '40px'
    },
    row: {
      display: 'flex',
      flexDirection: 'row',
      borderTop: '1px solid #EEE',
      marginRight: '40px'
    },
    header: {
      borderTop: 'none'
    },
    bold: {
      fontWeight: 'bold'
    },
    // So Declarative and unDRY 👌
    row1: {
      width: '10%',
      paddingTop: '10px',
      paddingBottom: '10px',
      fontSize: '10px',
      borderLeft: '1px solid black',
      borderTop: '1px solid black',
      borderBottom: '1px solid black',
      paddingLeft: '5px',
      fontFamily: 'Roboto'
    },
    row2: {
      width: '25%',
      fontSize: '10px',
      paddingTop: '10px',
      paddingBottom: '10px',
      borderLeft: '1px solid black',
      borderTop: '1px solid black',
      borderBottom: '1px solid black',
      paddingLeft: '5px',
      fontFamily: 'Roboto'
    },
    row3: {
      width: '20%',
      fontSize: '10px',
      paddingTop: '10px',
      paddingBottom: '10px',
      borderLeft: '1px solid black',
      borderTop: '1px solid black',
      borderBottom: '1px solid black',
      paddingLeft: '5px',
      fontFamily: 'Roboto'
    },
    row4: {
      width: '20%',
      fontSize: '10px',
      paddingTop: '10px',
      paddingBottom: '10px',
      borderLeft: '1px solid black',
      borderTop: '1px solid black',
      borderBottom: '1px solid black',
      paddingLeft: '5px',
      fontFamily: 'Roboto'
    },
    row5: {
      width: '20%',
      fontSize: '10px',
      paddingTop: '10px',
      paddingBottom: '10px',
      border: '1px solid black',
      paddingLeft: '5px',
      fontFamily: 'Roboto'
    },
    colorBlock: {
      width: 30,
      height: 30,
      borderRadius: 10
    },
    flexContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%'
    },
    textLeft: {
      fontFamily: 'Roboto',
      fontSize: '13px',
      marginLeft: '40px'
    },
    textRight: {
      fontFamily: 'Roboto',
      fontSize: '15px',
      marginRight: '30px'
    },
    button: {
      color: 'white',
      textDecoration: 'none'
    }
  });

  console.log(tienThua);

  const InvoiceDocument = () => {
    return (
      <Document>
        <Page>
          <Text style={styles.title}>Sports Shop</Text>
          <Text style={styles.text}>SDT: 0559044158</Text>
          <Text style={styles.text}>Email: sportsshop@gmail.com</Text>
          <Text style={styles.text}>Địa chỉ: Đại Đồng - Tiên Du - Bắc Ninh</Text>
          <Text style={styles.text}>Ngân hàng: Techcombank - STK: 69696969696969</Text>
          <Text style={styles.text}>Chủ tải khoản: Trần Quang Dũng</Text>
          <Text style={styles.titleHD}>HOÁ ĐƠN BÁN HÀNG</Text>
          <Text style={styles.textMaHD}>{dataDetailHD.ma}</Text>

          <div style={styles.container}>
            <Text style={styles.textThuocTinh}>Ngày mua: {formatDate(dataDetailHD.ngayThanhToan)}</Text>
            <Text style={styles.textThuocTinh}>Khách hàng: {dataDetailHD.tenNguoiNhan}</Text>
            {dataDetailHD && dataDetailHD.diaChi && <Text style={styles.textThuocTinh}>Địa chỉ: {dataDetailHD.diaChi}</Text>}
            {dataDetailHD && dataDetailHD.soDienThoai && (
              <Text style={styles.textThuocTinh}>Số điện thoại: {dataDetailHD.soDienThoai}</Text>
            )}
            <Text style={styles.textThuocTinh}>
              Nhân viên bán hàng: {(dataLoginNV && dataLoginNV.ten) || (dataLoginAD && dataLoginAD.ten)}
            </Text>
          </div>
          <Text style={styles.titleTB}>DANH SÁCH SẢN PHẨM KHÁCH HÀNG MUA</Text>
          <View style={styles.table}>
            <View style={[styles.row, styles.header]}>
              <Text style={styles.row1}>STT</Text>
              <Text style={styles.row2}>Sản phẩm</Text>
              <Text style={styles.row3}>Số lượng</Text>
              <Text style={styles.row4}>Đơn giá</Text>
              <Text style={styles.row5}>Thành tiền</Text>
            </View>
            {valuesSanPham.map((d, i) => (
              <View key={i} style={[styles.row, styles.header]}>
                <Text style={styles.row1}>{i + 1}</Text>
                <Text style={styles.row2}>
                  {d.chiTietSanPham.sanPham.ten} [{d.chiTietSanPham.kichCo.ten} - {d.chiTietSanPham.mauSac.ma}]
                </Text>
                <Text style={styles.row3}>{d.soLuong}</Text>
                <Text style={styles.row4}>{convertToCurrency(d.donGia)}</Text>
                <Text style={styles.row5}>{convertToCurrency(d.soLuong * d.donGia)}</Text>
              </View>
            ))}
          </View>
          <View>
            <View style={[styles.flexContainer, { paddingTop: '10px' }]}>
              <Text style={styles.textLeft}>Tổng tiền</Text>
              <Text style={styles.textRight}>{convertToCurrency(totalAmount)}</Text>
            </View>
            {dataHDKM.map((d) => (
              <View key={d.id} style={[styles.flexContainer, { color: 'red' }]}>
                <Text style={styles.textLeft}>Tiền giảm</Text>
                <Text style={styles.textRight}>-{convertToCurrency(d.tienGiam)}</Text>
              </View>
            ))}
            <View style={styles.flexContainer}>
              <Text style={styles.textLeft}>Tiền khách thanh toán</Text>
              <Text style={styles.textRight}>{convertToCurrency(dataDetailHD.tongTienKhiGiam)}</Text>
            </View>
          </View>
          <View>
            <Text style={[styles.text, { paddingTop: '50px' }]}>-------------Cảm ơn quý khách!-------------</Text>
          </View>
        </Page>
      </Document>
    );
  };

  useEffect(() => {
    // Tính tổng tiền khi valuesSanPham thay đổi
    let sum = 0;
    let count = 0;
    valuesSanPham.forEach((d) => {
      sum += d.soLuong * d.donGia;
      count += d.soLuong;
    });
    // Cập nhật giá trị tổng tiền
    setTotalAmount(sum);
    setTongSoLuong(count);
  }, [valuesSanPham]);

  useEffect(() => {
    setValuesUpdateHD((prevValuesUpdateHD) => ({
      ...prevValuesUpdateHD,
      tenNguoiNhan: valuesKH.tenKhachHang,
      soDienThoai: valuesKH.sdt,
      tongTien: totalAmount
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalAmount]);

  useEffect(() => {
    setTienThua(valuesUpdateHD.hinhThucThanhToan.tien - valuesUpdateHD.tongTienKhiGiam);
    const totalGiam = dataHDKM.reduce((total, d) => total + d.tienGiam, 0);
    setValuesUpdateHD((prevValuesUpdateHD) => ({
      ...prevValuesUpdateHD,
      ...prevValuesUpdateHD.hinhThucThanhToan,
      tenNguoiNhan: valuesKH.tenKhachHang,
      soDienThoai: valuesKH.sdt,
      tongTienKhiGiam: totalAmount - totalGiam
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalAmount, dataKM]);

  useEffect(() => {
    handleSearchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue]);

  useEffect(() => {
    findAllKM(id);
    getAllById(id);
    detailHDById(id);
    if (dataDetailHD.tongTienKhiGiam || id) {
      VNP(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (idHDCT) {
      update(idHDCT, valuesUpdate);
    }
  }, [valuesUpdate]);

  useEffect(() => {
    handleUpdateHD();
  }, [valuesUpdateHD]);

  useEffect(() => {
    getKM(totalAmount);
  }, [totalAmount]);

  useEffect(() => {
    if (idKM) {
      detailMaKM(idKM);
    }
  }, [idKM]);

  useEffect(() => {
    setTienThua(valuesUpdateHD.hinhThucThanhToan.tien - valuesUpdateHD.tongTienKhiGiam);
  }, [valuesUpdateHD.hinhThucThanhToan.tien]);

  useEffect(() => {
    if (dataDetailHD.tongTienKhiGiam === 0) {
      toast.error('Lỗi tiền khi giảm!');
    } else if (valuesAddKM.khuyenMai.id) {
      postKM(valuesAddKM);
    }
  }, [valuesAddKM]);

  const detailMaKM = async (id) => {
    const res = await detailKM(id);
    if (res) {
      setDataDetailKM(res.data);
    }
  };

  const VNP = async (id) => {
    try {
      const res = await pay(id);
      if (res) {
        setUrlPay(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const findAllKM = async (id) => {
    const res = await getKmById(id);
    if (res) {
      setDataHDKM(res.data);
    }
  };

  const detailHDById = async (id) => {
    const res = await detailHD(id);
    if (res) {
      setDataDetailHD(res.data);
    }
  };

  const handleAddValueKm = (idKM, tienGiam, loaiGiam) => {
    // const totalGiam = dataHDKM.reduce((total, d) => total + d.tienGiam, 0);
    setIdKM(idKM);
    VNP(id);
    if (loaiGiam) {
      setValuesAddKM({
        ...valuesAddKM,
        khuyenMai: {
          id: idKM
        },
        tienGiam: tienGiam
      });
      setTienThua(valuesUpdateHD.hinhThucThanhToan.tien);
      setTienGiam(tienGiam);
    } else {
      setValuesAddKM({
        ...valuesAddKM,
        khuyenMai: {
          id: idKM
        },
        tienGiam: (tienGiam * totalAmount) / 100
      });
      setTienThua(valuesUpdateHD.hinhThucThanhToan.tien);
      setTienGiam((tienGiam * totalAmount) / 100);
    }
  };

  const postKM = async (value) => {
    const res = await addKM(value);
    if (res.data === 'Mày thích spam không ?') {
      toast.warning('Bạn đang sử dụng mã giảm giá này');
      return;
    } else {
      detailHDById(id);
      findAllKM(id);
      setTienThua(valuesUpdateHD.hinhThucThanhToan.tien - valuesUpdateHD.tongTienKhiGiam);
      const totalGiam = dataHDKM.reduce((total, d) => total + d.tienGiam, 0);
      setValuesUpdateHD((prevValuesUpdateHD) => ({
        ...prevValuesUpdateHD,
        ...prevValuesUpdateHD.hinhThucThanhToan,
        tenNguoiNhan: valuesKH.tenKhachHang,
        soDienThoai: valuesKH.sdt,
        tongTienKhiGiam: totalAmount - totalGiam
      }));
      setValuesUpdateHD((prevValuesUpdateHD) => ({
        ...prevValuesUpdateHD,
        tenNguoiNhan: valuesKH.tenKhachHang,
        soDienThoai: valuesKH.sdt,
        tongTienKhiGiam: prevValuesUpdateHD.tongTienKhiGiam - tienGiam >= 0 ? prevValuesUpdateHD.tongTienKhiGiam - tienGiam : 0
      }));
      toast.success('Thêm mã giảm giá thành công');
    }
  };

  const handleUpdateHD = () => {
    updateTTHD(id, valuesUpdateHD);
  };

  const updateTTHD = async (idHD, value) => {
    try {
      const res = await updateHD(idHD, value);
      if (res) {
        detailHDById(id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const ThanhToanHD = async (idHD, nguoiTao) => {
    const res = await thanhToan(idHD, nguoiTao);
    if (res) {
      if (valuesHoaDonTabs <= 1) {
        handleAddHoaDonTabs();
      }
      toast.success('Thanh toán thành công');
      getAllHD();
    }
  };

  const getAllById = async (idHD) => {
    const res = await getById(idHD);
    if (res) {
      setValuesSanPham(res.data);
    }
  };

  const getKM = async (tien) => {
    const res = await getAllKM(tien);
    if (res) {
      setDataKM(res.data);
    }
  };

  const handleUpdateSl = (id, idHD, idCTSP, soLuong) => {
    setIdHDCT(id);
    setValuesUpdate({
      ...valuesUpdate,
      chiTietSanPham: {
        id: idCTSP
      },
      hoaDon: {
        id: idHD
      },
      soLuong: soLuong
    });
  };

  const update = async (idHDCT, values) => {
    const res = await updateSL(idHDCT, values);
    if (res) {
      getAllById(id);
      handleCloseSPofDH();
      getAll();
    }
  };

  const deleteHD = async (idHDCT) => {
    const res = await deleteHDCT(idHDCT);
    if (res) {
      getAllById(id);
    }
  };

  const handleSearchUsers = _.debounce(async () => {
    if (inputValue !== '') {
      // Kiểm tra nếu inputValue không rỗng
      const res = await searchCTSP(inputValue, '1', '', '', '');
      if (res && res.data) {
        setValues(res.data.content);
      }
    } else {
      setValues([]); // Nếu inputValue rỗng, đặt giá trị values là một mảng rỗng để không hiển thị dữ liệu
    }
  }, 100);

  const convertToCurrency = (value) => {
    const formatter = new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    });
    return formatter.format(value);
  };

  const handleDelete = (id) => {
    deleteHD(id);
  };

  const handleAddKM = () => {
    setShow(false);
    setActiveIndex(null);
  };

  const handleDivClick = (index) => {
    setActiveIndex(index);
  };

  function formatDate(dateString) {
    if (dateString === null) {
      return ''; // Trả về chuỗi rỗng nếu giá trị là null
    }

    const dateObject = new Date(dateString);

    const day = dateObject.getDate();
    const month = dateObject.getMonth() + 1;
    const year = dateObject.getFullYear();


    const formattedDate = `${day}/${month}/${year}`;

    return formattedDate;
  }

  const handleThanhToan = () => {
    ThanhToanHD(id, (dataLoginNV && dataLoginNV.ten) || (dataLoginAD && dataLoginAD.ten));
    setValuesUpdateHD({
      ...valuesUpdateHD,
      ...valuesUpdateHD.hinhThucThanhToan,
      trangThai: 6,
      hinhThucThanhToan: {
        ten: httt,
        tien: tienKhachDua,
        trangThai: 1
      }
    });
  };

  const handleThanhToanWithVNP = () => {
    window.location.href = urlPay;
    ThanhToanHD(id, (dataLoginNV && dataLoginNV.ten) || (dataLoginAD && dataLoginAD.ten));
    setValuesUpdateHD({
      ...valuesUpdateHD,
      ...valuesUpdateHD.hinhThucThanhToan,
      trangThai: 6,
      hinhThucThanhToan: {
        ten: httt,
        tien: tienKhachDua,
        trangThai: 1
      }
    });
  };

  const handleChangeValueTien = (e) => {
    VNP(id);
    setTienKhachDua(e);
    setValuesUpdateHD({
      ...valuesUpdateHD.hinhThucThanhToan,
      ...valuesUpdateHD,
      hinhThucThanhToan: {
        tien: e,
        trangThai: 0
      }
    });
  };

  // fix san pham
  const [show3, setShow3] = useState(false);
  const handleClose3 = () => {
    setShow3(false);
  };
  const handleShow3 = () => setShow3(true);

  const [show4, setShow4] = useState(false);
  const handleClose4 = () => {
    setShow4(false);
  };
  const handleShow4 = () => setShow4(true);

  const [show1, setShow1] = useState(false);
  const handleClose1 = () => {
    setShow1(false);
  };

  // const [isCase1, setIsCase1] = useState(true);

  const handleShow1 = () => {
    // setIsCase1(true);
    setShow1(true);
  };
  const [show2, setShow2] = useState(false);
  const handleClose2 = () => {
    setShow2(false);
  };
  //sp
  // const [inputDetail, setInputDetail] = useState(null);
  const [dataSP, setDataSP] = useState([]);
  const [mauSacKC, setMauSacKC] = useState([]);
  const [dataDetail, setDataDetail] = useState({});
  const [idSP, setidSP] = useState('');
  const [idCTSP, setidCTSP] = useState('');

  // kcms sp
  const handleAddSoLuong = (id, idSP) => {
    setShow2(true);
    setidSP(idSP);
    setidCTSP(id);
    setValuesAdd({ ...valuesAdd, chiTietSanPham: { id: id } });
    if (idCTSP) {
      detail2(idCTSP);
    }
  };

  const handleAdd = () => {
    // getAllById(id);
    if (parseInt(valuesAdd.soLuong) > parseInt(dataDetail.soLuong)) {
      toast.error('Đã vượt quá số lượng hiện có !');
      return;
    }
    add(valuesAdd);
  };

  const add = async (value) => {
    const res = await addSP(value);
    if (res.data === 'ok') {
      window.location.reload();
      toast.success('Thêm sản phẩm thành công');
      setCheckAdd(false)
    } else if (res) {
      toast.success('Thêm sản phẩm thành công');
      getAllById(id);
      handleCloseSPofDH();
      setCheckAdd(false)
      getAll();
      if (idCTSP) {
        detail2(idCTSP);
      }
    }
  };

  const handleCloseSPofDH = () => {
    setShow1(false);
    // chuachac dong
    setShow2(false);
    //
    // setInputDetail(null);
    getAllById(id);
    setValuesAdd({
      chiTietSanPham: {
        id: ''
      },
      hoaDon: {
        id: id
      },
      soLuong: ''
    });
  };

  const handleDetail = (id) => {
    // setInputDetail(id);
    setidCTSP(id);
    setValuesAdd({ ...valuesAdd, chiTietSanPham: { id: id } });
  };

  useEffect(() => {
    if (idSP) {
      getAllMSKC(idSP);
    }
  }, [idSP]);

  useEffect(() => {
    if (idCTSP) {
      detail2(idCTSP);
    }
  }, [idCTSP]);

  const detail2 = async (idCTSP) => {
    const res = await detailCTSP(idCTSP);
    if (res) {
      setDataDetail(res.data);
    }
  };

  const getAllMSKC = async (id) => {
    let res = await getAllByIdSPTT(id);
    if (res) {
      setMauSacKC(res.data);
    }
  };

  const [valuesAdd, setValuesAdd] = useState({
    chiTietSanPham: {
      id: ''
    },
    hoaDon: {
      id: id
    },
    soLuong: 1
  });

  useEffect(() => {
    getAll(0);
  }, []);

  const getAll = async () => {
    const res = await getAllSP();
    if (res && res.data) {
      setDataSP(res.data);
    }
  };

  // searchSPinDH;
  const [term, setTerm] = useState('');

  const searchSPofDH = async (term) => {
    const res = await searchCTSPofDH(term);
    if (res) {
      setDataSP(res.data);
    }
  };

  const handleSearchSPofDH = _.debounce(async () => {
    if (term) {
      searchSPofDH(term);
    } else {
      searchSPofDH('');
    }
  }, []);

  useEffect(() => {
    handleSearchSPofDH();
  }, [term]);

  const handleInputChange = (e) => {
    setTerm(e.target.value);
  };

  // khach hang
  const [kh, setKH] = useState([]);

  useEffect(() => {
    hienThiKH();
  }, []);

  const hienThiKH = async () => {
    const res = await getAllKH();
    if (res && res.data) {
      setKH(res.data);
    }
  };

  // searchKHofDH;
  const [termKH, setTermKH] = useState('');

  const searchKH = async (termKH) => {
    const res = await searchKHofDH(termKH);
    if (res) {
      setKH(res.data);
    }
  };

  const handleSearchKHofDH = _.debounce(async () => {
    if (termKH) {
      searchKH(termKH);
    } else {
      searchKH('');
    }
  }, []);

  useEffect(() => {
    handleSearchKHofDH();
  }, [termKH]);

  const handleInputChangeKH = (e) => {
    setTermKH(e.target.value);
  };

  const [valuesKH, setValuesKH] = useState({
    tenKhachHang: '',
    sdt: '',
    email: '',
    ngaySinh: '',
    gioiTinh: ''
  });

  const handleAddKH = (event) => {
    event.preventDefault();

    if (!valuesKH.tenKhachHang || !valuesKH.sdt) {
      toast.error('Vui lòng nhập tên và số điện thoại khách hàng !');
      return;
    }

    postKH(id, valuesKH);
  };

  const postKH = async (id, value) => {
    const res = await addKH2(id, value);
    if (res) {
      toast.success('Thêm thành công !');
      setShow3(false);
      hienThiKH();
      detailHDById(id);
    }
  };

  const handleChooseKH = (idKH, tenKhachHang, soDienThoai) => {
    setValuesKH({
      ...valuesKH,
      tenKhachHang: tenKhachHang,
      sdt: soDienThoai
    });
    setValuesUpdateHD({
      ...valuesUpdateHD,
      khachHang: {
        id: idKH
      },
      tenNguoiNhan: tenKhachHang,
      soDienThoai: soDienThoai
    });
    console.log(tenKhachHang, soDienThoai);
    handleUpdateHD();
    toast.success('Chọn thành công !');
    setShow4(false);
  };

  useEffect(() => {
    if (idKH) {
      detail(idKH);
    }
  }, [idKH]);

  const detail = async (id) => {
    const res = await detailKH(id);
    if (res) {
      const { ngaySinh, ...valuesKH } = res.data;
      setValuesKH({
        ...valuesKH,
        ngaySinh: formatDate(ngaySinh)
      });
    }
  };

  console.log(valuesKH);

  //showScanQR
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [checkAdd, setCheckAdd] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleScan = (data) => {
    if (data) {
      setCheckAdd(true);
      setValuesAdd({ ...valuesAdd, chiTietSanPham: { id: data }, soLuong: 1 });
    }
  };

  useEffect(() => {
    if (valuesAdd.chiTietSanPham.id && valuesAdd.soLuong && checkAdd) {
      add(valuesAdd);
    }
  }, [valuesAdd]);

  const handleError = (error) => {
    if (error) {
      console.error(error);
    }
  };

  console.log(detailHD.tongTienKhiGiam);

  return (
    <div>
      <div className="row">
        <div className="col-8">
          <div style={{ display: 'flex', justifyContent: 'flex-start' }} className="export-form">
            <div style={{ paddingRight: 25 }}>
              <button onClick={handleShow1} className="relative inline-block text-base group">
                <span className="relative z-10 block px-8 py-3 overflow-hidden font-medium leading-tight text-gray-800 transition-colors duration-300 ease-out border-2 border-gray-900 rounded-lg group-hover:text-white">
                  <span className="absolute inset-0 w-full h-full px-8 py-3 rounded-lg bg-gray-50"></span>
                  <span className="absolute left-0 w-48 h-48 -ml-5 transition-all duration-300 origin-top-right -rotate-90 -translate-x-full translate-y-12 bg-gray-900 group-hover:-rotate-180 ease"></span>
                  <span className="relative">Thêm sản phẩm</span>
                </span>
                <span
                  className="absolute bottom-0 right-0 w-full h-10 -mb-1 -mr-1 transition-all duration-200 ease-linear bg-gray-900 rounded-lg group-hover:mb-0 group-hover:mr-0"
                  data-rounded="rounded-lg"
                ></span>
              </button>
            </div>
            <div>
              <button onClick={openModal} className="relative inline-block text-base group">
                <span className="relative z-10 block px-9 py-2 overflow-hidden font-medium leading-tight text-gray-800 transition-colors duration-300 ease-out border-2 border-gray-900 rounded-lg group-hover:text-white">
                  <span className="absolute inset-0 w-full h-full px-9 py-2 rounded-lg bg-gray-50"></span>
                  <span className="absolute left-0 w-48 h-48 -ml-5 transition-all duration-300 origin-top-right -rotate-90 -translate-x-full translate-y-12 bg-gray-900 group-hover:-rotate-180 ease"></span>
                  <span className="relative">
                    <QrCodeScannerIcon fontSize="small" />
                    Quét QR
                  </span>
                </span>
                <span
                  className="absolute bottom-0 right-0 w-full h-10 -mb-1 -mr-1 transition-all duration-200 ease-linear bg-gray-900 rounded-lg group-hover:mb-0 group-hover:mr-0"
                  data-rounded="rounded-lg"
                ></span>
              </button>
            </div>
            <Modal style={{ paddingTop: 100 }} centered show={isModalOpen} onHide={closeModal}>
              <Modal.Body>
                <QrReader delay={1500} onError={handleError} onScan={handleScan} style={{ width: '100%' }} />
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={closeModal}>
                  Đóng
                </Button>
              </Modal.Footer>
            </Modal>

            <Modal
              size="lg"
              aria-labelledby="contained-modal-title-vcenter"
              centered
              style={{ marginLeft: 150 }}
              show={show1}
              onHide={handleClose1}
            >
              <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter" style={{ marginLeft: 300 }}>
                  Thêm Sản Phẩm
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="box col-auto col-6">
                  <div className="search">
                    <input
                      style={{ borderRadius: 15, width: 900, height: 35 }}
                      type="text"
                      className="input-search results-list"
                      placeholder="Nhập mã hoặc tên sản phẩm cần tìm..."
                      value={term}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <section className="navbar-expand-lg navbar-light bg-light">
                  <div>
                    <div className="results-list">
                      <Table hover>
                        <tbody>
                          {dataSP.length > 0 ? (
                            dataSP.map((d, i) => (
                              <tr key={i} onClick={() => handleAddSoLuong(d.id, d.sanPham.id)} style={{ cursor: 'pointer' }}>
                                <td>
                                  <Avatar
                                    alt={d.sanPham.ten}
                                    src={`http://localhost:8080/api/chi-tiet-san-pham/${d.id}`}
                                    sx={{ width: 80, height: 110 }}
                                    variant="rounded"
                                  />
                                </td>
                                <td>{d.sanPham.ma}</td>
                                <td>{d.sanPham.ten}</td>
                                <td>{d.soLuong || 0}</td>
                                <td>{convertToCurrency(d.giaBan)}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={5}>Không có dữ liệu</td>
                            </tr>
                          )}
                        </tbody>
                      </Table>

                      <Modal
                        show={show2}
                        onHide={handleClose2}
                        style={{ marginLeft: 150 }}
                        backdrop="static"
                        keyboard={false}
                        size="lg"
                        aria-labelledby="contained-modal-title-vcenter"
                        centered
                      >
                        <Modal.Header closeButton>
                          <Modal.Title>Chọn loại của sản phẩm</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <div className="body-add-new">
                            <div className="mb-3">
                              <label htmlFor="exampleFormControlInput1" className="form-label">
                                Thuộc tính
                              </label>
                              {mauSacKC.map((d, i) => (
                                <div className="form-check" key={i}>
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    name="flexRadioDefault"
                                    id={d.id}
                                    value={d.id}
                                    checked={d.id === dataDetail.id}
                                    onChange={() => handleDetail(d.id)}
                                  />
                                  <label className="form-check-label custom-label" htmlFor={d.id}>
                                    <div
                                      style={{ backgroundColor: d.mauSac.ten, width: 50, borderRadius: '10px', border: '2px solid black' }}
                                    >
                                      &nbsp;
                                    </div>
                                    &nbsp;- {d.kichCo.ten} - {d.chatLieu.ten} - {d.loaiSanPham.ten} - {d.coAo.ten} - {d.nhaSanXuat.ten}
                                  </label>
                                </div>
                              ))}
                            </div>
                            <div className="mb-3">
                              <label htmlFor="exampleFormControlTextarea1" className="form-label">
                                Số lượng:{' '}
                                <small>
                                  Còn lại <strong>{dataDetail.soLuong}</strong>
                                </small>
                              </label>
                              <br />
                              <TextField
                                id="exampleFormControlTextarea1"
                                type="number"
                                fullWidth
                                value={valuesAdd.soLuong}
                                onChange={(e) => {
                                  if (e.target.value >= 1) {
                                    setValuesAdd({ ...valuesAdd, soLuong: e.target.value });
                                  } else {
                                    e.preventDefault();
                                  }
                                }}
                                min={1}
                                inputProps={{ min: 1 }}
                              ></TextField>
                            </div>
                          </div>
                        </Modal.Body>
                        <Modal.Footer>
                          <Button variant="primary" onClick={() => handleAdd()}>
                            Thêm
                          </Button>
                        </Modal.Footer>
                      </Modal>
                    </div>
                  </div>
                </section>
              </Modal.Body>
            </Modal>
          </div>

          {values.length > 0 && (
            <div className="search-result">
              <SearchResult
                result={values}
                id={id}
                getAllById={getAllById}
                handleSearchUsers={handleSearchUsers}
                setInputValue={setInputValue}
                setValuesSearch={setValues}
              />
            </div>
          )}
          <div className="table-container">
            <Table striped hover className="my-4">
              <tr className="ps-3">
                <th>#</th>
                <th>Mã</th>
                <th>Ảnh</th>
                <th>Sản phẩm</th>
                <th>Số lượng</th>
                <th>Đơn giá</th>
                <th>Tổng tiền</th>
              </tr>
              <tbody>
                {valuesSanPham.map((d, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{d.chiTietSanPham.sanPham.ma}</td>
                    <td>
                      <Avatar
                        alt={d.chiTietSanPham.sanPham.ten}
                        src={`http://localhost:8080/api/chi-tiet-san-pham/${d.chiTietSanPham.id}`}
                        sx={{ width: 80, height: 110 }}
                        variant="rounded"
                      />
                    </td>
                    <td>
                      {d.chiTietSanPham.sanPham.ten} <br />
                      {d.chiTietSanPham.kichCo.ten} -{' '}
                      <span
                        className="color-circle"
                        style={{
                          backgroundColor: d.chiTietSanPham.mauSac.ten,
                          display: 'inline-block',
                          verticalAlign: 'middle',
                          height: '15px',
                          width: '15px'
                        }}
                      ></span>
                    </td>
                    <td>
                      <div
                        className="input-spinner"
                        style={{ display: 'flex', alignItems: 'center', width: 120, justifyContent: 'center' }}
                      >
                        <InputSpinner
                          key={d.id} // Đặt key duy nhất cho mỗi InputSpinner
                          type={'real'}
                          max={d.chiTietSanPham.soLuong + d.soLuong}
                          min={1}
                          step={1}
                          value={d.soLuong}
                          onChange={(e) => handleUpdateSl(d.id, d.hoaDon.id, d.chiTietSanPham.id, e)}
                          variant={'dark'}
                          size="sm"
                        />
                      </div>
                      {d.chiTietSanPham.soLuong < 10 ? (
                        <span style={{ color: 'red' }}>
                          Số sản phẩm còn lại: <strong>{d.chiTietSanPham.soLuong}</strong>
                        </span>
                      ) : (
                        ''
                      )}
                    </td>
                    <td>{convertToCurrency(d.donGia)}</td>
                    <td>{convertToCurrency(d.soLuong * d.donGia)}</td>
                    <td>
                      <button onClick={() => handleDelete(d.id)} className="fa-solid fa-trash mx-3"></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
        <div className="col-4 thong-tin-ban-hang">
          <div>
            <button onClick={handleShow4} className="relative inline-block text-base group">
              <span className="relative z-10 block px-8 py-3 overflow-hidden font-medium leading-tight text-gray-800 transition-colors duration-300 ease-out border-2 border-gray-900 rounded-lg group-hover:text-white">
                <span className="absolute inset-0 w-full h-full px-8 py-3 rounded-lg bg-gray-50"></span>
                <span className="absolute left-0 w-48 h-48 -ml-5 transition-all duration-300 origin-top-right -rotate-90 -translate-x-full translate-y-12 bg-gray-900 group-hover:-rotate-180 ease"></span>
                <span className="relative">Chọn khách hàng</span>
              </span>
              <span
                className="absolute bottom-0 right-0 w-full h-10 -mb-1 -mr-1 transition-all duration-200 ease-linear bg-gray-900 rounded-lg group-hover:mb-0 group-hover:mr-0"
                data-rounded="rounded-lg"
              ></span>
            </button>
            <Modal style={{ marginTop: 120, marginLeft: 150 }} show={show4} onHide={handleClose4}>
              <Modal.Header closeButton>
                <Modal.Title style={{ marginLeft: 175 }}>Khách Hàng</Modal.Title>
              </Modal.Header>
              <div style={{ paddingLeft: 25 }} className="search">
                <input
                  style={{ borderRadius: 15, width: 438, height: 35 }}
                  type="text"
                  className="input-search results-list"
                  placeholder="Nhập mã, số điện thoại hoặc tên khách hàng cần tìm..."
                  value={termKH}
                  onChange={handleInputChangeKH}
                />
              </div>
              <Modal.Body style={{ width: 500, maxHeight: 390, overflow: 'scroll' }}>
                {kh.map((k, index) => (
                  <div
                    key={k.id}
                    style={{
                      border: '2px solid skyblue',
                      borderRadius: 10,
                      height: 85,
                      paddingTop: 8,
                      marginTop: index > 0 ? 20 : 0 // Thêm khoảng cách 20px cho phần tử từ thứ 2 trở đi
                    }}
                  >
                    <h7 style={{ paddingLeft: 15 }}>
                      <button
                        style={{ color: 'aqua', display: 'none' }}
                        onClick={() => {
                          setIsShowUPKH(true);
                          setShow4(false);
                          setIdKH(k.id);
                        }}
                        className="fa-regular fa-pen-to-square fa-khenh me-1"
                      ></button>
                      <strong style={{ fontSize: 16 }}>{k.tenKhachHang}</strong> |{' '}
                      <label style={{ fontSize: 15, fontStyle: 'italic' }} htmlFor="sdt">
                        {k.sdt}
                      </label>
                    </h7>
                    <br></br>
                    <div className="row">
                      <div className="col-6" style={{ paddingLeft: 27, marginTop: 15 }}>
                        <p style={{ fontSize: 12, fontStyle: 'italic' }}>Mã: {k.maKhachHang}</p>
                      </div>
                      <div className="col-3" style={{ paddingLeft: 120, width: 128 }}>
                        <button
                          onClick={() => handleChooseKH(k.id, k.tenKhachHang, k.sdt)}
                          className="relative inline-flex items-center justify-start py-2 pl-4 pr-12 overflow-hidden font-semibold shadow text-indigo-600 transition-all duration-150 ease-in-out rounded hover:pl-10 hover:pr-6 bg-gray-50 group"
                        >
                          <span className="absolute bottom-0 left-0 w-full h-1 transition-all duration-150 ease-in-out bg-indigo-600 group-hover:h-full"></span>
                          <span className="absolute right-0 pr-4 duration-200 ease-out group-hover:translate-x-12">
                            <svg
                              className="w-5 h-5 text-green-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                            </svg>
                          </span>
                          <span className="absolute left-0 pl-2.5 -translate-x-12 group-hover:translate-x-0 ease-out duration-200">
                            <svg
                              className="w-5 h-5 text-green-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                            </svg>
                          </span>
                          <span className="relative2 text-left group-hover:text-white">Chọn</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </Modal.Body>
            </Modal>
            <button className="fa-solid fa-plus mx-3" onClick={handleShow3}></button>
            <Modal
              size="lg"
              aria-labelledby="contained-modal-title-vcenter"
              centered
              style={{ marginLeft: 150, paddingBottom: 110 }}
              show={show3}
              onHide={handleClose3}
            >
              <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter" style={{ marginLeft: 290 }}>
                  Thêm mới khách hàng
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <form className="needs-validation" noValidate onSubmit={handleAddKH}>
                  <div className="row">
                    <div className="col-6">
                      <div className="form-group row">
                        <label style={{ fontWeight: 'bold' }} htmlFor="tenNguoiNhan" className="col-sm-3 col-form-label">
                          Mã KH:
                        </label>
                        <div className="col-sm-9">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Mã mặc định"
                            value={valuesKH.maKhachHang}
                            onChange={(e) => {
                              setValuesKH({ ...valuesKH, maKhachHang: e.target.value });
                            }}
                          />
                        </div>
                      </div>
                      <br></br>
                      <div className="form-group row">
                        <label style={{ fontWeight: 'bold' }} htmlFor="tenNguoiNhan" className="col-sm-3 col-form-label">
                          Họ Và Tên:
                        </label>
                        <div className="col-sm-9">
                          <input
                            type="text"
                            className="form-control"
                            // name="tenKhachHang"
                            placeholder=""
                            value={valuesKH.tenKhachHang}
                            onChange={(e) => {
                              setValuesKH({ ...valuesKH, tenKhachHang: e.target.value });
                            }}
                          />
                          {/* {!none && <div style={{ color: 'red' }}>Tên người nhận không được để trống !</div>}
                              {!none1 && <div style={{ color: 'red' }}>Tên người nhận không được quá 20 ký tự và phải là chữ !</div>} */}
                        </div>
                      </div>
                      <br></br>
                      <div className="form-group row">
                        <label style={{ fontWeight: 'bold' }} htmlFor="soDienThoai" className="col-sm-3 col-form-label">
                          Số ĐT:
                        </label>
                        <div className="col-sm-9">
                          <input
                            type="tel"
                            className="form-control"
                            // name="soDienThoai"
                            placeholder=""
                            value={valuesKH.sdt}
                            onChange={(e) => {
                              setValuesKH({ ...valuesKH, sdt: e.target.value });
                            }}
                          />
                          {/* {!none2 && <div style={{ color: 'red' }}>Số điện thoại không được để trống !</div>}
                              {!none3 && (
                                <div style={{ color: 'red' }}>Số điện thoại phải là số, bắt đầu bằng số 0 và phải đúng 10 số !</div>
                              )} */}
                        </div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="form-group row">
                        <label style={{ fontWeight: 'bold' }} htmlFor="tenNguoiNhan" className="col-sm-3 col-form-label">
                          Email:
                        </label>
                        <div className="col-sm-9">
                          <input
                            type="text"
                            className="form-control"
                            // name="email"
                            placeholder=""
                            value={valuesKH.email}
                            onChange={(e) => {
                              setValuesKH({ ...valuesKH, email: e.target.value });
                            }}
                          />
                        </div>
                      </div>
                      <br></br>
                      <div className="form-group row">
                        <label style={{ fontWeight: 'bold' }} htmlFor="tenNguoiNhan" className="col-sm-3 col-form-label">
                          Giới Tính:
                        </label>
                        <div className="col-sm-9">
                          <div style={{ marginTop: 5 }} className="form-check form-check-inline">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="gt"
                              value="true"
                              onChange={(e) => {
                                setValuesKH({ ...valuesKH, gioiTinh: e.target.value });
                              }}
                            />
                            <span style={{ marginLeft: 5 }} className="form-check-label">
                              Nam
                            </span>
                          </div>
                          <div style={{ marginLeft: 15 }} className="form-check form-check-inline">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="gt"
                              value="false"
                              onChange={(e) => {
                                setValuesKH({ ...valuesKH, gioiTinh: e.target.value });
                              }}
                            />
                            <span style={{ marginLeft: 5 }} className="form-check-label">
                              Nữ
                            </span>
                          </div>
                        </div>
                      </div>
                      <br></br>
                      <div className="form-group row">
                        <label style={{ fontWeight: 'bold' }} htmlFor="soDienThoai" className="col-sm-3 col-form-label">
                          Ngày sinh:
                        </label>
                        <div className="col-sm-9">
                          <input
                            type="date"
                            className="form-control"
                            // name="ngaySinh"
                            placeholder=""
                            value={valuesKH.ngaySinh}
                            onChange={(e) => {
                              setValuesKH({ ...valuesKH, ngaySinh: e.target.value });
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <br></br>
                  <div className="text-center">
                    <button
                      // onClick={handleAddKH}
                      // type="submit"
                      className="btn btn-labeled shadow-button"
                      style={{
                        background: 'deepskyblue',
                        borderRadius: '50px',
                        border: '1px solid black',
                        justifyItems: 'center'
                      }}
                    >
                      <span
                        style={{
                          marginBottom: '3px',
                          color: 'white',
                          fontSize: '15px',
                          fontWeight: 'bold'
                        }}
                        className="btn-text"
                      >
                        Thêm
                      </span>
                    </button>
                  </div>
                </form>
              </Modal.Body>
            </Modal>
          </div>
          <br /> <br />
          <div className="ma-giam-gia">
            <div>
              <h6>Tên khách hàng</h6>
            </div>
            <div>
              <p>
                <input
                  value={dataDetailHD.tenNguoiNhan}
                  type="text"
                  style={{ border: 'none', borderBottom: '1px solid gray', textAlign: 'right' }}
                  readOnly
                />{' '}
              </p>
            </div>
          </div>
          <div className="ma-giam-gia">
            <div>
              <h6>Số điện thoại</h6>
            </div>
            <div>
              <p>
                <input
                  value={dataDetailHD.soDienThoai}
                  type="text"
                  style={{ border: 'none', borderBottom: '1px solid gray', textAlign: 'right' }}
                  readOnly
                />{' '}
              </p>
            </div>
          </div>
          <div className="ma-giam-gia">
            <div>
              <h6>Số lượng sản phẩm</h6>
            </div>
            <div>
              <p>{tongSoLuong}</p>
            </div>
          </div>
          <div className="ma-giam-gia">
            <div>
              <h6>Tổng tiền</h6>
            </div>
            <div>
              <p>{convertToCurrency(totalAmount)}</p>
            </div>
          </div>
          {dataHDKM.map((d) => (
            <div key={d.id} className="ma-giam-gia" style={{ color: 'red' }}>
              <div>
                <h6>Tiền giảm</h6>
              </div>
              <div>
                <p>-{convertToCurrency(d.tienGiam)}</p>
              </div>
            </div>
          ))}
          <div className="ma-giam-gia">
            <div>
              <h5>Khách phải trả</h5>
            </div>
            <div>
              <p style={{ fontSize: 'large', fontWeight: 'bold' }}>{convertToCurrency(dataDetailHD.tongTienKhiGiam)}</p>
            </div>
          </div>
          <div className="ma-giam-gia">
            <div>
              <h6>Tiền khách đưa</h6>
            </div>
            {dataLoginNV ? (
              <div>
                {dataDetailHD.tongTienKhiGiam >= 50000000 ? (
                  <>
                    <p style={{ fontWeight: 'bold', color: 'red' }}>Không đủ điều kiện thanh toán</p>
                  </>
                ) : (
                  <input
                    type="number"
                    style={{ border: 'none', borderBottom: '1px solid gray', textAlign: 'right' }}
                    onChange={(e) => handleChangeValueTien(e.target.value)}
                    min={0}
                  />
                )}
              </div>
            ) : (
              <input
                type="number"
                style={{ border: 'none', borderBottom: '1px solid gray', textAlign: 'right' }}
                onChange={(e) => handleChangeValueTien(e.target.value)}
                min={0}
              />
            )}
          </div>
          <br></br>
          <div className="ma-giam-gia">
            <div>
              <select
                className="form-select"
                aria-label="Default select example"
                value={httt}
                onChange={(e) => {
                  setHttt(e.target.value);
                  setValuesUpdateHD({
                    ...valuesUpdateHD,
                    ...valuesUpdateHD.hinhThucThanhToan,
                    hinhThucThanhToan: {
                      ten: e.target.value
                    }
                  });
                  VNP(id);
                }}
              >
                <option value="Tiền mặt">Tiền mặt</option>
                <option value="VNPay">VNPay</option>
              </select>
            </div>
          </div>
          <br></br>
          <div className="ma-giam-gia">
            {dataKM.map((d, i) => (
              <div
                key={i}
                className={`col-12 card-voucher card-width`}
                onClick={() => handleDivClick(i)}
                style={{ cursor: 'pointer', overflow: 'scroll', color: 'aqua' }}
              >
                <h6 style={{ color: 'red', wordWrap: 'break-word' }}>
                  Giảm {d.loaiGiam ? convertToCurrency(d.mucGiam) : d.mucGiam + '%'} cho đơn tối thiểu {convertToCurrency(d.tien)}
                </h6>
                <div className="text-voucher">
                  <p style={{ fontSize: '13px', color: 'gray' }}>HSD: {formatDate(d.thoiGianKetThuc)}</p>
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={() => handleAddValueKm(d.id, d.mucGiam, d.loaiGiam)}
                    // disabled={true} // Thêm disabled vào đây
                  >
                    Áp dụng
                  </button>
                </div>
              </div>
            ))}
          </div>
          <br></br>
          {dataLoginNV ? (
            <>
              {dataDetailHD.tongTienKhiGiam < 50000000 && (
                <div>
                  <input type="checkbox" checked={check === true} onChange={() => setCheck(!check)} />
                  In hoá đơn
                </div>
              )}
              {dataDetailHD.tongTienKhiGiam < 50000000 && (
                <div className="button-thanh-toan">
                  {check ? (
                    httt === 'VNPay' ? (
                      <button
                        type="button"
                        className="btn btn-success"
                        disabled={dataDetailHD.tongTienKhiGiam > tienKhachDua}
                        onClick={() => handleThanhToanWithVNP()}
                      >
                        <PDFDownloadLink document={<InvoiceDocument />} fileName="hoa_don.pdf">
                          <Text style={styles.button}>Thanh toán</Text>
                        </PDFDownloadLink>
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-success"
                        disabled={dataDetailHD.tongTienKhiGiam > tienKhachDua}
                        onClick={() => handleThanhToan()}
                      >
                        <PDFDownloadLink document={<InvoiceDocument />} fileName="hoa_don.pdf">
                          <Text style={styles.button}>Thanh toán</Text>
                        </PDFDownloadLink>
                      </button>
                    )
                  ) : httt === 'Tiền mặt' ? (
                    <button
                      type="button"
                      className="btn btn-success"
                      disabled={dataDetailHD.tongTienKhiGiam > tienKhachDua || tienKhachDua === 0 || totalAmount >= 50000000}
                      onClick={() => handleThanhToan()}
                    >
                      Thanh toán
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-success"
                      disabled={dataDetailHD.tongTienKhiGiam > tienKhachDua || tienKhachDua === 0 || totalAmount >= 50000000}
                      onClick={() => handleThanhToanWithVNP()}
                    >
                      Thanh toán
                    </button>
                  )}
                </div>
              )}
              {dataDetailHD.tongTienKhiGiam >= 50000000 && (
                <div>
                  <h1 style={{ color: 'brown' }}>Nhân viên chỉ được thanh toán đơn hàng dưới 50 triệu vnd !</h1>
                </div>
              )}
            </>
          ) : (
            <>
              <div>
                <input type="checkbox" checked={check === true} onChange={() => setCheck(!check)} />
                In hoá đơn
              </div>
              <div className="button-thanh-toan">
                {check ? (
                  httt === 'VNPay' ? (
                    <button
                      type="button"
                      className="btn btn-success"
                      disabled={dataDetailHD.tongTienKhiGiam > tienKhachDua}
                      onClick={() => handleThanhToanWithVNP()}
                    >
                      <PDFDownloadLink document={<InvoiceDocument />} fileName="hoa_don.pdf">
                        <Text style={styles.button}>Thanh toán</Text>
                      </PDFDownloadLink>
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-success"
                      disabled={dataDetailHD.tongTienKhiGiam > tienKhachDua}
                      onClick={() => handleThanhToan()}
                    >
                      <PDFDownloadLink document={<InvoiceDocument />} fileName="hoa_don.pdf">
                        <Text style={styles.button}>Thanh toán</Text>
                      </PDFDownloadLink>
                    </button>
                  )
                ) : httt === 'Tiền mặt' ? (
                  <button
                    type="button"
                    className="btn btn-success"
                    disabled={dataDetailHD.tongTienKhiGiam > tienKhachDua || tienKhachDua === 0 || totalAmount >= 50000000}
                    onClick={() => handleThanhToan()}
                  >
                    Thanh toán
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-success"
                    disabled={dataDetailHD.tongTienKhiGiam > tienKhachDua || tienKhachDua === 0 || totalAmount >= 50000000}
                    onClick={() => handleThanhToanWithVNP()}
                  >
                    Thanh toán
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      <TableKM
        show={show}
        handleClose={() => setShow(false)}
        dataKM={dataKM}
        convertToCurrency={convertToCurrency}
        handleDivClick={handleDivClick}
        activeIndex={activeIndex}
        handleAddKM={handleAddKM}
        formatDate={formatDate}
      ></TableKM>
      <ModalUpdateKH
        show={isShowUPKH}
        handleClose={() => {
          setIsShowUPKH(false);
          setShow4(true);
        }}
        setValuesKH={setValuesKH}
        valuesKH={valuesKH}
      />
    </div>
  );
}

export default DonHang;