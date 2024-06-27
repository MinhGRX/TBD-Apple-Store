/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import MainCard from 'ui-component/cards/MainCard';
import DonHang from 'views/ban-hang-tai-quay/DonHang';
import { useState } from 'react';
import { getAllHD, addHD } from 'services/ServiceDonHang';
import { useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { deleteByIdHD } from 'services/GioHangService';
import '../../scss/Loading.scss';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired
};

export default function BanHangTaiQuay() {
  const dataLoginNV = JSON.parse(localStorage.getItem('dataLoginNV'));
  const dataLoginAD = JSON.parse(localStorage.getItem('dataLoginAD'));
  const [loading, setLoading] = useState(false);

  const [value, setValue] = useState(0);
  const [values, setValues] = useState([]);
  const nvID = {
    nhanVien: { id: (dataLoginNV && dataLoginNV.id) || (dataLoginAD && dataLoginAD.id) }
  };

  useEffect(() => {
    getAll();
  }, []);

  const add = async () => {
    try {
      const res = await addHD(nvID, (dataLoginNV && dataLoginNV.ten) || (dataLoginAD && dataLoginAD.ten)); // Sử dụng await để chờ kết quả trả về
      if (res) {
        toast.success('Thêm đơn thành công');
        getAll();
      }
    } catch (error) {
      toast.error('Vui lòng đăng nhập để sử dụng chức năng này');
    }
  };

  const handleAdd = (event) => {
    event.preventDefault();
    if (values.length >= 8) {
      // Đã đạt đến giới hạn 8 hoá đơn, không cho phép thêm
      toast.error('Không thể tạo quá 8 đơn');
      return;
    }
    setLoading(true);
    add();
  };

  const getAll = async () => {
    const res = await getAllHD(); // Sử dụng await để chờ kết quả trả về
    try {
      if (res) {
        setValues(res.data);
      }
    } catch (error) {
      toast.success('Lỗi');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleBackToCart = (id) => {
    if (values.length <= 1) {
      toast.warning('Bạn không thể xoá hết đơn');
      return;
    }
    setLoading(true);
    backToCart(id);
  };

  const backToCart = async (idHD) => {
    try {
      const res = await deleteByIdHD(idHD);
      if (res) {
        getAll();
        toast.success('Xoá thành công');
      }
    } catch (error) {
      toast.success('Lỗi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainCard>
      {loading && (
        <div className="overlay">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex' }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            {values.map((d, i) => (
              <Tab
                key={i}
                label={
                  <span>
                    {d.ma} &nbsp;&nbsp; <i onClick={() => handleBackToCart(d.id)} className="fa-solid fa-xmark"></i>
                  </span>
                }
              />
            ))}
          </Tabs>

          <Button variant="outline-primary" style={{ border: 'none' }} onClick={handleAdd}>
            <i className="fa-solid fa-plus"></i>
          </Button>
        </Box>
        {values ? (
          values.map((d, i) => (
            <CustomTabPanel key={i} value={value} index={i}>
              <DonHang id={d.id} getAllHD={getAll} handleAddHoaDonTabs={handleAdd} valuesHoaDonTabs={values}></DonHang>
            </CustomTabPanel>
          ))
        ) : (
          <CustomTabPanel>
            <h1>Không có đơn nào</h1>
          </CustomTabPanel>
        )}
      </Box>
    </MainCard>
  );
}