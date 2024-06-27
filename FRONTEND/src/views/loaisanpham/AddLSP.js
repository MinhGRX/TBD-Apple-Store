import { useState } from 'react';
import { toast } from 'react-toastify';

import { add } from 'services/LoaiSanPhamService';

import { useNavigate } from 'react-router-dom';
import MainCard from 'ui-component/cards/MainCard';

// @mui material components
import Card from '@mui/material/Card';

//  React examples
import { Button } from 'react-bootstrap';

function AddLSP() {
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
      const res = await add(value);
      if (res) {
        toast.success('Thêm thành công !');
        navigate('/san-pham/loai-san-pham');
      }
    } catch (error) {
      toast.error('Loại sản phẩm này đã tồn tại');
    }
  };

  return (
    <div>
      <MainCard>
        <Card>
          <div className="body flex-grow-1 px-3">
            <form className="row g-3" onSubmit={handleSubmit}>
              <div className="col-md-6">
                <span className="form-label">Tên Loại Sản Phẩm</span>
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
                <Button type="submit" className="btn btn-bg-info">
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

export default AddLSP;