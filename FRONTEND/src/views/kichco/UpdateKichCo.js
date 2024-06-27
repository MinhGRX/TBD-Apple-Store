import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import MainCard from 'ui-component/cards/MainCard';
import { putUpdateKC, detailKC, fetchAllCTSP, checkTrung1 } from 'services/KichCoService';
import Modal from 'react-bootstrap/Modal';
// @mui material components
import Card from '@mui/material/Card';

import { Button } from 'react-bootstrap';

function UpdateKC() {
  const navigate = useNavigate();
  // const [KichCos, setCTSP] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [values, setValues] = useState({
    ma: '',
    ten: '',
    trangThai: 0
  });

  const { id } = useParams();

  useEffect(() => {
    detail(id);
  }, [id]);

  const detail = async (id) => {
    const res = await detailKC(id);
    if (res) {
      setValues(res.data);
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

  const put = async (id, value) => {
    const res = await putUpdateKC(id, value);
    if (res) {
      toast.success('Cập nhật thành công !');
      navigate('/san-pham/kich-co');
    }
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
    put(id, values);
    handleCloseModal();
  };

  useEffect(() => {
    getAllCTSP;
  }, []);

  const getAllCTSP = async () => {
    let res = await fetchAllCTSP();
    if (res) {
      setCTSP(res.data);
    }
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
                <br></br>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="inlineRadioOptions"
                    id="inlineRadio1"
                    value="0"
                    checked={values.trangThai === 0}
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
                    checked={values.trangThai === 1}
                    onChange={() => setValues({ ...values, trangThai: 1 })}
                  />
                  <span className="form-check-label">Ngừng kích hoạt</span>
                </div>
              </div>
              <div className="col-12">
                <Button type="submit" className="btn btn-bg-info">
                  Update
                </Button>
              </div>
            </form>
          </div>
        </Card>
      </MainCard>
      <Modal style={{ paddingTop: 100 }} show={isModalOpen} onHide={handleCloseModal}>
        <Modal.Header>
          <Modal.Title>Xác nhận cập nhật</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Bạn có chắc chắn muốn cập nhật?</p>
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

export default UpdateKC;