
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainCard from 'ui-component/cards/MainCard';
import { Card, Button, Stack, Avatar } from '@mui/material';

import { toast } from 'react-toastify';
import { addKH } from 'services/KhachHangService';
import { getP, getQH, getTP } from 'services/ApiGHNService';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useRef } from 'react';

function AddKhachHang() {
  const navigate = useNavigate();

  const [anh, setAnh] = useState(null);

  const fileInputRef = useRef(null);

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
  const [selectedImageURL, setSelectedImageURL] = useState('');

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

  const [values, setValues] = useState({
    tinhThanh: '',
    quanHuyen: '',
    phuongXa: '',
    diaChi: '',
    khachHang: {
      maKhachHang: '',
      tenKhachHang: '',
      sdt: '',
      email: '',
      ngaySinh: '',
      gioiTinh: '',
      trangThai: 1
    }
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!values.khachHang.tenKhachHang) {
      toast.error('Vui lòng nhập tên khách hàng');
      return;
    }

    if (!values.khachHang.sdt) {
      toast.error('Vui lòng nhập số điện thoại');
      return;
    }
    if (!values.khachHang.email) {
      toast.error('Vui lòng nhập email khách hàng');
      return;
    }

    if (!values.khachHang.ngaySinh) {
      toast.error('Vui lòng nhập ngày Sinh khách hàng');
      return;
    }
    const ngaySinhDate = new Date(values.khachHang.ngaySinh);
    const currentDate = new Date();

    if (ngaySinhDate >= currentDate) {
      toast.error('Ngày sinh phải nhỏ hơn ngày hiện tại');
      return;
    }

    setValues((prevValues) => ({
      ...prevValues,
      tinhThanh: selectedProvinceName,
      quanHuyen: selectedDistrictName,
      phuongXa: selectedWardName
    }));
    const formData = new FormData();
    formData.append('tenKhachHang', values.khachHang.tenKhachHang);
    formData.append('sdt', values.khachHang.sdt);
    formData.append('email', values.khachHang.email);
    formData.append('ngaySinh', values.khachHang.ngaySinh);
    formData.append('gioiTinh', values.khachHang.gioiTinh);
    formData.append('trangThai', values.khachHang.trangThai);
    if (anh) {
      formData.append('anh', anh);
    }
    formData.append('diaChi', values.diaChi);
    formData.append('tinhThanh', selectedProvinceName);
    formData.append('quanHuyen', selectedDistrictName);
    formData.append('phuongXa', selectedWardName);
    try {
      const res = await addKH(formData);
      if (res.data === 'Email này đã tồn tại') {
        toast.error(res.data);
      } else {
        toast.success('Thêm thành công');
        navigate('/khach-hang');
      }
    } catch (error) {
      console.error(error);
      toast.error('Đã xảy ra lỗi khi thêm khách hàng');
    }
  };

  return (
    <MainCard>
      <Card>
        <div className="row g-3">
          <h1>Thêm Khách Hàng</h1>
        </div>
        <div className="div" style={{ display: 'flex', paddingTop: 30 }}>
          <div className="col-md-4" style={{ width: 350, height: 350, marginRight: 20, paddingTop: 20 }}>
            <Stack direction="column" spacing={2} alignItems="center">
              <Avatar
                alt="Ảnh đại diện"
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
            <form className="row g-3">
              <div className="col-md-6">
                <label htmlFor="a" className="form-label">
                  Tên Khách Hàng
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={values.khachHang.tenKhachHang}
                  onChange={(e) =>
                    setValues({
                      ...values,
                      khachHang: {
                        ...values.khachHang,
                        tenKhachHang: e.target.value
                      }
                    })
                  }
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="a" className="form-label">
                  Số Điện Thoại
                </label>
                <input
                  type="number"
                  className="form-control"
                  value={values.khachHang.sdt}
                  onChange={(e) =>
                    setValues({
                      ...values,
                      khachHang: {
                        ...values.khachHang,
                        sdt: e.target.value
                      }
                    })
                  }
                />
              </div>
              <div className="col-6">
                <label htmlFor="a" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  value={values.khachHang.email}
                  onChange={(e) =>
                    setValues({
                      ...values,
                      khachHang: {
                        ...values.khachHang,
                        email: e.target.value
                      }
                    })
                  }
                />
              </div>
              <div className="col-6">
                <label htmlFor="a" className="form-label">
                  Ngày Sinh
                </label>
                <input
                  type="date"
                  className="form-control"
                  value={values.khachHang.ngaySinh}
                  onChange={(e) =>
                    setValues({
                      ...values,
                      khachHang: {
                        ...values.khachHang,
                        ngaySinh: e.target.value
                      }
                    })
                  }
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="a" className="form-label" style={{ paddingRight: 5 }}>
                  Giới tính:{' '}
                </label>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="inlineRadioOptions2"
                    id="inlineRadio3"
                    value={true}
                    checked={values.khachHang.gioiTinh === true}
                    onChange={() =>
                      setValues({
                        ...values,
                        khachHang: {
                          ...values.khachHang,
                          gioiTinh: true
                        }
                      })
                    }
                  />
                  <label htmlFor="a" className="form-check-label">
                    Nam
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="inlineRadioOptions2"
                    id="inlineRadio4"
                    value={false}
                    checked={values.khachHang.gioiTinh === false}
                    onChange={() =>
                      setValues({
                        ...values,
                        khachHang: {
                          ...values.khachHang,
                          gioiTinh: false
                        }
                      })
                    }
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
                    checked={true}
                    onChange={() =>
                      setValues({
                        ...values,
                        khachHang: {
                          ...values.khachHang,
                          trangThai: 1
                        }
                      })
                    }
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
                    onChange={() =>
                      setValues({
                        ...values,
                        khachHang: {
                          ...values.khachHang,
                          trangThai: 0
                        }
                      })
                    }
                  />
                  <label htmlFor="a" className="form-check-label">
                    Không hoạt động
                  </label>
                </div>
              </div>

              <div className="col-md-6">
                <div className="col-md-12" style={{ paddingBottom: 10 }}>
                  <label htmlFor="address" className="text-black" style={{ paddingBottom: 5 }}>
                    Địa Chỉ
                  </label>
                  <input
                    type="text"
                    className="form-control fct"
                    id="address"
                    value={values.diaChi}
                    onChange={(e) =>
                      setValues({
                        ...values,
                        diaChi: e.target.value
                      })
                    }
                    name="address"
                    placeholder="Địa chỉ..."
                  />
                </div>
                <div className="col-md-12" style={{ paddingBottom: 10 }}>
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

                <div className="col-md-12" style={{ paddingBottom: 10 }}>
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

                <div className="col-md-12" style={{ paddingBottom: 10 }}>
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
              </div>

              <div className="col-12">
                <button type="submit" onClick={handleSubmit} className="btn btn-primary">
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      </Card>
    </MainCard>
  );
}

export default AddKhachHang;
