import React, { useState } from 'react';
import { toast } from 'react-toastify';
import InputColor from 'react-input-color';
import MainCard from 'ui-component/cards/MainCard';

import { postMS } from 'services/ServiceMauSac';

import { useNavigate } from 'react-router-dom';

// @mui material components
import Card from '@mui/material/Card';

//  React examples
import { Button } from 'react-bootstrap';

function AddMauSac() {
  const [color, setColor] = useState({ r: 94, g: 114, b: 228, a: 1 }); // Giá trị màu mặc định

  const handleColorChange = (newColor) => {
    setColor(newColor); // Cập nhật giá trị màu từ bảng màu
    // setMa(newColor.hex); // Cập nhật giá trị 'ma' từ bảng màu
    setValues({ ...values, ten: newColor.hex });
  };

  const navigate = useNavigate();
  const [values, setValues] = useState({
    ten: '#ffffffff',
    ma: '',
    trangThai: 0
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!values.ma.trim()) {
      toast.error('Vui lòng nhập tên màu sắc.');
      return;
    }

    if (values.ma.length > 50) {
      toast.error('Tên màu sắc không được vượt quá 50 ký tự.');
      return;
    }

    // Kiểm tra nếu tên chất liệu chứa số hoặc ký tự đặc biệt
    if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(values.ma)) {
      toast.error('Tên màu sắc chỉ được chứa ký tự chữ cái và khoảng trắng.');
      return;
    }
    await post(values);
  };

  const post = async (value) => {
    const res = await postMS(value);
    if (res.data === 'Tên màu đã tồn tại') {
      toast.error(res.data);
    } else if (res.data === 'Mã màu đã tồn tại') {
      toast.error(res.data);
    } else {
      toast.success('Thêm thành công !');
      navigate('/san-pham/mau-sac');
    }
  };

  return (
    <div>
      <MainCard>
        <Card>
          <div className="body flex-grow-1 px-3">
            <form className="row g-3" onSubmit={handleSubmit}>
              <div className="col-md-6">
                <span style={{ fontWeight: 'bold' }} className="form-label">
                  Tên màu
                </span>
                <input
                  type="text"
                  className="form-control"
                  value={values.ma}
                  onChange={(e) => setValues({ ...values, ma: e.target.value })}
                />
              </div>
              <div className="col-md-6">
                <span style={{ fontWeight: 'bold' }} className="form-label">
                  Mã Màu:{' '}
                </span>
                <br></br>
                <InputColor initialValue={values.ten} onChange={handleColorChange} placement="right" />
                <div
                  style={{
                    width: 300,
                    height: 300,
                    marginTop: 20,
                    backgroundColor: color.rgba,
                    border: '2px solid black'
                  }}
                />
              </div>
              <div className="col-6">
                <span style={{ fontWeight: 'bold' }} className="form-label me-3">
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
                    checked={true}
                    onChange={() => setValues({ ...values, trangThai: 0 })}
                  />
                  <span className="form-check-label">Kích hoạt</span>
                </div>
                <br></br>
                <br></br>
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

export default AddMauSac;