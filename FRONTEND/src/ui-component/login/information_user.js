/* eslint-disable react-hooks/exhaustive-deps */

import '../../scss/information.scss';
import Header from 'ui-component/trangchu/Header';
import Footer from 'ui-component/trangchu/Footer';
import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';

import { changePassword, detailKH, updateInfo, checkCurrentPassword } from 'services/KhachHangService';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import SlideBar from 'layout/SlideBar';
import { Button } from 'react-bootstrap';

function UserAccount() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const handleUpdate = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    navigate('/thong-tin_user');
  };
  const handleCloseModalmk = () => {
    setIsChangePasswordModalOpen(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    navigate('/thong-tin_user');
  };

  const handleCapNhat = () => {
    setIsChangePasswordModalOpen(true);
  };

  const dataLogin = JSON.parse(localStorage.getItem('dataLogin'));

  const navigate = useNavigate();

  const [values, setValues] = useState({
    tenKhachHang: '',
    email: '',
    ngaySinh: '',
    gioiTinh: null,
    matKhau: ''
  });

  const handleGenderChange = (newValue) => {
    setValues({ ...values, gioiTinh: newValue });
  };
  function formatDate(date) {
    const dateObject = new Date(date);

    const day = dateObject.getDate();
    const month = dateObject.getMonth() + 1; // Tháng bắt đầu từ 0, cần cộng thêm 1
    const year = dateObject.getFullYear();

    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
  }
  const { id } = useParams();
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

  useEffect(() => {
    detail(dataLogin.id);
  }, [dataLogin.id]);

  const put = async (id, value) => {
    const res = await updateInfo(id, value);
    if (res) {
      toast.success('Cập nhật thành công !');
      navigate('/thong-tin_user');
    }

    setIsModalOpen(false);
  };

  const handlePasswordUpdate = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('Mật khẩu mới và xác nhận mật khẩu mới không khớp');
      return;
    }

    try {
      const userId = dataLogin.id;
      const isCurrentPasswordValidResponse = await checkCurrentPassword({
        id: userId,
        currentPassword
      });

      if (isCurrentPasswordValidResponse.data === false) {
        toast.error('Mật khẩu hiện tại không hợp lệ');
        return;
      }

      if (newPassword === currentPassword) {
        toast.error('Mật khẩu mới không được trùng với mật khẩu cũ');
        return;
      }

      const passwordUpdateData = {
        currentPassword,
        newPassword,
        confirmPassword: confirmPassword
      };

      const passwordUpdateResponse = await changePassword(userId, passwordUpdateData);

      if (passwordUpdateResponse) {
        toast.success('Mật khẩu đã được cập nhật thành công');
        setIsChangePasswordModalOpen(false);
        navigate('/thong-tin_user');
        window.location.reload();
      }
    } catch (error) {
      if (error.response.status === 400) {
        toast.error('Mật khẩu hiện tại không hợp lệ');
      }
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (/\d/.test(values.tenKhachHang)) {
      toast.error('Tên không được chứa chữ số');
      return;
    }
    //Email
    if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(values.email)) {
      toast.error('Email không đúng định dạng');
      return;
    } //Email
    if (!/^(0[1-9])+([0-9]{8})\b$/.test(values.sdt)) {
      toast.error('Số điện thoại không đúng định dạng');
      return;
    }
    put(id, values);
  };

  return (
    <div>
      <Header />
      <div className="container">
        <div className="row slide-bar mt-4">
          <div className="col-3 slide-bar-children">
            <SlideBar></SlideBar>
          </div>
          <div className="col-9">
            <div className="user-details">
              <h1>THÔNG TIN TÀI KHOẢN</h1>
              <p>Họ Và Tên: {values.tenKhachHang}</p>
              <p>Email: {values.email}</p>
              <p>SDT: {values.sdt}</p>
              <p>Ngày sinh: {formatDate(values.ngaySinh)}</p>
              <p>
                Giới Tính:{' '}
                {values.gioiTinh === true ? 'Nam' : values.gioiTinh === false ? 'Nữ' : values.gioiTinh === null ? 'Không xác định' : ''}
              </p>

              <button
                className="btn btn-primary"
                onClick={() => {
                  handleUpdate();
                  navigate(`/khachhang-info/${dataLogin.id}`);
                }}
              >
                Cập Nhật
              </button>
            </div>
            <br></br>
            <br></br>
            <div className="user-details">
              <h1>THÔNG TIN ĐĂNG NHẬP</h1>
              <p>Email: {values.email}</p>

              <label htmlFor="password" className="password-label">
                Mật khẩu:
              </label>
              <div className="i">
                <input type="password" id="password" value={values.matKhau} className="password-input" required />
              </div>

              <br></br>
              <button
                className="btn btn-primary"
                onClick={() => {
                  handleCapNhat();
                  navigate(`/khachhang-doiMatKhau/${dataLogin.id}`);
                }}
              >
                Cập nhật
              </button>
              <Modal show={isChangePasswordModalOpen} onHide={handleCloseModalmk} backdrop="static" keyboard={false} size="lg">
                <Modal.Header closeButton>
                  <Modal.Title>
                    <Modal.Title>ĐỔI MẬT KHẨU</Modal.Title>
                  </Modal.Title>
                </Modal.Header>
                <form className="mx-3 mb-3">
                  <label htmlFor="name">Họ Và Tên:</label>
                  <input
                    type="password"
                    className="form-control"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Mật Khẩu Cũ"
                  />
                  <label htmlFor="name">Họ Và Tên:</label>
                  <input
                    type="password"
                    className="form-control"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Mật Khẩu Mới"
                  />
                  <label htmlFor="name">Họ Và Tên:</label>
                  <input
                    type="password"
                    className="form-control"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Xác Nhận Mật Khẩu Mới"
                  />
                </form>

                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseModalmk}>
                    Đóng
                  </Button>
                  <Button variant="primary" onClick={handlePasswordUpdate}>
                    Cập nhật
                  </Button>
                </Modal.Footer>
              </Modal>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      <Modal show={isModalOpen} onHide={handleCloseModal} backdrop="static" keyboard={false} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <Modal.Title>Chỉnh sửa thông tin tài khoản</Modal.Title>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div>
              <label htmlFor="name">Họ Và Tên:</label>
              <input
                type="text"
                id="tenKhachHang"
                className="form-control"
                value={values.tenKhachHang}
                onChange={(e) => setValues({ ...values, tenKhachHang: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="email">Email:</label>
              <input
                type="text"
                className="form-control"
                id="email"
                value={values.email}
                onChange={(e) => setValues({ ...values, email: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="name">SDT:</label>
              <input
                type="text"
                className="form-control"
                id="tenKhachHang"
                value={values.sdt}
                onChange={(e) => setValues({ ...values, sdt: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="birthdate">Ngày sinh:</label>
              <input
                type="date"
                id="ngaySinh"
                className="form-control"
                value={values.ngaySinh}
                onChange={(e) => setValues({ ...values, ngaySinh: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="gioiTinh">Giới Tính:</label>
              <div>
                <select
                  id="gioiTinh"
                  className="form-select"
                  value={values.gioiTinh === true ? 'Nam' : values.gioiTinh === false ? 'Nữ' : 'null'}
                  onChange={(e) => handleGenderChange(e.target.value === 'null' ? null : e.target.value === 'Nam')}
                >
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="null">Không xác định</option>
                </select>
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Đóng
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Cập nhật
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default UserAccount;