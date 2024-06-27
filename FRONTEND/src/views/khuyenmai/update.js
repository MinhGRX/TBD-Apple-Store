import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
// @mui material components
import Card from '@mui/material/Card';
import MainCard from 'ui-component/cards/MainCard';
// React components

//  React examples
import { Button } from 'react-bootstrap';
import { putKM } from 'services/ServiceKhuyenMai';
import { detailKM } from 'services/ServiceKhuyenMai';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

function UpdateKhuyenMai() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    ma: '',
    ten: '',
    mucGiam: '',
    tien: '',
    thoiGianBatDau: '',
    thoiGianKetThuc: '',
    moTa: '',
    trangThai: 0,
    loaiGiam: ''
  });
  // const [error, setError] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    detail(id);
  }, [id]);

  const detail = async (id) => {
    const res = await detailKM(id);
    if (res) {
      const { thoiGianBatDau, thoiGianKetThuc } = res.data;

      // Chuyển đổi ngày tháng thành chuỗi ngày tháng hợp lệ
      const ngayBatDau = new Date(thoiGianBatDau).toISOString().split('T')[0];
      const gioBatDau = new Date(thoiGianBatDau).toISOString().split('T')[1].substring(0, 5);
      const ngayKetThuc = new Date(thoiGianKetThuc).toISOString().split('T')[0];
      const gioKetThuc = new Date(thoiGianKetThuc).toISOString().split('T')[1].substring(0, 5);

      setValues({
        ...res.data,
        thoiGianBatDau: ngayBatDau + 'T' + gioBatDau,
        thoiGianKetThuc: ngayKetThuc + 'T' + gioKetThuc
      });
    }
  };

  // const handleLoaiGiamChange = (event) => {
  //   const loaiGiam = event.target.value;
  //   setValues({ ...values, loaiGiam: loaiGiam });
  //   setError(false); // Reset lỗi khi loại giảm được chọn
  // };

  const put = async (id, value) => {
    const res = await putKM(id, value);
    if (res.data === 'Mã Khuyến Mãi Đã Tồn Tại !') {
      toast.error(res.data);
    } else {
      toast.success('Update thành công !');
      navigate('/voucher');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (values.ma === '') {
      toast.error('Không được để trống mã !');
      return;
    }
    if (values.ten === '') {
      toast.error('Không được để trống tên !');
      return;
    }
    if (values.moTa === '') {
      toast.error('Không được để trống mô tả !');
      return;
    }
    if (values.tien === '') {
      toast.error('Không được để trống tiền giảm tối thiểu !');
      return;
    }
    if (values.thoiGianBatDau === '') {
      toast.error('Không được để trống thời gian bắt đầu!');
      return;
    }
    if (values.thoiGianKetThuc === '') {
      toast.error('Không được để trống thời gian kết thúc!');
      return;
    }

    if (values.ma === '') {
      toast.error('Không được để trống mã !');
      return;
    }

    const startDate = new Date(values.thoiGianBatDau);
    const endDate = new Date(values.thoiGianKetThuc);
    if (endDate <= startDate) {
      toast.error('Ngày kết thúc phải lớn hơn ngày bắt đầu!');
      return;
    }
    if (values.loaiGiam === '') {
      toast.error('Vui lòng chọn loại giảm');
      return;
    }

    if (values.tien < 10000) {
      toast.error('Vui lòng nhập tiền tối thiểu trên 10k !');
      return;
    }

    if (!values.loaiGiam && (values.mucGiam < 0 || values.mucGiam > 85)) {
      toast.error('Chỉ được giảm tối đa 85%, vui lòng nhập lại');
      return;
    }

    if (!values.loaiGiam === false && values.mucGiam > (values.tien * 10) / 100) {
      toast.error('Mức giảm không được lớn hơn quá 10% so với mức tiền tối thiểu, vui lòng nhập lại');
      return;
    }

    if (!values.loaiGiam === false && (values.mucGiam < 0 || values.mucGiam > 5000000)) {
      toast.error('Chỉ được giảm tối đa 5.000.000 vnd, vui lòng nhập lại');
      return;
    }

    put(id, values); // Gọi hàm post nếu dữ liệu hợp lệ
  };

  console.log(values.loaiGiam);

  return (
    <div>
      <MainCard>
        <Card>
          <center>
            <h4>Update Khuyến Mãi</h4>
          </center>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-6">
                <label htmlFor="a" className="form-label">
                  Mã:
                </label>
                <input
                  className="form-control"
                  type="text"
                  value={values.ma}
                  onChange={(event) => setValues({ ...values, ma: event.target.value })}
                  style={{ fontWeight: 'bold' }}
                />
              </div>

              <div className="col-6">
                <label htmlFor="a" className="form-label">
                  Tên:
                </label>
                <input
                  className="form-control"
                  type="text"
                  value={values.ten}
                  onChange={(event) => setValues({ ...values, ten: event.target.value })}
                />
              </div>

              <div className="col-md-6" style={{ paddingTop: 10 }}>
                <label htmlFor="a" className="form-label" style={{ display: 'flex' }}>
                  Mức giảm:
                </label>
                <InputGroup className="mb-3">
                  <Button
                    variant="outline-secondary"
                    className={values.loaiGiam ? 'active' : ''}
                    onClick={() => setValues({ ...values, loaiGiam: true })}
                  >
                    VNĐ
                  </Button>
                  <Button
                    variant="outline-secondary"
                    className={!values.loaiGiam ? 'active' : ''}
                    onClick={() => setValues({ ...values, loaiGiam: false })}
                  >
                    %
                  </Button>
                  <Form.Control
                    aria-label="Example text with two button addons"
                    value={values.mucGiam}
                    type="number"
                    min={0}
                    onChange={(e) => {
                      if (e.target.value >= 1) {
                        setValues({ ...values, mucGiam: e.target.value });
                      } else {
                        e.preventDefault();
                      }
                    }}
                  />
                </InputGroup>
              </div>

              <div className="col-md-6" style={{ paddingTop: 10 }}>
                <label htmlFor="a" className="form-label">
                  Tối thiểu:
                </label>
                <input
                  className="form-control"
                  type="number"
                  value={values.tien}
                  min={0}
                  onChange={(e) => {
                    if (e.target.value >= 1) {
                      setValues({ ...values, tien: e.target.value });
                    } else {
                      e.preventDefault();
                    }
                  }}
                />
              </div>

              <div className="col-md-6" style={{ paddingTop: 10 }}>
                <label htmlFor="a" className="form-label">
                  Thời gian bắt đầu:
                </label>
                <input
                  className="form-control"
                  type="date"
                  value={values.thoiGianBatDau ? values.thoiGianBatDau.split('T')[0] : ''}
                  onChange={(event) => setValues({ ...values, thoiGianBatDau: event.target.value })}
                />
              </div>

              <div className="col-md-6" style={{ paddingTop: 10 }}>
                <label htmlFor="a" className="form-label">
                  Thời gian kết thúc:
                </label>
                <input
                  className="form-control"
                  type="date"
                  value={values.thoiGianKetThuc ? values.thoiGianKetThuc.split('T')[0] : ''}
                  onChange={(event) => setValues({ ...values, thoiGianKetThuc: event.target.value })}
                />
              </div>

              <div className="col-md-6" style={{ paddingTop: 10 }}>
                <label htmlFor="a" className="form-label">
                  Mô tả:
                </label>
                <textarea
                  className="form-control"
                  value={values.moTa}
                  onChange={(event) => setValues({ ...values, moTa: event.target.value })}
                />
              </div>
            </div>
            {/*<div className="col-md-6" style={{ paddingTop: 10 }}>
                  <label>
                    Trạng thái:
                    <select
                      value={trangThai}
                      onChange={(event) => setTrangThai(event.target.value)}
                    >
                      <option value="0">Hoạt động</option>
                      <option value="1">Không hoạt động</option>
                    </select>
                  </label>
                </div> */}
            <br></br>
            <div className="col-12">
              <Button type="submit" variant="primary">
                Update
              </Button>{' '}
            </div>
          </form>
        </Card>
      </MainCard>
    </div>
  );
}
export default UpdateKhuyenMai;