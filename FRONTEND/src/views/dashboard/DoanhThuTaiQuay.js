/* eslint-disable react/prop-types */
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { doanhThuTQTheoNgay, doanhThuTQTheoThang, doanhThuTQTheoNam, tienNgay, tienThang,tienNam } from 'services/ServiceThongKe';
import '../../../scss/ThongKe.scss';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { Avatar, Box, Grid, Menu, MenuItem, Typography } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonEarningCard from 'ui-component/cards/Skeleton/EarningCard';

// assets
import EarningIcon from 'assets/images/icons/earning.svg';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import CloseIcon from '@mui/icons-material/Close';

const CardWrapper = styled(MainCard)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.dark,
  color: '#fff',
  overflow: 'hidden',
  position: 'relative',
  '&:after': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: theme.palette.secondary[800],
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
    background: theme.palette.secondary[800],
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

const DoanhThuTaiQuay = ({ isLoading }) => {
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState(null);

  const [ngay, setNgay] = useState(0);
  const [thang, setThang] = useState(0);
  const [nam, setNam] = useState(0);

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

  const doanhThuNgay = async () => {
    const res = await doanhThuTQTheoNgay();
    if (res && res.data) {
      setNgay(res.data);
    }
  };

  const doanhThuThang = async () => {
    const res = await doanhThuTQTheoThang();
    if (res && res.data) {
      setThang(res.data);
    }
  };

  const doanhThuNam = async () => {
    const res = await doanhThuTQTheoNam();
    if (res && res.data) {
      setNam(res.data);
    }
  };

  const handleDoanhThuNgay = () => {
    setThang('');
    setNam('');
    if (ngay === '') {
      setNgay(0);
    }
    doanhThuNgay();
  };

  const handleDoanhThuThang = () => {
    setNgay('');
    setNam('');
    if (thang === '') {
      setThang(0);
    }
    doanhThuThang();
  };

  const handleDoanhThuNam = () => {
    setNgay('');
    setThang('');
    if (nam === '') {
      setNam(0);
    }
    doanhThuNam();
  };

  useEffect(() => {
    handleDoanhThuNgay();
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
                          backgroundColor: theme.palette.secondary[800],
                          mt: 1
                        }}
                      >
                        <img src={EarningIcon} alt="Notification" />
                      </Avatar>
                    </Grid>
                    <Grid item>
                      <Typography
                        sx={{
                          fontSize: '15px',
                          fontWeight: 500,
                          color: theme.palette.secondary[900],
                          zIndex: 2,
                          position: 'relative'
                        }}
                      >
                        DOANH THU BÁN TRỰC TIẾP {ngay !== '' && 'HÔM NAY'}
                        {thang !== '' && `TRONG THÁNG ${currentMonth}/${currentYear}`}
                        {nam !== '' && `TRONG NĂM ${currentYear}`}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid item>
                    <Avatar
                      variant="rounded"
                      sx={{
                        ...theme.typography.commonAvatar,
                        ...theme.typography.mediumAvatar,
                        backgroundColor: theme.palette.secondary.dark,
                        color: theme.palette.secondary[200],
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
                      <MenuItem className={ngay !== '' ? 'menu-item selected' : 'menu-item'} onClick={handleDoanhThuNgay}>
                        Hôm nay
                      </MenuItem>
                      <MenuItem className={thang !== '' ? 'menu-item selected' : 'menu-item'} onClick={handleDoanhThuThang}>
                        Trong tháng
                      </MenuItem>
                      <MenuItem className={nam !== '' ? 'menu-item selected' : 'menu-item'} onClick={handleDoanhThuNam}>
                        Trong năm
                      </MenuItem>
                    </Menu>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Grid container alignItems="center">
                  <Grid item>
                    {ngay !== '' && (
                      <Typography sx={{ fontSize: '2.125rem', fontWeight: 500, mr: 1, mt: 1.75, mb: 0.75 }}>
                        {convertToCurrency(ngay+ngay1)}
                      </Typography>
                    )}
                    {thang !== '' && (
                      <Typography sx={{ fontSize: '2.125rem', fontWeight: 500, mr: 1, mt: 1.75, mb: 0.75 }}>
                        {convertToCurrency(thang+thang1)}
                      </Typography>
                    )}
                    {nam !== '' && (
                      <Typography sx={{ fontSize: '2.125rem', fontWeight: 500, mr: 1, mt: 1.75, mb: 0.75 }}>
                        {convertToCurrency(nam+nam1)}
                      </Typography>
                    )}{' '}
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

DoanhThuTaiQuay.propTypes = {
  isLoading: PropTypes.bool
};

export default DoanhThuTaiQuay;