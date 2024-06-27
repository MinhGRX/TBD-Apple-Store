import { postCreate } from 'services/ServiceChatLieu';
import { toast } from 'react-toastify';
import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';

function AddChatLieu() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    ten: '',
    trangThai: 0
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Kiểm tra điều kiện trước khi gọi post
    if (!values.ten.trim()) {
      toast.error('Vui lòng nhập tên chất liệu.');
      return;
    }

    if (values.ten.length > 50) {
      toast.error('Tên chất liệu không được vượt quá 50 ký tự.');
      return;
    }

    // Kiểm tra nếu tên chất liệu chứa số hoặc ký tự đặc biệt
    if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(values.ten)) {
      toast.error('Tên chất liệu chỉ được chứa ký tự chữ cái và khoảng trắng.');
      return;
    }
    try {
      await post(values);
      navigate('/san-pham/chat-lieu');
    } catch (error) {
      // Nếu có lỗi từ service, hiển thị thông báo lỗi
      toast.error('Tên chất liệu đã tồn tại');
    }
  };

  const post = async (value) => {
    const res = await postCreate(value);
    if (res) {
      toast.success('Thêm thành công');
      navigate('/san-pham/chat-lieu');
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

export default AddChatLieu;