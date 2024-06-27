/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
// import Accordion from 'react-bootstrap/Accordion';
import React, { useState, useEffect } from 'react';
import '../../scss/CheckOut.scss';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from 'react-router';
import { getById, getKmById } from 'services/ServiceDonHang';
import { addKhuyenMai, clearGH, thanhToan } from 'services/GioHangService';
import { getTP, getQH, getP, getServices, getFee, TGGH } from 'services/ApiGHNService';
import { payOnline } from 'services/PayService';
import { detailKH, getAllDcKh, detailDC, addDCKH } from 'services/KhachHangService';
import ChangeDC from './ChangeDC';
import UpdateDC from './UpdateDC';
import { Avatar, Checkbox, FormControlLabel } from '@mui/material';
import ModalChinhSach from './Modal/ModalChinhSach';
import { getAllKM } from 'services/ServiceKhuyenMai';

function CheckoutForm(props) {
  // eslint-disable-next-line react/prop-types
  const { handleBackToCart, label, idGH, dataLogin } = props;
  const [dataHDCT, setDataHDCT] = useState([]);
  const [dataKH, setDataKH] = useState([]);
  const [thanhPho, setThanhPho] = useState([]);
  const [quan, setQuan] = useState([]);
  const [phuong, setPhuong] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedWard, setSelectedWard] = useState('');
  const [urlPay, setUrlPay] = useState('');
  const [idDC, setIdDC] = useState('');
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [ngayDuKienNhan, setNgayDuKienNhan] = useState(0);
  const [tongTienKhiGiam, setTongTienKhiGiam] = useState(0);
  const [dataHDKM, setDataHDKM] = useState([]);
  const [dataDetailDC, setDataDetailDC] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();
  const [isShow, setIsShow] = useState(false);
  const [isShowAdd, setIsShowAdd] = useState(false);
  const [isShowUpdate, setIsShowUpdate] = useState(false);
  const [isUpdatingDiaChi, setIsUpdatingDiaChi] = useState(false);
  const [dataDC, setDataDC] = useState([]);
  const product = localStorage.getItem('productAfter');
  const [checked, setChecked] = useState(false);
  const [isShowDK, setIsShowDK] = useState(false);

  const [valuesAddDC, setValuesAddDC] = useState({
    diaChi: '',
    tinhThanh: '',
    quanHuyen: '',
    phuongXa: '',
    trangThai: 1
  });
  const [wardCode, setWardCode] = useState({
    code: ''
  });
  const [valuesId, setValuesId] = useState({
    province_id: ''
  });
  const [valuesIdWard, setValuesIdWard] = useState({
    district_id: ''
  });
  const [valuesDC, setValuesDC] = useState({
    diaChi: '',
    tinhThanh: '',
    quanHuyen: '',
    phuongXa: ''
  });
  const [valuesKhuyenMai, setValuesKhuyenMai] = useState({
    khuyenMai: {
      ma: '',
      tien: 0
    },
    hoaDon: {
      id: id
    },
    tienGiam: 0
  });
  const [valuesServices, setValuesServices] = useState({
    shop_id: 4625720,
    from_district: 1710,
    to_district: 0
  });
  const [valuesFee, setValuesFee] = useState({
    service_id: 0,
    insurance_value: 0,
    coupon: null,
    from_district_id: 1710,
    to_district_id: 0,
    to_ward_code: '',
    height: 15,
    length: 15,
    weight: 5000,
    width: 15
  });
  const [valuesUpdateHD, setValuesUpdateHD] = useState({
    tenNguoiNhan: '',
    soDienThoai: '',
    diaChi: '',
    tinh: '',
    huyen: '',
    xa: '',
    tongTien: 0,
    tongTienKhiGiam: 0,
    trangThai: 0,
    ngayDuKienNhan: 0,
    ghiChu: '',
    tienShip: 0,
    nguoiTao: '',
    hinhThucThanhToan: {
      tien: 0,
      ten: '',
      trangThai: 1
    }
  });
  const [errors, setErrors] = useState({
    tenNguoiNhan: true,
    soDienThoai: true,
    diaChi: true,
    tinh: true,
    quan: true,
    xa: true,
    pttt: true
  });
  const [tgDuKien, setTgDuKien] = useState({
    from_district_id: 1710,
    from_ward_code: '1A1112',
    to_district_id: 0,
    to_ward_code: '',
    service_id: 0
  });

  useEffect(() => {
    getThanhPho();
  }, []);

  useEffect(() => {
    if (dataLogin && dataLogin.role == 'KH') {
      dataDC.forEach((d) => {
        if (d.trangThai === 1) {
          setValuesDC({ ...valuesDC, diaChi: d.diaChi, phuongXa: d.phuongXa, quanHuyen: d.quanHuyen, tinhThanh: d.tinhThanh });
          thanhPho.forEach((province) => {
            if (province.NameExtension[1] === d.tinhThanh) {
              setValuesId({
                province_id: province.ProvinceID
              });
              setValuesUpdateHD({
                ...valuesUpdateHD,
                diaChi: d.diaChi,
                tinh: d.tinhThanh,
                huyen: d.quanHuyen,
                xa: d.phuongXa
              });
            }
          });
        }
      });
    }
  }, [thanhPho]);

  useEffect(() => {
    if (valuesFee.service_id !== 0) {
      fee(valuesFee);
      thoiGiaoHang(tgDuKien);
    }
  }, [tgDuKien]);

  useEffect(() => {
    if (idDC) {
      getOneDC(idDC);
    }
  }, [idDC]);

  useEffect(() => {
    if (valuesId.province_id) {
      getQuanHuyen(valuesId);
    }
  }, [valuesId.province_id]);

  useEffect(() => {
    if (valuesIdWard.district_id) {
      getPhuong(valuesIdWard);
    }
  }, [valuesIdWard.district_id]);

  useEffect(() => {
    if (!isShow && valuesFee.service_id !== 0) {
      fee(valuesFee);
      thoiGiaoHang(tgDuKien);
    }
  }, [isShow]);

  useEffect(() => {
    setTgDuKien({
      ...tgDuKien,
      to_ward_code: wardCode.code
    });
  }, [tgDuKien.service_id]);

  useEffect(() => {
    setValuesFee({
      ...valuesFee,
      insurance_value: totalAmount,
      to_ward_code: ''
    });
    setTgDuKien({
      ...tgDuKien,
      to_ward_code: wardCode.code
    });
  }, [wardCode]);

  useEffect(() => {
    phuong.forEach((ward) => {
      if (ward.WardName === valuesDC.phuongXa) {
        if (ward.WardCode) {
          setWardCode({ code: ward.WardCode });
        }
      }
    });
  }, [phuong, valuesDC]);

  useEffect(() => {
    quan.forEach((district) => {
      if (district.DistrictName === valuesDC.quanHuyen) {
        setValuesIdWard({
          district_id: district.DistrictID
        });
        setValuesServices({
          ...valuesServices,
          to_district: district.DistrictID
        });
        setValuesFee({
          ...valuesFee,
          to_district_id: district.DistrictID
        });
        setTgDuKien({
          ...tgDuKien,
          to_district_id: district.DistrictID
        });
      }
    });
  }, [quan, valuesDC, valuesId]);

  useEffect(() => {
    if (dataLogin && dataLogin.role == 'KH') {
      // eslint-disable-next-line react/prop-types
      getKH(dataLogin.id);
      getAllDC(dataLogin.id);
    }
  }, [dataLogin]);

  useEffect(() => {
    if (dataLogin && dataLogin.role == 'KH') {
      setValuesUpdateHD({ ...valuesUpdateHD, tenNguoiNhan: dataKH.tenKhachHang, soDienThoai: dataKH.sdt });
      return;
    }
  }, [dataKH]);

  useEffect(() => {
    if (valuesServices.to_district !== 0) {
      getService(valuesServices);
    }
  }, [valuesServices]);

  useEffect(() => {
    const totalGiam = dataHDKM.reduce((total, d) => total + d.tienGiam, 0);
    setTongTienKhiGiam(totalAmount - totalGiam);

    setValuesUpdateHD({
      ...valuesUpdateHD,
      tongTien: totalAmount,
      tongTienKhiGiam: totalAmount - totalGiam
    });
  }, [valuesUpdateHD.tienShip]);

  useEffect(() => {
    if (valuesFee.service_id !== 0) {
      fee(valuesFee);
      thoiGiaoHang(tgDuKien);
    }
  }, [valuesFee.to_ward_code]);

  useEffect(() => {
    setValuesUpdateHD({
      ...valuesUpdateHD,
      ngayDuKienNhan: ngayDuKienNhan
    });
  }, [ngayDuKienNhan]);

  useEffect(() => {
    getAllHDById(id);
    findAllKM(id);
  }, [id]);

  useEffect(() => {
    const totalGiam = dataHDKM.reduce((total, d) => total + d.tienGiam, 0);
    // Tính tổng tiền khi valuesSanPham thay đổi
    let sum = 0;
    dataHDCT.forEach((d) => {
      sum += d.soLuong * d.donGia;
    });
    // Cập nhật giá trị tổng tiền
    setTotalAmount(sum);
    setTongTienKhiGiam(sum - totalGiam);
  }, [dataHDCT, dataHDKM]);

  useEffect(() => {
    if (isUpdatingDiaChi) {
      // Ngừng cập nhật địa chỉ
      setIsUpdatingDiaChi(false);
      // Gọi thanhToanHD khi địa chỉ đã được cập nhật hoàn toàn
      if (valuesUpdateHD.hinhThucThanhToan.ten === 'Tiền mặt') {
        thanhToanHD(id, valuesUpdateHD, '');
        navigate('/checkout/thankyou');
        localStorage.setItem('product', product);
        clear(idGH, id);
      } else {
        localStorage.setItem('productHDUpdate', JSON.stringify({ ...valuesUpdateHD, id: id }));
        window.location.href = urlPay;
      }
    }
    VNP(tongTienKhiGiam);
  }, [valuesUpdateHD]);

  const handleChangeValuesKM = () => {
    addVToHD(valuesKhuyenMai);
  };

  const handleAddDC = () => {
    if (selectedAddressId === null) {
      toast.error('Vui lòng chọn địa chỉ');
      return;
    }
    setValuesUpdateHD({
      ...valuesUpdateHD,
      diaChi: valuesDC.diaChi,
      tinh: valuesDC.tinhThanh,
      huyen: valuesDC.quanHuyen,
      xa: valuesDC.phuongXa
    });
    setIsShow(false);
  };

  const handleUpdateDC = () => {
    if (!valuesAddDC.diaChi) {
      toast.error('Vui lòng nhập địa chỉ');
      return;
    }
    if (!valuesAddDC.phuongXa) {
      toast.error('Vui lòng nhập phường');
      return;
    }
    if (!valuesAddDC.quanHuyen) {
      toast.error('Vui lòng nhập quận');
      return;
    }
    if (!valuesAddDC.tinhThanh) {
      toast.error('Vui lòng nhập tỉnh');
      return;
    }
    if (isShowAdd) {
      addDC(dataLogin.id, valuesAddDC);
      return;
    }
    addDC(dataLogin.id, dataDetailDC);
  };

  const handleChange = (value) => {
    const totalGiam = dataHDKM.reduce((total, d) => total + d.tienGiam, 0);
    setValuesKhuyenMai({
      ...valuesKhuyenMai,
      khuyenMai: {
        ma: value,
        tien: totalAmount
      }
    });
    setTongTienKhiGiam(totalAmount - totalGiam);
  };

  const handleProvinceChange = (event) => {
    const provinceId = {
      province_id: event.target.value
    };
    setSelectedProvince(event.target.value);
    getQuanHuyen(provinceId);
    const selectedProvinceId = event.target.value;
    const selectedProvince = thanhPho.find((province) => province.ProvinceID === parseInt(selectedProvinceId, 10));

    if (selectedProvince) {
      // Lấy thông tin tỉnh/thành phố được chọn
      const selectedProvinceName = selectedProvince.NameExtension[1];
      setValuesUpdateHD({
        ...valuesUpdateHD,
        tinh: selectedProvinceName
      });
      setDataDetailDC({
        ...dataDetailDC,
        tinhThanh: selectedProvinceName
      });
      setValuesAddDC({
        ...valuesAddDC,
        tinhThanh: selectedProvinceName
      });
    }
    setErrors({
      ...errors,
      tinh: true
    });
  };

  const handleDistrictChange = (event) => {
    const districtId = {
      district_id: event.target.value
    };
    setSelectedDistrict(event.target.value);
    setValuesServices({
      ...valuesServices,
      to_district: parseInt(event.target.value, 10)
    });
    setTgDuKien({
      ...tgDuKien,
      to_district_id: parseInt(event.target.value, 10)
    });
    getPhuong(districtId);
    setValuesFee({
      ...valuesFee,
      to_district_id: parseInt(event.target.value, 10)
    });
    const selectedProvinceId = event.target.value;
    const selectedProvince = quan.find((province) => province.DistrictID === parseInt(selectedProvinceId, 10));

    if (selectedProvince) {
      // Lấy thông tin tỉnh/thành phố được chọn
      const selectedProvinceName = selectedProvince.DistrictName;
      setValuesUpdateHD({
        ...valuesUpdateHD,
        huyen: selectedProvinceName
      });
      setDataDetailDC({
        ...dataDetailDC,
        quanHuyen: selectedProvinceName
      });
      setValuesAddDC({
        ...valuesAddDC,
        quanHuyen: selectedProvinceName
      });
    }
    setErrors({
      ...errors,
      quan: true
    });
  };

  const handleWardChange = (event) => {
    const selectedProvinceId = event.target.value;
    const selectedProvince = phuong.find((province) => province.WardCode === selectedProvinceId);
    if (dataLogin && dataLogin.role == 'KH') {
      if (selectedProvince) {
        // Lấy thông tin tỉnh/thành phố được chọn
        const selectedProvinceName = selectedProvince.WardName;
        setDataDetailDC({
          ...dataDetailDC,
          phuongXa: selectedProvinceName
        });
        setValuesAddDC({
          ...valuesAddDC,
          phuongXa: selectedProvinceName
        });
      }
    } else {
      const totalGiam = dataHDKM.reduce((total, d) => total + d.tienGiam, 0);
      setSelectedWard(event.target.value);
      setValuesFee({
        ...valuesFee,
        insurance_value: totalAmount,
        to_ward_code: event.target.value
      });
      setTgDuKien({
        ...tgDuKien,
        to_ward_code: event.target.value
      });
      setTongTienKhiGiam(totalAmount - totalGiam);

      if (selectedProvince) {
        // Lấy thông tin tỉnh/thành phố được chọn
        const selectedProvinceName = selectedProvince.WardName;
        setValuesUpdateHD({
          ...valuesUpdateHD,
          xa: selectedProvinceName
        });
      }
      setErrors({
        ...errors,
        xa: true
      });
    }
  };

  function convertToCurrency(number) {
    // Chuyển đổi số thành định dạng tiền Việt Nam
    const formatter = new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    });
    return formatter.format(number);
  }

  const clear = async (id, idHD) => {
    try {
      await clearGH(id, idHD);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllDC = async (id) => {
    try {
      const res = await getAllDcKh(id);
      if (res.data) {
        setDataDC(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addDC = async (id, value) => {
    try {
      const res = await addDCKH(id, value);
      if (res.data) {
        toast.success('Cập nhật thành công');
        getAllDC(dataLogin.id);
        setIsShowUpdate(false);
        setIsShowAdd(false);
        setIsShow(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addVToHD = async (value) => {
    try {
      const res = await addKhuyenMai(value);
      if (res.data === 'error') {
        toast.error('Mã khuyễn mãi không hợp lệ');
      } else if (res.data === 'ff') {
        toast.error('Bạn đang sử dụng mã này');
      } else {
        findAllKM(id);
        const totalGiam = dataHDKM.reduce((total, d) => total + d.tienGiam, 0);
        toast.success('Thêm mã thành công');
        setTongTienKhiGiam(totalAmount - totalGiam);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAllHDById = async (idHD) => {
    try {
      const res = await getById(idHD);
      if (res) {
        setDataHDCT(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getService = async (value) => {
    try {
      const res = await getServices(value);
      if (res) {
        setValuesFee({
          ...valuesFee,
          service_id: res.data.data[0].service_id
        });
        setTgDuKien({
          ...tgDuKien,
          service_id: res.data.data[0].service_id
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fee = async (value) => {
    try {
      const res = await getFee(value);
      if (res) {
        setValuesUpdateHD({
          ...valuesUpdateHD
          // tienShip: res.data.data.total
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getKH = async (id) => {
    try {
      const res = await detailKH(id);
      if (res) {
        setDataKH(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getThanhPho = async () => {
    try {
      const res = await getTP();
      if (res) {
        setThanhPho(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getQuanHuyen = async (value) => {
    try {
      const res = await getQH(value);
      if (res) {
        setQuan(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getPhuong = async (value) => {
    try {
      const res = await getP(value);
      if (res) {
        setPhuong(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const thoiGiaoHang = async (value) => {
    try {
      const res = await TGGH(value);
      if (res) {
        setNgayDuKienNhan(res.data.data.leadtime);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const findAllKM = async (id) => {
    try {
      const res = await getKmById(id);
      if (res) {
        setDataHDKM(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const thanhToanHD = async (id, value, nguoiTao) => {
    try {
      const res = await thanhToan(id, value, nguoiTao);
      if (res) {
        toast.success('Thành công');
        localStorage.setItem('res', JSON.stringify(res.data.hinhThucThanhToan.id));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const VNP = async (tien) => {
    try {
      const res = await payOnline(tien, 'http://localhost:3000/check-vnp');
      if (res) {
        setUrlPay(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getOneDC = async (id) => {
    try {
      const res = await detailDC(id);
      if (res) {
        setDataDetailDC(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  console.log(isShowDK);

  const handleThanhToan = () => {
    if (valuesUpdateHD.tenNguoiNhan === '') {
      setErrors({
        ...errors,
        tenNguoiNhan: false
      });
      return;
    } else if (valuesUpdateHD.soDienThoai === '' || valuesUpdateHD.soDienThoai === null || valuesUpdateHD.soDienThoai === undefined) {
      setErrors({
        ...errors,
        soDienThoai: false
      });
      return;
    } else if (valuesUpdateHD.diaChi === '') {
      setErrors({
        ...errors,
        diaChi: false
      });
      return;
    } else if (valuesUpdateHD.tinh === '') {
      setErrors({
        ...errors,
        tinh: false
      });
      return;
    } else if (valuesUpdateHD.huyen === '') {
      setErrors({
        ...errors,
        quan: false
      });
      return;
    } else if (valuesUpdateHD.xa === '') {
      setErrors({
        ...errors,
        xa: false
      });
      return;
    } else if (valuesUpdateHD.hinhThucThanhToan.ten === '') {
      toast.error('Hãy chọn phương thức thanh toán');
      return;
    } else if (/\d/.test(valuesUpdateHD.tenNguoiNhan)) {
      toast.error('Tên không được chứa chữ số');
      return;
    } else if (!/^(0[1-9])+([0-9]{8})\b$/.test(valuesUpdateHD.soDienThoai)) {
      toast.error('Số điện thoại không đúng định dạng');
      return;
    } else if (!checked) {
      toast.error('Bạn hãy chấp nhận điểu khoản của chúng tôi để tiếp tục mua hàng');
      return;
    }

    // Bắt đầu cập nhật địa chỉ
    setIsUpdatingDiaChi(true);
    const totalGiam = dataHDKM.reduce((total, d) => total + d.tienGiam, 0);

    if (dataLogin) {
      const newValues = {
        ...valuesUpdateHD,
        khachHang: { id: dataLogin.id }
      };
      setValuesUpdateHD(newValues);
    }
    // Cập nhật giá trị diaChi
    setValuesUpdateHD((valuesUpdateHD) => ({
      ...valuesUpdateHD,
      diaChi: valuesUpdateHD.diaChi,
      tinh: valuesUpdateHD.tinh,
      huyen: valuesUpdateHD.huyen,
      xa: valuesUpdateHD.xa,
      ngayDuKienNhan: ngayDuKienNhan,
      tongTien: totalAmount,
      tongTienKhiGiam: totalAmount - totalGiam
    }));
  };

  const handleThanhToanWithNVP = () => {
    if (valuesUpdateHD.tenNguoiNhan === '') {
      setErrors({
        ...errors,
        tenNguoiNhan: false
      });
      return;
    } else if (valuesUpdateHD.soDienThoai === '' || valuesUpdateHD.soDienThoai === null || valuesUpdateHD.soDienThoai === undefined) {
      setErrors({
        ...errors,
        soDienThoai: false
      });
      return;
    } else if (valuesUpdateHD.diaChi === '') {
      setErrors({
        ...errors,
        diaChi: false
      });
      return;
    } else if (valuesUpdateHD.tinh === '') {
      setErrors({
        ...errors,
        tinh: false
      });
      return;
    } else if (valuesUpdateHD.huyen === '') {
      setErrors({
        ...errors,
        quan: false
      });
      return;
    } else if (valuesUpdateHD.xa === '') {
      setErrors({
        ...errors,
        xa: false
      });
      return;
    } else if (valuesUpdateHD.hinhThucThanhToan.ten === '') {
      toast.error('Hãy chọn phương thức thanh toán');
      return;
    } else if (!checked) {
      toast.error('Bạn hãy chấp nhận điểu khoản của chúng tôi để tiếp tục mua hàng');
      return;
    }

    // Bắt đầu cập nhật địa chỉ
    setIsUpdatingDiaChi(true);

    const totalGiam = dataHDKM.reduce((total, d) => total + d.tienGiam, 0);
    if (dataLogin) {
      const newValues = {
        ...valuesUpdateHD,
        khachHang: { id: dataLogin.id }
      };
      setValuesUpdateHD(newValues);
    }
    // Cập nhật giá trị diaChi
    setValuesUpdateHD((valuesUpdateHD) => ({
      ...valuesUpdateHD,
      diaChi: valuesUpdateHD.diaChi,
      tinh: valuesUpdateHD.tinh,
      huyen: valuesUpdateHD.huyen,
      xa: valuesUpdateHD.xa,
      ngayDuKienNhan: ngayDuKienNhan,
      tongTien: totalAmount,
      tongTienKhiGiam: totalAmount - totalGiam
    }));
  };

  
  const [dataKM, setDataKM] = useState([]);
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


  useEffect(() => {
    getKM(totalAmount)
  }, [totalAmount])

  const getKM = async (tien) => {
    const res = await getAllKM(tien);
    if (res) {
      setDataKM(res.data);
    }
  };

  return (
    <div className="site-section">
      <div className="container ctn">
        <div className="row">
          <div className="col-md-6 mb-5 mb-md-0">
            <h2 className="h3 mb-3 text-black">Thông Tin Khách Hàng</h2>
            <div className="p-3 p-lg-5 border">
              {dataLogin ? (
                <div className="form-group row fgr">
                  <div className="col-md-12">
                    <label htmlFor="full_name" className="text-black">
                      Địa chỉ <span className="text-danger">*</span>
                    </label>
                    <div className="dia-chi-checkout">
                      <p htmlFor="full_name">
                        {!valuesUpdateHD.diaChi
                          ? 'Không có địa chỉ'
                          : valuesUpdateHD.diaChi + ', ' + valuesUpdateHD.xa + ', ' + valuesUpdateHD.huyen + ', ' + valuesUpdateHD.tinh}
                      </p>
                      <span className="change-dc change-dc-modal" onClick={() => setIsShow(true)}>
                        Thay đổi
                      </span>
                    </div>
                  </div>
                  <span style={{ display: errors.diaChi ? 'none' : '', color: 'red' }}>Không được để trống</span>
                </div>
              ) : (
                ''
              )}
              <div className="form-group row fgr">
                <div className="col-md-12">
                  <label htmlFor="full_name" className="text-black">
                    Họ và Tên <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control fct"
                    id="full_name"
                    name="full_name"
                    placeholder="Họ và Tên"
                    value={valuesUpdateHD.tenNguoiNhan}
                    onChange={(e) => {
                      setValuesUpdateHD({ ...valuesUpdateHD, tenNguoiNhan: e.target.value, nguoiTao: e.target.value });
                      setErrors({
                        ...errors,
                        tenNguoiNhan: true
                      });
                    }}
                  />
                </div>
                <span style={{ display: errors.tenNguoiNhan ? 'none' : '', color: 'red' }}>Không được để trống</span>
              </div>
              <div className="form-group row fgr">
                <div className="col-md-12">
                  <label htmlFor="phone" className="text-black">
                    Số Điện Thoại <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control fct"
                    id="phone"
                    name="phone"
                    placeholder="Số Điện Thoại"
                    value={valuesUpdateHD.soDienThoai}
                    onChange={(e) => {
                      setValuesUpdateHD({ ...valuesUpdateHD, soDienThoai: e.target.value });
                      setErrors({
                        ...errors,
                        soDienThoai: true
                      });
                    }}
                  />
                </div>
                <span style={{ display: errors.soDienThoai ? 'none' : '', color: 'red' }}>Không được để trống</span>
              </div>
              {!dataLogin ? (
                <>
                  <div className="form-group row fgr">
                    <div className="col-md-12">
                      <label htmlFor="address" className="text-black">
                        Địa Chỉ <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control fct"
                        id="address"
                        name="address"
                        placeholder="Địa chỉ"
                        value={valuesUpdateHD.diaChi}
                        onChange={(e) => {
                          setValuesUpdateHD({ ...valuesUpdateHD, diaChi: e.target.value });
                          setErrors({
                            ...errors,
                            diaChi: true
                          });
                        }}
                      />
                    </div>
                    <span style={{ display: errors.diaChi ? 'none' : '', color: 'red' }}>Không được để trống</span>
                  </div>

                  <div className="col-md-12">
                    <label htmlFor="province" className="text-black">
                      Tỉnh/Thành Phố <span className="text-danger">*</span>
                    </label>
                    <select id="province" className="form-select fsl" value={selectedProvince} onChange={handleProvinceChange}>
                      <option value="">-----Chọn tỉnh thành-----</option>
                      {thanhPho.map((province) => (
                        <option key={province.ProvinceID} value={province.ProvinceID}>
                          {province.NameExtension[1]}
                        </option>
                      ))}
                    </select>
                    <span style={{ display: errors.tinh ? 'none' : '', color: 'red' }}>Không được để trống</span>
                  </div>

                  <div className="col-md-12 mt-3">
                    <label htmlFor="district" className="text-black">
                      Quận/Huyện <span className="text-danger">*</span>
                    </label>
                    <select id="district" className="form-select fsl" value={selectedDistrict} onChange={(e) => handleDistrictChange(e)}>
                      <option value="">----Chọn quận huyện-----</option>
                      {quan.map((district) => (
                        <option key={district.DistrictID} value={district.DistrictID}>
                          {district.DistrictName}
                        </option>
                      ))}
                    </select>
                    <span style={{ display: errors.quan ? 'none' : '', color: 'red' }}>Không được để trống</span>
                  </div>

                  <div className="col-md-12 mt-3">
                    <label htmlFor="ward" className="text-black">
                      Phường/Xã <span className="text-danger">*</span>
                    </label>
                    <select id="ward" className="form-select fsl" value={selectedWard} onChange={handleWardChange}>
                      <option value="">-----Chọn phường xã-----</option>
                      {phuong.map((ward) => (
                        <option key={ward.WardCode} value={ward.WardCode}>
                          {ward.WardName}
                        </option>
                      ))}
                    </select>
                    <span style={{ display: errors.xa ? 'none' : '', color: 'red' }}>Không được để trống</span>
                  </div>
                </>
              ) : (
                ''
              )}

              <div className="form-group row mb-5 fgr">
                <div className="col-md-12  mt-3">
                  <label htmlFor="order_notes" className="text-black">
                    Ghi Chú Đơn Hàng
                  </label>
                  <textarea
                    name="order_notes"
                    id="order_notes"
                    cols="30"
                    rows="5"
                    className="form-control fct"
                    placeholder="Nhập ghi chú của bạn ở đây..."
                    value={valuesUpdateHD.ghiChu}
                    onChange={(e) => setValuesUpdateHD({ ...valuesUpdateHD, ghiChu: e.target.value })}
                  ></textarea>
                </div>
              </div>
              <div className="col-md-12 mt-3">
                <p
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    handleBackToCart();
                  }}
                >
                  <i className="fa-solid fa-chevron-left"></i> {label}
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-6 mb-5 mb-md-0">
            <div className="row mb-5">
              <div className="col-md-12">
                <h2 className="h3 mb-3 text-black">Đơn Hàng</h2>
                <div className="p-3 p-lg-5 border">
                  <table className="table site-block-order-table mb-5 tbl">
                    <thead>
                      <tr>
                        <th></th>
                        <th>Sản Phẩm</th>
                        <th>Giá</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataHDCT.map((d, i) => (
                        <tr key={i}>
                          <td className="product-image-col">
                            <Avatar
                              alt={d.chiTietSanPham.sanPham.ten}
                              src={`http://localhost:8080/api/chi-tiet-san-pham/${d.chiTietSanPham.id}`}
                              sx={{ width: 80, height: 110 }}
                              variant="rounded"
                            />
                          </td>
                          <td>
                            <div className="product-details">
                              <span className="product-name">
                                {d.chiTietSanPham.sanPham.ten} <strong className="mx-2">x</strong> {d.soLuong}
                              </span>
                            </div>
                            <span>
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
                            </span>
                          </td>

                          <td>{convertToCurrency(d.donGia)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <table className="table site-block-order-table mb-5 tbl">
                    <tr>
                      <td className="text-black font-weight-bold" colSpan="3">
                        Mã Giảm Giá
                      </td>
                      <td className="text-black">
                        <div className="input-group w-75">
                          <input
                            type="text"
                            className="form-control fct"
                            id="c_code"
                            placeholder="Nhập mã giảm giá"
                            aria-label="Coupon Code"
                            aria-describedby="button-addon2"
                            value={valuesKhuyenMai.khuyenMai.ma}
                            onChange={(e) => handleChange(e.target.value)}
                            style={{ borderRadius: 5, height: '100%' }}
                          />
                          <div className="input-group-append">
                            <button
                              className="btn btn-primary btn-sm px-4 btn-apply"
                              type="button"
                              id="button-addon2"
                              style={{ borderRadius: 5, height: '100%' }}
                              onClick={() => handleChangeValuesKM()}
                            >
                              Apply
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="text-black">
                      {dataKM.map((d, i) => (
              <div
                key={i}
                className={`col-12 card-voucher card-width`}
                onClick={() => handleDivClick(i)}
                style={{ cursor: 'pointer', overflow: 'scroll', color: 'aqua' }}
              >
                <h6 style={{ color: 'red', wordWrap: 'break-word' }}>
                  Giảm {d.loaiGiam ? convertToCurrency(d.mucGiam) : d.mucGiam + '%'} cho đơn tối thiểu {convertToCurrency(d.tien)} - ({d.ma})
                </h6>
                <div className="text-voucher">
                  <p style={{ fontSize: '13px', color: 'gray' }}>HSD: {formatDate(d.thoiGianKetThuc)}</p>
                </div>
              </div>
            ))}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-black font-weight-bold" colSpan="3">
                        Tạm Tính
                      </td>
                      <td className="text-black">{convertToCurrency(totalAmount)}</td>
                    </tr>
                    {dataHDKM.map((d, i) => (
                      <tr key={i} style={{ color: 'red' }}>
                        <td className=" font-weight-bold" colSpan="3">
                          Tiền giảm
                        </td>
                        <td>-{convertToCurrency(d.tienGiam)}</td>
                      </tr>
                    ))}
                    <tr style={{ fontSize: 18 }}>
                      <td className="text-black font-weight-bold" colSpan="3">
                        Tổng Cộng
                      </td>
                      <td className="text-black font-weight-bold" style={{ fontWeight: 'bold' }}>
                        {convertToCurrency(tongTienKhiGiam)}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-black font-weight-bold" colSpan="3">
                        Thanh Toán
                      </td>
                      <td className="text-black">
                        <div className="custom-control custom-checkbox custom-control-inline" style={{ display: 'flex' }}>
                          <input
                            style={{ marginTop: '15px' }}
                            type="radio"
                            className="custom-control-input"
                            color="secondary"
                            id="vnpayradio"
                            name="paymentMethod"
                            value="vnpay"
                            onChange={() => {
                              const totalGiam = dataHDKM.reduce((total, d) => total + d.tienGiam, 0);
                              setValuesUpdateHD({
                                ...valuesUpdateHD,
                                ...valuesUpdateHD.hinhThucThanhToan,
                                trangThai: 1,
                                hinhThucThanhToan: {
                                  ten: 'VNPay',
                                  tien: totalAmount - totalGiam,
                                  trangThai: 1
                                }
                              });
                            }}
                          />

                          <label className="custom-control-label" htmlFor="vnpayradio" style={{ marginLeft: '10px', marginTop: '15px' }}>
                            Thanh toán qua VNPay
                          </label>
                          <img
                            width={'50px'}
                            height={'50px'}
                            src="https://on.net.vn/web/image/3876184-2b57e083/202166185_2021396718013233_8499389898242103910_n.png"
                            alt="VNPay Logo"
                            className="payment-logo"
                          />
                        </div>
                        <div className="custom-control custom-checkbox custom-control-inline" style={{ display: 'flex' }}>
                          <input
                            style={{ marginTop: '12px' }}
                            type="radio"
                            className="custom-control-input"
                            color="secondary"
                            id="codradio"
                            name="paymentMethod"
                            value="Tiền mặt"
                            // checked={true}
                            onChange={() => {
                              const totalGiam = dataHDKM.reduce((total, d) => total + d.tienGiam, 0);
                              setValuesUpdateHD({
                                ...valuesUpdateHD,
                                ...valuesUpdateHD.hinhThucThanhToan,
                                trangThai: 0,
                                hinhThucThanhToan: {
                                  ten: 'Tiền mặt',
                                  tien: totalAmount - totalGiam,
                                  trangThai: 0
                                }
                              });
                            }}
                          />
                          <label className="custom-control-label" htmlFor="codradio" style={{ marginLeft: '10px', marginTop: '12px' }}>
                            Thanh toán COD
                          </label>

                          <img
                            width={'36px'}
                            height={'36px'}
                            style={{ marginTop: '8px', marginLeft: '56px' }}
                            src="https://symbols.vn/wp-content/uploads/2021/11/Bieu-tuong-tien-mat-doc-dao.png"
                            alt="COD Logo"
                            className="payment-logo"
                          />
                        </div>
                      </td>
                    </tr>
                  </table>
                  <p style={{ color: 'red', fontSize: 16, fontWeight: 'bold' }}>
                    Lưu ý: Tổng tiền ở bên trên chưa tính tiền ship, khách hàng sẽ trả tiền ship cho shipper khi đã nhận được hàng
                  </p>
                  <FormControlLabel
                    // required
                    control={<Checkbox />}
                    onChange={() => setChecked(!checked)}
                    label={
                      <p style={{ marginBottom: 0 }}>
                        Bạn hãy chấp nhận <button onClick={() => setIsShowDK(true)}>điều khoản</button> của chúng tôi để mua hàng
                      </p>
                    }
                  />
                  <div className="text-center">
                    {valuesUpdateHD.hinhThucThanhToan.ten === 'Tiền mặt' || valuesUpdateHD.hinhThucThanhToan.ten === '' ? (
                      <button className="btn btn-primary btn-lg btn-apply" type="button" onClick={() => handleThanhToan()}>
                        Thanh toán
                      </button>
                    ) : (
                      <button className="btn btn-primary btn-lg btn-apply" type="button" onClick={() => handleThanhToanWithNVP()}>
                        Thanh toán
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ModalChinhSach show={isShowDK} handleClose={() => setIsShowDK(false)} />
      <ChangeDC
        show={isShow}
        handleClose={() => setIsShow(false)}
        dataLogin={dataLogin}
        dataDC={dataDC}
        setValuesDC={setValuesDC}
        valuesDC={valuesDC}
        handleAddDC={handleAddDC}
        thanhPho={thanhPho}
        setThanhPho={setThanhPho}
        quan={quan}
        phuong={phuong}
        getQuanHuyen={getQuanHuyen}
        setValuesId={setValuesId}
        setIsShowUpdate={setIsShowUpdate}
        isShowUpdate={isShowUpdate}
        setIdDC={setIdDC}
        setSelectedAddressId={setSelectedAddressId}
        selectedAddressId={selectedAddressId}
        setIsShowAdd={setIsShowAdd}
      ></ChangeDC>
      <UpdateDC
        show={isShowAdd}
        handleClose={() => {
          setIsShowAdd(false);
          setIsShow(true);
        }}
        handleWardChange={handleWardChange}
        handleDistrictChange={handleDistrictChange}
        handleProvinceChange={handleProvinceChange}
        thanhPho={thanhPho}
        quan={quan}
        phuong={phuong}
        dataDetailDC={valuesAddDC}
        setDataDetailDC={setValuesAddDC}
        handleUpdateDC={handleUpdateDC}
        label={'Thêm'}
      ></UpdateDC>
      <UpdateDC
        show={isShowUpdate}
        handleClose={() => {
          setIsShowUpdate(false);
          setIsShow(true);
        }}
        handleWardChange={handleWardChange}
        handleDistrictChange={handleDistrictChange}
        handleProvinceChange={handleProvinceChange}
        thanhPho={thanhPho}
        quan={quan}
        phuong={phuong}
        selectedWard={selectedWard}
        dataDetailDC={dataDetailDC}
        setDataDetailDC={setDataDetailDC}
        handleUpdateDC={handleUpdateDC}
        label={'Cập nhật'}
      ></UpdateDC>
    </div>
  );
}

export default CheckoutForm;