
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-useless-catch */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import { Card, Button, Stack, Avatar } from '@mui/material';
import { detailKH, getAllDcKh, deleteDC, updateDC, addDC, detailDC } from 'services/KhachHangService';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Modal } from 'react-bootstrap';
import { getP, getQH, getTP } from 'services/ApiGHNService';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useRef } from 'react';

import { useLocation } from 'react-router-dom';

function UpdateKhachHang() {
  //Detail ảnh
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const imageURL = searchParams.get('imageURL');

  // Lấy danh sách tỉnh thành từ API
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);

  //Lấy tên
  const [selectedProvinceName, setSelectedProvinceName] = useState('');
  const [selectedDistrictName, setSelectedDistrictName] = useState('');
  const [selectedWardName, setSelectedWardName] = useState('');

  const [valuesId, setValuesId] = useState({
    province_id: ''
  });
  const [valuesIdWard, setValuesIdWard] = useState({
    district_id: ''
  });

  const [anh, setAnh] = useState(null);

  const fileInputRef = useRef(null);

  const getThanhPho = async () => {
    try {
      const res = await getTP();
      if (res) {
        setProvinces(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getQuanHuyen = async (value) => {
    try {
      const res = await getQH(value);
      if (res) {
        setDistricts(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getPhuong = async (value) => {
    try {
      const res = await getP(value);
      if (res) {
        setWards(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getThanhPho();
  }, []);

  const handleProvinceChange = async (event) => {
    const provinceId = {
      province_id: event.target.value
    };
    setSelectedProvince(event.target.value);
    setSelectedProvinceName(event.target.options[event.target.selectedIndex].text);
    setSelectedDistrict(null);
    setSelectedWard(null);
    setSelectedDistrictName('');
    setSelectedWardName('');
    getQuanHuyen(provinceId);
  };

  const handleDistrictChange = async (event) => {
    const districtId = {
      district_id: event.target.value
    };
    setSelectedDistrict(event.target.value);
    setSelectedDistrictName(event.target.options[event.target.selectedIndex].text);
    setSelectedWard(null);
    setSelectedWardName('');
    getPhuong(districtId);
  };

  const handleWardChange = (event) => {
    setSelectedWard(event.target.value);
    setSelectedWardName(event.target.options[event.target.selectedIndex].text);
  };

  const [valueDC, setValueDC] = useState({
    tinhThanh: '',
    quanHuyen: '',
    phuongXa: '',
    diaChi: '',
    trangThai: 1
  });

  // console.log(valueDC);

  const [idDC, setIdDc] = useState();

  const detailDCKH = async (idDC) => {
    const res = await detailDC(idDC);
    if (res) {
      setValueDC(res.data);
    }
  };

  useEffect(() => {
    if (idDC) {
      detailDCKH(idDC);
    }
  }, [idDC]);

  const updateDCKH = async (idDC, value) => {
    const res = await updateDC(idDC, value);
    if (res) {
      toast.success('Cập nhật thành công !');
      setShow1(false);
      hienThiDiaChi(id);
    }
  };

  const handleSubmitDC = async (event) => {
    event.preventDefault();
    const updatedValueDC = {
      tinhThanh: selectedProvinceName,
      quanHuyen: selectedDistrictName,
      phuongXa: selectedWardName,
      diaChi: valueDC.diaChi,
      trangThai: valueDC.trangThai // Đặt trạng thái là 1
    };
    try {
      const res = await updateDCKH(idDC, updatedValueDC);
      if (res) {
        const updatedAddresses = dc.map((address) => ({
          ...address,
          trangThai: address.id === idDC ? 1 : 0
        }));
        await Promise.all(updatedAddresses.map((address) => updateDCKH(address.id, { ...address })));
        toast.success('Cập nhật thành công!');
      }
    } catch (error) {
      console.error(error);
      toast.error('Đã xảy ra lỗi khi cập nhật khách hàng');
    }
  };

  //Địa chỉ
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => setShow(true);

  const [show1, setShow1] = useState(false);

  const handleClose1 = () => {
    setShow1(false);
  };

  const handleShow1 = (id) => {
    const dcItem = dc.find((item) => item.id === id);

    // Lấy các giá trị detail của địa chỉ
    const selectedProvince = dcItem.tinhThanh;
    const selectedDistrict = dcItem.quanHuyen;
    const selectedWard = dcItem.phuongXa;

    // Đặt giá trị cho các dropdown
    setSelectedProvince(selectedProvince);
    setSelectedDistrict(selectedDistrict);
    setSelectedWard(selectedWard);

    // Log ra các giá trị cần kiểm tra
    console.log('Tỉnh:', dcItem.tinhThanh);
    console.log('Huyện:', dcItem.quanHuyen);
    console.log('Phường:', dcItem.phuongXa);
    setIdDc(id);
    setShow1(true);
  };

  useEffect(() => {
    if (idDC) {
      provinces.forEach((province) => {
        if (province.NameExtension[1] === valueDC.tinhThanh) {
          setValuesId({
            province_id: province.ProvinceID
          });
          // console.log(province.ProvinceID);
        }
        setSelectedProvince(province.ProvinceID);
      });
    }
  }, [idDC, provinces, valueDC]);

  // console.log(valuesId.province_id);

  useEffect(() => {
    if (valuesId.province_id) {
      getQuanHuyen(valuesId);
    }
    setSelectedDistrict(valuesId);
  }, [valuesId.province_id]);

  useEffect(() => {
    districts.forEach((district) => {
      if (district.DistrictName === valueDC.quanHuyen) {
        setValuesIdWard({
          district_id: district.DistrictID
        });
      }
    });
  }, [districts, valuesId]);

  useEffect(() => {
    if (valuesIdWard.district_id) {
      getPhuong(valuesIdWard);
    }
    setSelectedWard(valuesIdWard);
  }, [valuesIdWard.district_id]);

  // Địa Chỉ
  const [dc, setDc] = useState([]);

  const hienThiDiaChi = async (id) => {
    const res = await getAllDcKh(id);
    if (res && res.data) {
      setDc(res.data);
    }
  };

  const handleDeleteDC = (id) => {
    del(id);
  };

  const del = async (idDC) => {
    const res = await deleteDC(idDC);
    if (res) {
      toast.success('Xóa thành công!');
      hienThiDiaChi(id);
    }
  };

  const navigate = useNavigate();
  const [values, setValues] = useState({
    tenKhachHang: '',
    sdt: '',
    email: '',
    ngaySinh: '',
    gioiTinh: '',
    trangThai: ''
  });

  const { id } = useParams();

  useEffect(() => {
    detail(id);
    hienThiDiaChi(id);
  }, [id]);

  const updateKHFormData = async (id, formData) => {
    try {
      const response = await axios.put(`http://localhost:8080/api/khach-hang/update/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!values.tenKhachHang) {
      toast.error('Vui lòng nhập tên khách hàng');
      return;
    }

    if (!values.sdt) {
      toast.error('Vui lòng nhập số điện thoại');
      return;
    }
    if (!values.email) {
      toast.error('Vui lòng nhập email khách hàng');
      return;
    }

    if (!values.ngaySinh) {
      toast.error('Vui lòng nhập ngày Sinh khách hàng');
      return;
    }
    const ngaySinhDate = new Date(values.ngaySinh);
    const currentDate = new Date();

    if (ngaySinhDate >= currentDate) {
      toast.error('Ngày sinh phải nhỏ hơn ngày hiện tại');
      return;
    }

    const formData = new FormData();

    formData.append('tenKhachHang', values.tenKhachHang);
    formData.append('sdt', values.sdt);
    formData.append('email', values.email);
    formData.append('ngaySinh', values.ngaySinh);
    formData.append('gioiTinh', values.gioiTinh);
    formData.append('trangThai', values.trangThai);
    formData.append('anh', anh);

    try {
      const res = await updateKHFormData(id, formData);
      if (res) {
        toast.success('Cập nhật thành công!');
        navigate('/khach-hang');
      }
    } catch (error) {
      console.error(error);
      toast.error('Đã xảy ra lỗi khi cập nhật khách hàng');
    }
  };

  const [selectedImageURL, setSelectedImageURL] = useState(imageURL || '');

  useEffect(() => {
    return () => {
      selectedImageURL && URL.revokeObjectURL(selectedImageURL);
    };
  }, [selectedImageURL]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setAnh(file);
    const imageURL = URL.createObjectURL(file);
    setSelectedImageURL(imageURL);
  };

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const formatDate = (date) => {
    const formattedDate = new Date(date);
    return formattedDate.toISOString().slice(0, 10);
  };

  const detail = async (id) => {
    const res = await detailKH(id);
    if (res) {
      const { ngaySinh, ...values } = res.data;
      setValues({
        ...values,
        ngaySinh: formatDate(ngaySinh)
      });
    }
  };

  //ADD địa chỉ

  const handleSubmitADD = async (event) => {
    // Tạo đối tượng địa chỉ mới
    event.preventDefault();
    const newAddress = {
      tinhThanh: selectedProvinceName,
      quanHuyen: selectedDistrictName,
      phuongXa: selectedWardName,
      diaChi: valueDC.diaChi,
      trangThai: valueDC.trangThai
    };
    await addDCKH(id, newAddress);
  };

  const addDCKH = async (id, value) => {
    const res = await addDC(id, value);
    if (res) {
      toast.success('Thêm thành công !');
      setShow(false);
      hienThiDiaChi(id);
    }
  };

  return (
    <MainCard>
      <Card>
        <div className="row g-3">
          <h1>Sửa Khách Hàng</h1>
        </div>
        <div className="div" style={{ display: 'flex', paddingTop: 30 }}>
          <div className="col-md-4" style={{ width: 350, height: 350, marginRight: 20, paddingTop: 20 }}>
            <Stack direction="column" spacing={2} alignItems="center">
              <Avatar
                // alt="Ảnh đại diện"
                src={selectedImageURL || anh}
                sx={{ width: 250, height: 250, cursor: 'pointer' }}
                onClick={handleAvatarClick}
              />
              <label htmlFor="upload-input">
                <input
                  id="upload-input"
                  type="file"
                  accept="image/*"
                  name="anh"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                  ref={fileInputRef}
                />
                <Button variant="contained" component="span" startIcon={<CloudUploadIcon />} style={{ display: 'none' }}>
                  Tải lên
                </Button>
              </label>
            </Stack>
          </div>

          <div className="col-md-8">
            <form className="row g-3" onSubmit={handleSubmit}>
              <div className="col-md-6">
                <label htmlFor="a" className="form-label">
                  Mã Khách Hàng
                </label>
                <input
                  type="text"
                  disabled
                  className="form-control"
                  value={values.maKhachHang}
                  onChange={(e) => setValues({ ...values, maKhachHang: e.target.value })}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="a" className="form-label">
                  Tên Khách Hàng
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={values.tenKhachHang}
                  onChange={(e) => setValues({ ...values, tenKhachHang: e.target.value })}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="a" className="form-label">
                  Số Điện Thoại
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={values.sdt}
                  onChange={(e) => setValues({ ...values, sdt: e.target.value })}
                />
              </div>
              <div className="col-6">
                <label htmlFor="a" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  value={values.email}
                  onChange={(e) => setValues({ ...values, email: e.target.value })}
                />
              </div>
              <div className="col-6">
                <label htmlFor="a" className="form-label">
                  Ngày Sinh
                </label>
                <input
                  type="date"
                  className="form-control"
                  value={values.ngaySinh}
                  onChange={(e) => setValues({ ...values, ngaySinh: e.target.value })}
                />
              </div>
              <div className="col-6">
                <label htmlFor="a" className="form-label me-3">
                  Giới Tính:
                </label>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="gender"
                    id="male"
                    value={true}
                    checked={values.gioiTinh === true}
                    onChange={() => setValues({ ...values, gioiTinh: true })}
                  />
                  <label htmlFor="a" className="form-check-label">
                    Nam
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="genderOptions"
                    id="female"
                    value={false}
                    checked={values.gioiTinh === false}
                    onChange={() => setValues({ ...values, gioiTinh: false })}
                  />
                  <label htmlFor="a" className="form-check-label">
                    Nữ
                  </label>
                </div>
              </div>

              <div className="col-md-6">
                <label htmlFor="a" className="form-label me-3">
                  Trạng thái:{' '}
                </label>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="inlineRadioOptions"
                    id="inlineRadio1"
                    value="1"
                    checked={values.trangThai === 1} // Kiểm tra nếu trạng thái là "1" thì được chọn
                    onChange={() => setValues({ ...values, trangThai: 1 })}
                  />
                  <label htmlFor="a" className="form-check-label">
                    Hoạt động
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="inlineRadioOptions"
                    id="inlineRadio2"
                    value="0"
                    checked={values.trangThai === 0} // Kiểm tra nếu trạng thái là "0" thì được chọn
                    onChange={() => setValues({ ...values, trangThai: 0 })}
                  />
                  <label htmlFor="a" className="form-check-label">
                    Không hoạt động
                  </label>
                </div>
              </div>

              <div className="col-md-12">
                <div>
                  <label htmlFor="a" className="form-label">
                    Địa Chỉ
                  </label>
                  <span className="fa-solid fa-plus mx-3" onClick={handleShow}></span>
                  <div>
                    <ul>
                      <li style={{ width: 550 }}>
                        {dc.map((dc, index) => (
                          <div
                            key={dc.id}
                            style={{
                              border: '2px solid skyblue',
                              borderRadius: 10,
                              height: 70,
                              paddingTop: 8,
                              marginTop: index > 0 ? 20 : 0 // Thêm khoảng cách 20px cho phần tử từ thứ 2 trở đi
                            }}
                          >
                            <h7 style={{ paddingLeft: 15, paddingRight: 10 }}>
                              <label style={{ fontSize: 15, fontStyle: 'italic' }} htmlFor="dc">
                                {' '}
                                {dc.trangThai === 1 ? <p style={{ color: 'red', marginBottom: 0.01 }}>Mặc định</p> : ''}
                                {dc.diaChi}, {dc.phuongXa}, {dc.quanHuyen}, {dc.tinhThanh}
                              </label>
                            </h7>
                            <span
                              className="mx-2"
                              onClick={() => {
                                handleShow1(dc.id);
                              }}
                            >
                              <i style={{ color: 'aqua' }} className="fa-regular fa-pen-to-square fa-lg"></i>
                            </span>
                            <span className="mx-2" onClick={() => handleDeleteDC(dc.id)}>
                              <i style={{ color: '#ff1744' }} className="fa-solid fa-trash"></i>
                            </span>
                          </div>
                        ))}
                      </li>
                    </ul>
                  </div>
                  <Modal style={{ marginTop: 120, marginLeft: 150 }} show={show1} onHide={handleClose1}>
                    <Modal.Header>
                      <Modal.Title style={{ marginLeft: 175 }}>Sửa Địa Chỉ</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{ width: 500, maxHeight: 390, overflow: 'auto' }}>
                      <div className="div">
                        <div className="body flex-grow-1 px-3">
                          <form className="row g-3">
                            <div className="col-md-12">
                              <label htmlFor="address" className="text-black" style={{ paddingBottom: 5 }}>
                                Địa Chỉ
                              </label>
                              <input
                                type="text"
                                className="form-control fct"
                                id="address"
                                value={valueDC.diaChi}
                                onChange={(e) =>
                                  setValueDC({
                                    ...valueDC,
                                    diaChi: e.target.value
                                  })
                                }
                                name="address"
                                placeholder="Địa chỉ..."
                              />
                            </div>
                            <div className="col-md-12">
                              <label htmlFor="ward" className="form-label">
                                Tỉnh/Thành Phố
                              </label>
                              <select id="province" className="form-select fsl" onChange={handleProvinceChange}>
                                <option value="">Chọn tỉnh thành</option>
                                {provinces.map((province) => (
                                  <option
                                    key={province.ProvinceID}
                                    selected={province.NameExtension[1] === valueDC.tinhThanh}
                                    value={province.ProvinceID}
                                  >
                                    {province.NameExtension[1]}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div className="col-md-12">
                              <label htmlFor="ward" className="form-label">
                                Quận Huyện
                              </label>
                              <select id="district" className="form-select fsl" onChange={(e) => handleDistrictChange(e)}>
                                <option value="">Chọn quận huyện</option>
                                {districts.map((district) => (
                                  <option
                                    key={district.DistrictID}
                                    selected={district.DistrictName === valueDC.quanHuyen}
                                    value={district.DistrictID}
                                  >
                                    {district.DistrictName}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div className="col-md-12">
                              <label htmlFor="ward" className="form-label">
                                Phường xã
                              </label>
                              <select id="ward" className="form-select fsl" onChange={handleWardChange}>
                                <option value="">Chọn phường xã</option>
                                {wards.map((ward) => (
                                  <option key={ward.WardCode} selected={ward.WardName === valueDC.phuongXa} value={ward.WardCode}>
                                    {ward.WardName}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div className="col-md-12">
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  id="flexCheckDefault"
                                  checked={valueDC.trangThai === 1} // Kiểm tra nếu trạng thái là "1" thì được chọn
                                  onChange={() => setValueDC({ ...valueDC, trangThai: 1 })}
                                />
                                <label className="form-check-label" htmlFor="flexCheckDefault">
                                  Đặt làm mặc định
                                </label>
                              </div>
                            </div>

                            <div className="col-6" style={{ display: 'flex' }}>
                              <div className="text-start">
                                <button type="submit" onClick={handleSubmitDC} className="btn btn-primary">
                                  Update
                                </button>
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                    </Modal.Body>
                  </Modal>

                  <Modal style={{ marginTop: 120, marginLeft: 150 }} show={show} onHide={handleClose}>
                    <Modal.Header>
                      <Modal.Title style={{ marginLeft: 150 }}>Thêm Mới Địa Chỉ</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{ width: 500, maxHeight: 390, overflow: 'auto' }}>
                      <div className="div">
                        <div className="body flex-grow-1 px-3">
                          <form className="row g-3">
                            <div className="col-md-12">
                              <label htmlFor="address" className="text-black" style={{ paddingBottom: 5 }}>
                                Địa Chỉ
                              </label>
                              <input
                                type="text"
                                className="form-control fct"
                                id="address"
                                value={valueDC.diaChi}
                                onChange={(e) =>
                                  setValueDC({
                                    ...valueDC,
                                    diaChi: e.target.value
                                  })
                                }
                                name="address"
                                placeholder="Địa chỉ..."
                              />
                            </div>
                            <div className="col-md-12">
                              <label htmlFor="ward" className="form-label">
                                Tỉnh/Thành Phố
                              </label>
                              <select id="province" className="form-select fsl" value={selectedProvince} onChange={handleProvinceChange}>
                                <option value="">Chọn tỉnh thành</option>
                                {provinces.map((province) => (
                                  <option key={province.ProvinceID} value={province.ProvinceID}>
                                    {province.NameExtension[1]}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div className="col-md-12">
                              <label htmlFor="ward" className="form-label">
                                Quận Huyện
                              </label>
                              <select
                                id="district"
                                className="form-select fsl"
                                value={selectedDistrict || ''}
                                onChange={(e) => handleDistrictChange(e)}
                                disabled={!selectedProvince}
                              >
                                <option value="">Chọn quận huyện</option>
                                {districts.map((district) => (
                                  <option key={district.DistrictID} value={district.DistrictID}>
                                    {district.DistrictName}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div className="col-md-12">
                              <label htmlFor="ward" className="form-label">
                                Phường xã
                              </label>
                              <select
                                id="ward"
                                className="form-select fsl"
                                value={selectedWard || ''}
                                onChange={handleWardChange}
                                disabled={!selectedDistrict || !selectedProvince}
                              >
                                <option value="">Chọn phường xã</option>
                                {wards.map((ward) => (
                                  <option key={ward.WardCode} value={ward.WardCode}>
                                    {ward.WardName}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div className="col-md-12">
                              <div className="form-check">
                                <input className="form-check-input" type="radio" id="flexCheckDefault" checked={valueDC.trangThai} />
                                <label className="form-check-label" htmlFor="flexCheckDefault">
                                  Đặt làm mặc định
                                </label>
                              </div>
                            </div>

                            <div className="text-start">
                              <button type="button" className="btn btn-primary" onClick={handleSubmitADD}>
                                Thêm
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </Modal.Body>
                  </Modal>
                </div>
              </div>

              <div className="col-md-6">
                <div className="text-start">
                  <button type="submit" className="btn btn-primary">
                    Update
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </Card>
    </MainCard>
  );
}

export default UpdateKhachHang;
