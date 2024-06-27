import React, { useState } from 'react';
import { toast } from 'react-toastify';
import MainCard from 'ui-component/cards/MainCard';

import { postNSX } from 'services/NhaSanXuatService';

import { useNavigate } from 'react-router-dom';

// @mui material components
import Card from '@mui/material/Card';

//  React examples
import { Button } from 'react-bootstrap';

function AddNSX() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    ten: '',
    trangThai: 0
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!values.ten.trim()) {
      toast.error('Không được để trống tên');
      return;
    }
    post(values);
  };

  const post = async (value) => {
    try {
      const res = await postNSX(value);
      if (res) {
        toast.success('Thêm thành công !');
        navigate('/san-pham/nha-san-xuat');
      }
    } catch (error) {
      toast.error('Nhà sản xuất này đã tồn tại');
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
              <div className="col-6">
                <span style={{ fontWeight: 'bold' }} className="form-label me-3">
                  Trạng thái:{' '}
                </span>
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
    </div>
  );
}

export default AddNSX;