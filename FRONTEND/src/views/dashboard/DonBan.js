import PropTypes from 'prop-types';
import '../../../scss/ThongKe.scss';
import CloseIcon from '@mui/icons-material/Close';
import { useState, useEffect } from 'react';
import '../../../scss/ThongKe.scss';
// api
import { soDonThanhCongNgay, soDonThanhCongThang, soDonThanhCongNam } from 'services/ServiceThongKe';
// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Avatar, Box, List, ListItem, ListItemAvatar, ListItemText, Menu, MenuItem, Typography } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import TotalIncomeCard from 'ui-component/cards/Skeleton/TotalIncomeCard';

import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

// assets
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';

// styles
const CardWrapper = styled(MainCard)(({ theme }) => ({
  overflow: 'hidden',
  position: 'relative',
  '&:after': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: `linear-gradient(210.04deg, ${theme.palette.warning.dark} -50.94%, rgba(144, 202, 249, 0) 83.49%)`,
    borderRadius: '50%',
    top: -30,
    right: -180
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: `linear-gradient(140.9deg, ${theme.palette.warning.dark} -14.02%, rgba(144, 202, 249, 0) 70.50%)`,
    borderRadius: '50%',
    top: -160,
    right: -130
  }
}));

// ==============================|| DASHBOARD - TOTAL INCOME LIGHT CARD ||============================== //

const DonBan = ({ isLoading }) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);

  const [ngay, setNgay] = useState(0);
  const [thang, setThang] = useState(0);
  const [nam, setNam] = useState(0);

  const SLNgay = async () => {
    const res = await soDonThanhCongNgay();
    if (res && res.data) {
      setNgay(res.data);
    }
  };

  const SLThang = async () => {
    const res = await soDonThanhCongThang();
    if (res && res.data) {
      setThang(res.data);
    }
  };

  const SLNam = async () => {
    const res = await soDonThanhCongNam();
    if (res && res.data) {
      setNam(res.data);
    }
  };

  const handleSLNgay = () => {
    setThang('');
    setNam('');
    if (ngay === '') {
      setNgay(0);
    }
    SLNgay();
  };

  const handleSLThang = () => {
    setNgay('');
    setNam('');
    if (thang === '') {
      setThang(0);
    }
    SLThang();
  };

  const handleSLNam = () => {
    setNgay('');
    setThang('');
    if (nam === '') {
      setNam(0);
    }
    SLNam();
  };

  useEffect(() => {
    handleSLThang();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setIsModalOpen(false);
  };

  return (
    <>
      {isLoading ? (
        <TotalIncomeCard />
      ) : (
        <CardWrapper border={false} content={false}>
          <Box height={112} sx={{ p: 2 }}>
            <List sx={{ py: 0, display: 'flex' }}>
              <ListItem alignItems="center" disableGutters sx={{ py: 0 }}>
                <ListItemAvatar>
                  <Avatar
                    variant="rounded"
                    sx={{
                      ...theme.typography.commonAvatar,
                      ...theme.typography.largeAvatar,
                      backgroundColor: theme.palette.warning.light,
                      color: theme.palette.warning.dark
                    }}
                  >
                    <LocalMallOutlinedIcon fontSize="inherit" />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  sx={{
                    py: 0,
                    mt: 0.45,
                    mb: 0.45
                  }}
                  primary={<Typography variant="h4">ĐƠN ĐÃ BÁN</Typography>}
                  secondary={
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: theme.palette.grey[500],
                        mt: 0.5,
                        fontSize: 20
                      }}
                    >
                      {ngay !== '' && ngay}

                      {thang !== '' && thang}

                      {nam !== '' && nam}
                    </Typography>
                  }
                />
              </ListItem>
              <Avatar
                variant="rounded"
                sx={{
                  ...theme.typography.commonAvatar,
                  ...theme.typography.mediumAvatar,
                  backgroundColor: theme.palette.secondary.light,
                  color: theme.palette.secondary.dark[500],
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
                <MenuItem className={ngay !== '' ? 'menu-item selected' : 'menu-item'} onClick={handleSLNgay}>
                  Hôm nay
                </MenuItem>
                <MenuItem className={thang !== '' ? 'menu-item selected' : 'menu-item'} onClick={handleSLThang}>
                  Trong tháng
                </MenuItem>
                <MenuItem className={nam !== '' ? 'menu-item selected' : 'menu-item'} onClick={handleSLNam}>
                  Trong năm
                </MenuItem>
              </Menu>
            </List>
          </Box>
        </CardWrapper>
      )}
    </>
  );
};

DonBan.propTypes = {
  isLoading: PropTypes.bool
};

export default DonBan;