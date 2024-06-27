
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import MainCard from 'ui-component/cards/MainCard';
import { putUpdateCA, detailCA } from 'services/ServiceCoAo';

// @mui material components
import Card from '@mui/material/Card';

import { Button } from 'react-bootstrap';

function UpdateCA() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    ma: '',
    trangThai: 0
  });

  const { id } = useParams();

  useEffect(() => {
    detail(id);
  }, [id]);

  const detail = async (id) => {
    const res = await detailCA(id);
    if (res) {
      setValues(res.data);
    }
  };

  const put = async (id, value) => {
    const res = await putUpdateCA(id, value);
    if (res) {
      toast.success('Cập nhật thành công !');
      navigate('/san-pham/co-ao');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Kiểm tra điều kiện trước khi gọi put
    if (!values.ten.trim()) {
      toast.error('Vui lòng nhập tên cổ áo.');
      return;
    }

    if (values.ten.length > 50) {
      toast.error('Tên cổ áo không được vượt quá 50 ký tự.');
      return;
    }

    // Kiểm tra nếu tên chất liệu chứa số hoặc ký tự đặc biệt
    if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(values.ten)) {
      toast.error('Tên cổ áo chỉ được chứa ký tự chữ cái và khoảng trắng.');
      return;
    }

    try {
      await put(id, values);
      navigate('/san-pham/co-ao');
    } catch (error) {
      // Nếu có lỗi từ service, hiển thị thông báo lỗi
      toast.error('Tên cổ áo đã tồn tại');
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
                <span style={{ fontWeight: 'bold' }} className="form-label">
                  Trạng thái:{' '}
                </span>
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
    </div>
  );
}

export default UpdateCA;
