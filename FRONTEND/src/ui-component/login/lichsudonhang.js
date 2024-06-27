/* eslint-disable react-hooks/exhaustive-deps */
import '../../scss/information.scss';
import Header from 'ui-component/trangchu/Header';
import Footer from 'ui-component/trangchu/Footer';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ListDonHang from './ListDonHang';
import { useState } from 'react';
import SlideBar from 'layout/SlideBar';
import { searchByTrangThai } from 'services/ServiceDonHang';
import { useEffect } from 'react';

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

function History() {
  const [value, setValue] = useState(0);
  const dataLogin = JSON.parse(localStorage.getItem('dataLogin'));
  const [data, setData] = useState([]);
  const [tabs, setTabs] = useState([
    { title: 'Tất cả', trangThai: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], size: 0 },
    { title: 'Chờ xác nhận', trangThai: [0, 1, 6], size: 0 },
    { title: 'Đang giao', trangThai: [3, 5, 8, 9, 10, 11, 12, 13], size: 0 },
    { title: 'Hoàn thành', trangThai: [4], size: 0 },
    { title: 'Huỷ đơn', trangThai: [2, 14], size: 0 }
    // { title: 'Đổi hàng', trangThai: [15, 16, 17], size: 0 }
  ]);

  useEffect(() => {
    tabs.forEach((d) => {
      searchByTT(dataLogin.id, d.trangThai);
    });
  }, []);

  const searchByTT = async (id, values) => {
    const res = await searchByTrangThai(id, values);
    if (res) {
      const updatedTabs = tabs.map((tab) => {
        const tabTrangThai = tab.trangThai || [];
        const tabSize = res.data.hoaDonList.filter((item) => tabTrangThai.includes(item.hoaDon.trangThai)).length;
        return { ...tab, size: tabSize };
      });

      setTabs(updatedTabs);
    }
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
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
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={value} onChange={handleChange} aria-label="disabled tabs example" variant="fullWidth">
                    {tabs.map((d, i) => (
                      <Tab key={i} label={d.title + ` (${d.size})`} />
                    ))}
                  </Tabs>
                </Box>
                {tabs ? (
                  tabs.map((d, i) => (
                    <CustomTabPanel key={i} value={value} index={i}>
                      <ListDonHang
                        tabs={tabs}
                        data={d}
                        size={searchByTT}
                        dataLogin={dataLogin}
                        values={data}
                        setValues={setData}
                      ></ListDonHang>
                    </CustomTabPanel>
                  ))
                ) : (
                  <CustomTabPanel>
                    <h1>Không có đơn nào</h1>
                  </CustomTabPanel>
                )}
              </Box>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default History;