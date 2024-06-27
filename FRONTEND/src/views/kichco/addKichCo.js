import { postCreate, checkTrung1 } from 'services/KichCoService';
import { toast } from 'react-toastify';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button } from '@mui/material'; // Import Button from '@mui/material'
import Modal from 'react-bootstrap/Modal';
import MainCard from 'ui-component/cards/MainCard';

function AddKichCo() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [values, setValues] = useState({
    ma: '',
    ten: '',
    trangThai: 0
  });

  const post = async (value) => {
    const res = await postCreate(value);
    if (res) {
      toast.success('Add thành công');
      navigate('/san-pham/kich-co');
    }
  };

  const check = async (ten) => {
    try {
      const response = await checkTrung1(ten);
      return response.data;
    } catch (error) {
      console.error('Lỗi kiểm tra trùng lặp tên:', error);
      return true;
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (values.ten.trim() === '') {
      toast.error('Tên không được để trống');
      return;
    }
    if (values.ten.length > 15) {
      toast.error('Tên không được quá 15 kí tự');
      return;
    }
    const isDuplicate = await check(values.ten);
    if (isDuplicate) {
      toast.error('Tên đã tồn tại');
      return;
    }
    handleOpenModal();
  };

  const handleConfirm = () => {
    // Xử lý khi form được confirm và thêm mới
    post(values);
    handleCloseModal();
  };

  return (
    <div>
      <MainCard>
        <Card>
          <div className="body flex-grow-1 px-3">
            <form className="row g-3" onSubmit={handleSubmit}>
              <div className="col-md-6">
                <span className="form-label">Tên</span>
                <input
                  type="text"
                  className="form-control"
                  value={values.ten}
                  onChange={(e) => setValues({ ...values, ten: e.target.value })}
                />
              </div>
              <div className="col-md-6">
                <span style={{ fontWeight: 'bold' }} className="form-label">
                  Trạng thái:{' '}
                </span>
                <br />
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="inlineRadioOptions"
                    id="inlineRadio1"
                    value="0"
                    checked={true}
                    onChange={() => setValues({ ...values, trangThai: 0 })}
                  />
                  <span className="form-check-label">Kích hoạt</span>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="inlineRadioOptions"
                    id="inlineRadio2"
                    value="1"
                    onChange={() => setValues({ ...values, trangThai: 1 })}
                  />
                  <span className="form-check-label">Ngừng kích hoạt</span>
                </div>
              </div>
              <div className="col-12">
                <Button type="submit" className="btn btn-primary">
                  Thêm
                </Button>
              </div>
            </form>
          </div>
        </Card>
      </MainCard>
      <Modal style={{ paddingTop: 100 }} show={isModalOpen} onHide={handleCloseModal}>
        <Modal.Header>
          <Modal.Title>Xác nhận thêm mới</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Bạn có chắc chắn muốn thêm mới?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn btn-primary" onClick={handleConfirm}>
            Xác nhận
          </Button>
          <Button className="btn btn-secondary" onClick={handleCloseModal}>
            Hủy
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AddKichCo;