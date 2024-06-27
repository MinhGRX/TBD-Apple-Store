// import React, { useEffect, useState } from 'react';

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainCard from 'ui-component/cards/MainCard';
import { Card } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Button, Stack, Avatar } from '@mui/material';
import { useRef } from 'react';

import { toast } from 'react-toastify';
import { addNV, vaitro } from 'services/NhanVienService';
import { postCreate } from 'services/ServiceVaiTro';
import MyVerticallyCenteredModal from './AddVaiTro';
import '../../scss/Loading.scss';

function AddNhanVien() {
  const navigate = useNavigate();
  const [vaiTroS, setVaiTroS] = useState([]);
  const [anh, setAnh] = useState(null);

  // Anh
  const [selectedImageURL, setSelectedImageURL] = useState('');
  const fileInputRef = useRef(null);

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  console.log(vaiTroS);

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

  //Vai Trò
  const [modalShow, setModalShow] = useState(false);
  const [valuesVT, setValuesVT] = useState({
    ten: '',
    trangThai: 1
  });

  const closeModal = () => {
    setModalShow(false);
    getAllVaiTro();
    setValuesVT({
      ten: '',
      trangThai: 1
    });
  };

  const handleSubmitVT = (event) => {
    event.preventDefault();
    post(valuesVT);
  };

  const post = async (value) => {
    const res = await postCreate(value);
    if (res) {
      toast.success('Thêm thành công');
      closeModal();
      getAllVaiTro(0);
    }
  };

  //

  useEffect(() => {
    return () => {
      anh && URL.revokeObjectURL(anh.preview);
    };
  }, [anh]);

  const [values, setValues] = useState({
    ma: '',
    ten: '',
    sdt: '',
    email: '',
    diaChi: '',
    ngaySinh: '',
    vaiTro: '',
    gioiTinh: true,
    trangThai: 0
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!anh) {
      toast.error('Vui lòng chọn ảnh');
      return;
    }
    if (values.ten === '') {
      toast.error('Vui lòng nhập tên');
      return;
    }
    if (values.sdt === '') {
      toast.error('Vui lòng nhập sdt');
      return;
    }
    if (values.email === '') {
      toast.error('Vui lòng nhập email');
      return;
    }
    if (values.diaChi === '') {
      toast.error('Vui lòng nhập địa chỉ');
      return;
    }
    if (values.ngaySinh === '') {
      toast.error('Vui lòng nhập ngày sinh');
      return;
    }
    if (values.vaiTro === '') {
      toast.error('Vui lòng chọn vai trò');
      return;
    }
    setLoading(true);

    const formData = new FormData();
    formData.append('ten', values.ten);
    formData.append('sdt', values.sdt);
    formData.append('email', values.email);
    formData.append('diaChi', values.diaChi);
    formData.append('ngaySinh', values.ngaySinh);
    formData.append('vaiTro', values.vaiTro);
    formData.append('gioiTinh', values.gioiTinh);
    formData.append('trangThai', values.trangThai);
    formData.append('anh', anh);

    try {
      const res = await addNV(formData);
      if (res.data === 'Email này đã tồn tại') {
        toast.error(res.data);
      } else {
        toast.success('Thêm thành công');
        navigate('/nhan-vien');
      }
    } catch (error) {
      console.error(error);
      toast.error('Đã xảy ra lỗi khi thêm khách hàng');
    } finally {
      setLoading(false); // Kết thúc trạng thái loading sau khi yêu cầu kết thúc (hoặc lỗi)
    }
  };

  useEffect(() => {
    getAllVaiTro();
  }, []);

  const getAllVaiTro = async () => {
    let res = await vaitro();
    if (res) {
      setVaiTroS(res.data);
    }
  };

  return (
    <MainCard>
      <Card>
        {loading && (
          <div className="overlay">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}
        <div className="row g-3">
          <h1>Thêm Nhân Viên</h1>
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
            <form className="row g-3" onSubmit={handleSubmit}>
              <div className="col-md-6">
                <label htmlFor="tenNhanVien" className="form-label">
                  Tên Nhân Viên
                </label>
                <input
                  id="tenNhanVien"
                  type="text"
                  className="form-control"
                  value={values.ten}
                  onChange={(e) => setValues({ ...values, ten: e.target.value })}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="sdt" className="form-label">
                  Số Điện Thoại
                </label>
                <input
                  id="sdt"
                  type="number"
                  className="form-control"
                  value={values.sdt}
                  onChange={(e) => setValues({ ...values, sdt: e.target.value })}
                />
              </div>
              <div className="col-6">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="form-control"
                  value={values.email}
                  onChange={(e) => setValues({ ...values, email: e.target.value })}
                />
              </div>
              <div className="col-6">
                <label htmlFor="diaChi" className="form-label">
                  Địa Chỉ
                </label>
                <input
                  id="diaChi"
                  type="text"
                  className="form-control"
                  value={values.diaChi}
                  onChange={(e) => setValues({ ...values, diaChi: e.target.value })}
                />
              </div>
              <div className="col-6">
                <label htmlFor="ngaySinh" className="form-label">
                  Ngày Sinh
                </label>
                <input
                  id="ngaySinh"
                  type="date"
                  className="form-control"
                  value={values.ngaySinh}
                  onChange={(e) => setValues({ ...values, ngaySinh: e.target.value })}
                />
              </div>
              <div className="col-6">
                <label className="form-label me-3" htmlFor="vaiTro">
                  Vai Trò{' '}
                  <span
                    role="button"
                    tabIndex={0}
                    className="fa-solid"
                    onClick={() => setModalShow(true)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        setModalShow(true);
                      }
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <i className="fa-solid fa-plus"></i>
                  </span>
                </label>{' '}
                <select
                  id="vaiTro"
                  className="form-select"
                  aria-label="Default select example"
                  value={values.vaiTro}
                  onChange={(e) => setValues({ ...values, vaiTro: e.target.value })}
                >
                  <option value={''}>Chọn vai trò</option>
                  <option value={'Admin'}>Admin</option>
                  <option value={'Nhân viên'}>Nhân viên</option>
                </select>
              </div>
              <div className="col-md-6">
                <label htmlFor="a" className="form-label" style={{ paddingRight: 5 }}>
                  Giới tính:{' '}
                </label>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="inlineRadioOptions1"
                    id="inlineRadio3"
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
                    name="inlineRadioOptions1"
                    id="inlineRadio4"
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
                    value={values.trangThai}
                    checked={true}
                    onChange={() => setValues({ ...values, trangThai: 0 })}
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
                    value={values.trangThai}
                    onChange={() => setValues({ ...values, trangThai: 1 })}
                  />
                  <label htmlFor="a" className="form-check-label">
                    Không hoạt động
                  </label>
                </div>
              </div>

              <div className="col-12">
                <button type="submit" className="btn btn-primary">
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* <div className="div">
          <h1>Thêm Nhân Viên</h1>
          <form className="row g-3" onSubmit={handleSubmit}>
            <div className="col-md-6">
              <label htmlFor="tenNhanVien" className="form-label">
                Tên Nhân Viên
              </label>
              <input
                id="tenNhanVien"
                type="text"
                className="form-control"
                value={values.ten}
                onChange={(e) => setValues({ ...values, ten: e.target.value })}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="sdt" className="form-label">
                Số Điện Thoại
              </label>
              <input
                id="sdt"
                type="text"
                className="form-control"
                value={values.sdt}
                onChange={(e) => setValues({ ...values, sdt: e.target.value })}
              />
            </div>
            <div className="col-6">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="form-control"
                value={values.email}
                onChange={(e) => setValues({ ...values, email: e.target.value })}
              />
            </div>
            <div className="col-6">
              <label htmlFor="diaChi" className="form-label">
                Địa Chỉ
              </label>
              <input
                id="diaChi"
                type="text"
                className="form-control"
                value={values.diaChi}
                onChange={(e) => setValues({ ...values, diaChi: e.target.value })}
              />
            </div>
            <div className="col-6">
              <label htmlFor="ngaySinh" className="form-label">
                Ngày Sinh
              </label>
              <input
                id="ngaySinh"
                type="date"
                className="form-control"
                value={values.ngaySinh}
                onChange={(e) => setValues({ ...values, ngaySinh: e.target.value })}
              />
            </div>

            <div className="col-6">
              <label className="form-label me-3" htmlFor="vaiTro">
                Vai Trò{' '}
                <span
                  role="button"
                  tabIndex={0}
                  className="fa-solid"
                  onClick={() => setModalShow(true)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setModalShow(true);
                    }
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <i className="fa-solid fa-plus"></i>
                </span>
              </label>{' '}
              <select
                id="vaiTro"
                className="form-select"
                aria-label="Default select example"
                value={values.vaiTro}
                onChange={(e) => setValues({ ...values, vaiTro: e.target.value })}
              >
                <option>Chọn vai trò</option>
                {vaiTroS
                  .filter((vaiTro) => vaiTro.trangThai === 1) // Lọc ra các vai trò có trạng thái là 1
                  .map((d, i) => (
                    <option key={i} value={d.id}>
                      {d.ten}
                    </option>
                  ))}
              </select>
            </div>



            <div className="col-12">
              <label htmlFor="a" className="form-label me-3">
                Trạng thái:{' '}
              </label>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="inlineRadioOptions"
                  id="inlineRadio1"
                  value={values.trangThai}
                  checked={true}
                  onChange={() => setValues({ ...values, trangThai: 0 })}
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
                  value={values.trangThai}
                  onChange={() => setValues({ ...values, trangThai: 1 })}
                />
                <label htmlFor="a" className="form-check-label">
                  Không hoạt động
                </label>
              </div>
            </div>
            <div className="col-12">
              <button type="submit" className="btn btn-primary">
                Add
              </button>
            </div>
          </form>
        </div> */}
        <MyVerticallyCenteredModal
          show={modalShow}
          onHide={() => setModalShow(false)}
          handleSubmit={handleSubmitVT}
          values={valuesVT}
          setValues={setValuesVT}
        />
      </Card>
    </MainCard>
  );
}

export default AddNhanVien;