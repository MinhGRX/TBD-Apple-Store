import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import '../../../scss/ThongKe.scss';
// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { Avatar, Box, Grid, Menu, MenuItem, Typography } from '@mui/material';
//service api
import { doanhThuAllNam, doanhThuAllNgay, doanhThuAllThang, tienNam, tienNgay, tienThang } from 'services/ServiceThongKe';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonEarningCard from 'ui-component/cards/Skeleton/EarningCard';

// assets
// import EarningIcon from 'assets/images/icons/earning.svg';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import CloseIcon from '@mui/icons-material/Close';

const CardWrapper = styled(MainCard)(({ theme }) => ({
  backgroundColor: 'white',
  color: 'black',
  overflow: 'hidden',
  position: 'relative',
  '&:after': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    // background: theme.palette.secondary[800],
    borderRadius: '50%',
    top: -85,
    right: -95,
    [theme.breakpoints.down('sm')]: {
      top: -105,
      right: -140
    }
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    // background: theme.palette.secondary[800],
    borderRadius: '50%',
    top: -125,
    right: -15,
    opacity: 0.5,
    [theme.breakpoints.down('sm')]: {
      top: -155,
      right: -70
    }
  }
}));

// ===========================|| DASHBOARD DEFAULT - EARNING CARD ||=========================== //

const DoanhThuAll = ({ isLoading }) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);

  const [selectedMenu, setSelectedMenu] = useState('thang');
  const [ngay, setNgay] = useState([]);
  const [thang, setThang] = useState([]);
  const [nam, setNam] = useState([]);

  const [ngay1, setNgay1] = useState(0);
  const [thang1, setThang1] = useState(0);
  const [nam1, setNam1] = useState(0);

  console.log(ngay1);
  console.log(thang1);
  console.log(nam1);

  const doanhThuNgay1 = async () => {
    const res = await tienNgay();
    if (res && res.data) {
      setNgay1(res.data);
    }
  };

  const doanhThuThang1 = async () => {
    const res = await tienThang();
    if (res && res.data) {
      setThang1(res.data);
    }
  };

  const doanhThuNam1 = async () => {
    const res = await tienNam();
    if (res && res.data) {
      setNam1(res.data);
    }
  };


  const doanhThuTongNgay = async () => {
    const res = await doanhThuAllNgay();
    if (res && res.data) {
      setNgay(res.data);
    }
  };

  const doanhThuTongThang = async () => {
    const res = await doanhThuAllThang();
    if (res && res.data) {
      setThang(res.data);
    }
  };

  const doanhThuTongNam = async () => {
    const res = await doanhThuAllNam();
    if (res && res.data) {
      setNam(res.data);
    }
  };

  const handleDoanhThuTongNgay = () => {
    // setThang('');
    // setNam('');
    // if (ngay === '') {
    //   setNgay(0);
    // }
    doanhThuTongNgay();
    setSelectedMenu('ngay');
  };

  const handleDoanhThuTongThang = () => {
    // setNgay('');
    // setNam('');
    // if (thang === '') {
    //   setThang(0);
    // }
    doanhThuTongThang();
    setSelectedMenu('thang');
  };

  const handleDoanhThuTongNam = () => {
    // setNgay('');
    // setThang('');
    // if (nam === '') {
    //   setNam(0);
    // }
    doanhThuTongNam();
    setSelectedMenu('nam');
  };

  useEffect(() => {
    handleDoanhThuTongNam();
    doanhThuNgay1();
    doanhThuThang1();
    doanhThuNam1();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function convertToCurrency(number) {
    // Chuyển đổi số thành định dạng tiền Việt Nam
    const formatter = new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    });

    return formatter.format(number);
  }

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setIsModalOpen(false);
  };

  const currentDate = new Date();

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  return (
    <>
      {isLoading ? (
        <SkeletonEarningCard />
      ) : (
        <CardWrapper border={false} content={false}>
          <Box sx={{ p: 2.25 }}>
            <Grid container direction="column">
              <Grid item>
                <Grid container justifyContent="space-between">
                  <Grid item sx={{ display: 'flex', alignItems: 'center' }}>
                    <Grid item sx={{ paddingRight: 2 }}>
                      <Avatar
                        variant="rounded"
                        sx={{
                          ...theme.typography.commonAvatar,
                          ...theme.typography.largeAvatar,
                          backgroundColor: '-moz-initial',
                          mt: 1
                        }}
                      >
                        {/* <img src={EarningIcon} alt="Notification" /> */}
                        <i style={{ color: 'green' }} className="fa-solid fa-money-bill-1"></i>
                      </Avatar>
                    </Grid>
                    <Grid item>
                      <Typography
                        sx={{
                          fontSize: '15px',
                          fontWeight: 500,
                          color: 'black',
                          zIndex: 2,
                          position: 'relative'
                        }}
                      >
                        DOANH THU {selectedMenu === 'ngay' && 'HÔM NAY'}
                        {selectedMenu === 'nam' && `TRONG NĂM ${currentYear}`}
                        {selectedMenu === 'thang' && `TRONG THÁNG ${currentMonth}/${currentYear}`}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid item>
                    <Avatar
                      className="target-pointer"
                      variant="rounded"
                      sx={{
                        ...theme.typography.commonAvatar,
                        ...theme.typography.mediumAvatar,
                        backgroundColor: '-moz-initial',
                        color: 'black',
                        zIndex: 1
                      }}
                      aria-controls="menu-earning-card"
                      aria-haspopup="true"
                      onClick={handleClick}
                    >
                      <div className={`close-icon ${isModalOpen ? 'open' : ''}`}>
                        {isModalOpen ? <CloseIcon fontSize="inherit" /> : <MoreHorizIcon fontSize="inherit" />}
                      </div>
                    </Avatar>
                    <Menu
                      id="menu-earning-card"
                      anchorEl={anchorEl}
                      keepMounted
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                      variant="selectedMenu"
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right'
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right'
                      }}
                    >
                      <MenuItem className={selectedMenu === 'ngay' ? 'menu-item selected' : 'menu-item'} onClick={handleDoanhThuTongNgay}>
                        Hôm nay
                      </MenuItem>
                      <MenuItem className={selectedMenu === 'thang' ? 'menu-item selected' : 'menu-item'} onClick={handleDoanhThuTongThang}>
                        Trong tháng
                      </MenuItem>
                      <MenuItem className={selectedMenu === 'nam' ? 'menu-item selected' : 'menu-item'} onClick={handleDoanhThuTongNam}>
                        Trong năm
                      </MenuItem>
                    </Menu>
                  </Grid>
                </Grid>
              </Grid>
              <hr></hr>
              <Grid item>
                <Grid container alignItems="center">
                  <Grid item style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {selectedMenu === 'ngay' &&
                      ngay.map((n, index) => {
                        const sizeData = n.split(',');
                        const taiQuay = sizeData[0];
                        const online = sizeData[1];
                        const tong = sizeData[2];

                        return (
                          <table key={index}>
                            <tr style={{ fontSize: 14 }}>
                              <th>Doanh thu đơn hàng trực tiếp: </th>
                              <th style={{ paddingLeft: 30 }}> Doanh thu đơn hàng online: </th>
                              <th style={{ paddingLeft: 30 }}> Tổng doanh thu: </th>
                            </tr>
                            <tr>
                              <td style={{ color: 'red' }}>{convertToCurrency(parseFloat(taiQuay)+ngay1)}</td>
                              <td style={{ paddingLeft: 30, color: 'red' }}>{convertToCurrency(online)}</td>
                              <td style={{ paddingLeft: 30, color: 'red' }}>{convertToCurrency(parseFloat(tong) + ngay1)}</td>
                            </tr>
                          </table>
                        );
                      })}
                    {selectedMenu === 'thang' &&
                      thang.map((n, index) => {
                        const sizeData = n.split(',');
                        const taiQuay = sizeData[0];
                        const online = sizeData[1];
                        const tong = sizeData[2];

                        return (
                          <table key={index}>
                            <tr style={{ fontSize: 14 }}>
                              <th>Doanh thu đơn hàng trực tiếp: </th>
                              <th style={{ paddingLeft: 30 }}> Doanh thu đơn hàng online: </th>
                              <th style={{ paddingLeft: 30 }}> Tổng doanh thu: </th>
                            </tr>
                            <tr>
                              <td style={{ color: 'red' }}>{convertToCurrency(parseFloat(taiQuay)+thang1)}</td>
                              <td style={{ paddingLeft: 30, color: 'red' }}>{convertToCurrency(online)}</td>
                              <td style={{ paddingLeft: 30, color: 'red' }}>{convertToCurrency(parseFloat(tong) + thang1)}</td>
                            </tr>
                          </table>
                        );
                      })}
                    {selectedMenu === 'nam' &&
                      nam.map((n, index) => {
                        const sizeData = n.split(',');
                        const taiQuay = sizeData[0];
                        const online = sizeData[1];
                        const tong = sizeData[2];

                        return (
                          <table key={index}>
                            <tr style={{ fontSize: 14 }}>
                              <th>Doanh thu đơn hàng trực tiếp: </th>
                              <th style={{ paddingLeft: 30 }}> Doanh thu đơn hàng online: </th>
                              <th style={{ paddingLeft: 30 }}> Tổng doanh thu: </th>
                            </tr>
                            <tr>
                              <td style={{ color: 'red' }}>{convertToCurrency(parseFloat(taiQuay)+parseFloat(nam1))}</td>
                              <td style={{ paddingLeft: 30, color: 'red' }}>{convertToCurrency(online)}</td>
                              <td style={{ paddingLeft: 30, color: 'red' }}>{convertToCurrency(parseFloat(tong) + nam1)}</td>
                            </tr>
                          </table>
                        );
                      })}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </CardWrapper>
      )}
    </>
  );
};

DoanhThuAll.propTypes = {
  isLoading: PropTypes.bool
};

export default DoanhThuAll;