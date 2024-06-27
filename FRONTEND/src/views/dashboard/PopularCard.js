
/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types';
import '../../../scss/ThongKe.scss';
import CloseIcon from '@mui/icons-material/Close';
import { useState, useEffect } from 'react';
import {
  sanPhamBanChayNgay,
  sanPhamBanChayThang,
  sanPhamBanChayNam,
  sanPhamBanChayNgaySearch,
  sanPhamBanChayThangSearch
} from 'services/ServiceThongKe';
import _ from 'lodash';

import '../../../scss/ThongKe.scss';
// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Button, CardActions, CardContent, Divider, Grid, Menu, MenuItem, Typography } from '@mui/material';
import Modal from 'react-bootstrap/Modal';

// project imports
// import BajajAreaChartCard from './BajajAreaChartCard';
import MainCard from 'ui-component/cards/MainCard';
import SkeletonPopularCard from 'ui-component/cards/Skeleton/PopularCard';
import { gridSpacing } from 'store/constant';

// assets
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
// import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
// import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';

// ==============================|| DASHBOARD DEFAULT - POPULAR CARD ||============================== //

const PopularCard = ({ isLoading }) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [show5, setShow5] = useState(false);
  const handleClose5 = () => {
    setShow5(false);
  };
  const handleShow5 = () => setShow5(true);

  const [selectedMenu, setSelectedMenu] = useState('thang');
  const [ngay, setNgay] = useState([]);
  const [thang, setThang] = useState([]);
  const [nam, setNam] = useState([]);

  const SPBCNgay = async () => {
    const res = await sanPhamBanChayNgay();
    if (res && res.data) {
      setNgay(res.data);
    }
  };

  const SPBCThang = async () => {
    const res = await sanPhamBanChayThang();
    if (res && res.data) {
      setThang(res.data);
    }
  };

  const SPBCNam = async () => {
    const res = await sanPhamBanChayNam();
    if (res && res.data) {
      setNam(res.data);
    }
  };

  const handleSPBCNgay = () => {
    SPBCNgay();
    setSelectedMenu('ngay');
  };

  const handleSPBCThang = () => {
    SPBCThang();
    setSelectedMenu('thang');
  };

  const handleSPBCNam = () => {
    SPBCNam();
    setSelectedMenu('nam');
  };

  useEffect(() => {
    handleSPBCThang();
  }, []);

  // function convertToCurrency(number) {
  //   // Chuyển đổi số thành định dạng tiền Việt Nam
  //   const formatter = new Intl.NumberFormat('vi-VN', {
  //     style: 'currency',
  //     currency: 'VND'
  //   });

  //   return formatter.format(number);
  // }

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setIsModalOpen(false);
  };

  //search
  const [termSPNgay, setTermSPNgay] = useState('');
  const [ngayS, setNgayS] = useState([]);
  const [termSPThang, setTermSPThang] = useState('');
  const [thangS, setThangS] = useState([]);
  const [termSPNam, setTermSPNam] = useState('');
  const [namS, setNamS] = useState([]);

  const searchSPNgay = async (termSPNgay) => {
    const res = await sanPhamBanChayNgaySearch(termSPNgay);
    if (res) {
      setNgayS(res.data);
    }
  };

  const handleSearchSPNgay = _.debounce(async () => {
    if (termSPNgay) {
      searchSPNgay(termSPNgay);
    } else {
      searchSPNgay('');
    }
  }, []);

  const searchSPThang = async (termSPThang) => {
    const res = await sanPhamBanChayThangSearch(termSPThang);
    if (res) {
      setThangS(res.data);
    }
  };

  const handleSearchSPThang = _.debounce(async () => {
    if (termSPThang) {
      searchSPThang(termSPThang);
    } else {
      searchSPThang('');
    }
  }, []);

  const searchSPNam = async (termSPNam) => {
    const res = await sanPhamBanChayThangSearch(termSPNam);
    if (res) {
      setNamS(res.data);
    }
  };

  const handleSearchSPNam = _.debounce(async () => {
    if (termSPNam) {
      searchSPNam(termSPNam);
    } else {
      searchSPNam('');
    }
  }, []);

  useEffect(() => {
    handleSearchSPNgay();
  }, [termSPNgay]);

  useEffect(() => {
    handleSearchSPThang();
  }, [termSPThang]);

  useEffect(() => {
    handleSearchSPNam();
  }, [termSPNam]);

  const handleInputChangeSPNgay = (e) => {
    setTermSPNgay(e.target.value);
  };

  const handleInputChangeSPThang = (e) => {
    setTermSPThang(e.target.value);
  };

  const handleInputChangeSPNam = (e) => {
    setTermSPNam(e.target.value);
  };

  const currentDate = new Date();

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  return (
    <>
      {isLoading ? (
        <SkeletonPopularCard />
      ) : (
        <MainCard style={{ height: 702 }} content={false}>
          <CardContent>
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12}>
                <Grid container alignContent="center" justifyContent="space-between">
                  <Grid item>
                    <Typography variant="h4">Sản Phẩm Bán Chạy </Typography>
                    {selectedMenu === 'ngay' && 'Hôm Nay'}
                    {selectedMenu === 'nam' && `Trong Năm ${currentYear}`}
                    {selectedMenu === 'thang' && `Trong Tháng ${currentMonth}/${currentYear}`}
                  </Grid>
                  <Grid item>
                    <Avatar
                      variant="rounded"
                      sx={{
                        ...theme.typography.commonAvatar,
                        ...theme.typography.mediumAvatar,
                        backgroundColor: theme.palette.secondary.light,
                        color: theme.palette.secondary.dark[500],
                        zIndex: 1
                      }}
                      aria-controls="menu-popular-card"
                      aria-haspopup="true"
                      onClick={handleClick}
                    >
                      <div className={`close-icon ${isModalOpen ? 'open' : ''}`}>
                        {isModalOpen ? <CloseIcon fontSize="inherit" /> : <MoreHorizOutlinedIcon fontSize="inherit" />}
                      </div>
                    </Avatar>
                    <Menu
                      id="menu-popular-card"
                      anchorEl={anchorEl}
                      keepMounted
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                      variant="selectedMenu"
                      anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right'
                      }}
                      transformOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right'
                      }}
                    >
                      <MenuItem className={selectedMenu === 'ngay' ? 'menu-item selected' : 'menu-item'} onClick={handleSPBCNgay}>
                        Hôm nay
                      </MenuItem>
                      <MenuItem className={selectedMenu === 'thang' ? 'menu-item selected' : 'menu-item'} onClick={handleSPBCThang}>
                        Trong tháng
                      </MenuItem>
                      <MenuItem className={selectedMenu === 'nam' ? 'menu-item selected' : 'menu-item'} onClick={handleSPBCNam}>
                        Trong năm
                      </MenuItem>
                    </Menu>
                  </Grid>
                </Grid>
              </Grid>
              {/* <Grid item xs={12} sx={{ pt: '16px !important' }}>
                <BajajAreaChartCard />
              </Grid> */}
              <Grid item xs={12}>
                <Grid container direction="column"></Grid>
                <br></br>
                {selectedMenu === 'ngay' &&
                  ngay.slice(0, 5).map((n, index) => {
                    const sizeData = n.split(',');
                    const tenSP = sizeData[0];
                    const soLuongSP = sizeData[1];

                    return (
                      <Grid key={index} container direction="column">
                        <Grid item>
                          <Grid container alignItems="center" justifyContent="flex-start">
                            <Grid item>
                              <Typography variant="subtitle1" color="inherit">
                                <p>
                                  <span>{tenSP}</span>
                                </p>
                              </Typography>
                            </Grid>
                          </Grid>
                          <Grid item>
                            <Grid container alignItems="center" justifyContent="flex-end">
                              <Grid item>
                                <Typography variant="subtitle1" color="inherit">
                                  <p style={{ fontStyle: 'italic', fontWeight: 'initial', color: 'gray' }}>
                                    Đã bán:{' '}
                                    <span style={{ fontStyle: 'revert-layer', fontWeight: 'bolder', color: 'red' }}>{soLuongSP}</span>
                                  </p>
                                </Typography>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item>
                          <Divider sx={{ my: 1 }} />
                        </Grid>
                      </Grid>
                    );
                  })}
                {selectedMenu === 'thang' &&
                  thang.slice(0, 5).map((n, index) => {
                    const sizeData = n.split(',');
                    const tenSP = sizeData[0];
                    const soLuongSP = sizeData[1];

                    return (
                      <Grid key={index} container direction="column">
                        <Grid item>
                          <Grid container alignItems="center" justifyContent="flex-start">
                            <Grid item>
                              <Typography variant="subtitle1" color="inherit">
                                <p>
                                  <span>{tenSP}</span>
                                </p>
                              </Typography>
                            </Grid>
                          </Grid>
                          <Grid item>
                            <Grid container alignItems="center" justifyContent="flex-end">
                              <Grid item>
                                <Typography variant="subtitle1" color="inherit">
                                  <p style={{ fontStyle: 'italic', fontWeight: 'initial', color: 'gray' }}>
                                    Đã bán:{' '}
                                    <span style={{ fontStyle: 'revert-layer', fontWeight: 'bolder', color: 'red' }}>{soLuongSP}</span>
                                  </p>
                                </Typography>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item>
                          <Divider sx={{ my: 1 }} />
                        </Grid>
                      </Grid>
                    );
                  })}
                {selectedMenu === 'nam' &&
                  nam.slice(0, 5).map((n, index) => {
                    const sizeData = n.split(',');
                    const tenSP = sizeData[0];
                    const soLuongSP = sizeData[1];

                    return (
                      <Grid key={index} container direction="column">
                        <Grid item>
                          <Grid container alignItems="center" justifyContent="flex-start">
                            <Grid item>
                              <Typography variant="subtitle1" color="inherit">
                                <p>
                                  <span>{tenSP}</span>
                                </p>
                              </Typography>
                            </Grid>
                          </Grid>
                          <Grid item>
                            <Grid container alignItems="center" justifyContent="flex-end">
                              <Grid item>
                                <Typography variant="subtitle1" color="inherit">
                                  <p style={{ fontStyle: 'italic', fontWeight: 'initial', color: 'gray' }}>
                                    Đã bán:{' '}
                                    <span style={{ fontStyle: 'revert-layer', fontWeight: 'bolder', color: 'red' }}>{soLuongSP}</span>
                                  </p>
                                </Typography>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item>
                          <Divider sx={{ my: 1 }} />
                        </Grid>
                      </Grid>
                    );
                  })}
              </Grid>
            </Grid>
          </CardContent>
          <CardActions sx={{ p: 1.25, pt: 0, justifyContent: 'center' }}>
            <Button onClick={handleShow5} size="small" disableElevation>
              Tất Cả
              <ChevronRightOutlinedIcon />
            </Button>
          </CardActions>
          <Modal style={{ marginTop: 120, marginLeft: 150 }} show={show5} onHide={handleClose5}>
            <Modal.Header closeButton>
              <Modal.Title
                style={{
                  marginLeft: selectedMenu === 'ngay' ? 72 : selectedMenu === 'nam' ? 30 : selectedMenu === 'thang' ? 1 : 0,
                  fontSize: 23
                }}
              >
                Sản Phẩm Bán Chạy {''}
                {selectedMenu === 'ngay' && 'Hôm Nay'}
                {selectedMenu === 'nam' && `Trong Năm ${currentYear}`}
                {selectedMenu === 'thang' && `Trong Tháng ${currentMonth}/${currentYear}`}
              </Modal.Title>
            </Modal.Header>
            <div style={{ paddingLeft: 25 }} className="search">
              {selectedMenu === 'ngay' && (
                <input
                  style={{ borderRadius: 15, width: 438, height: 35 }}
                  type="text"
                  className="input-search results-list"
                  placeholder="Nhập tên sản phẩm cần tìm..."
                  value={termSPNgay}
                  onChange={handleInputChangeSPNgay}
                />
              )}
              {selectedMenu === 'thang' && (
                <input
                  style={{ borderRadius: 15, width: 438, height: 35 }}
                  type="text"
                  className="input-search results-list"
                  placeholder="Nhập tên sản phẩm cần tìm..."
                  value={termSPThang}
                  onChange={handleInputChangeSPThang}
                />
              )}
              {selectedMenu === 'nam' && (
                <input
                  style={{ borderRadius: 15, width: 438, height: 35 }}
                  type="text"
                  className="input-search results-list"
                  placeholder="Nhập tên sản phẩm cần tìm..."
                  value={termSPNam}
                  onChange={handleInputChangeSPNam}
                />
              )}
            </div>
            <Modal.Body style={{ width: 495, maxHeight: 410, overflow: 'auto' }}>
              {selectedMenu === 'ngay' &&
                ngayS.map((n, index) => {
                  const sizeData = n.split(',');
                  const tenSP = sizeData[0];
                  const soLuongSP = sizeData[1];

                  return (
                    <Grid key={index} container direction="column">
                      <Grid item>
                        <Grid container alignItems="center" justifyContent="flex-start">
                          <Grid item>
                            <Typography variant="subtitle1" color="inherit">
                              <p>
                                <span>{tenSP}</span>
                              </p>
                            </Typography>
                          </Grid>
                        </Grid>
                        <Grid item>
                          <Grid container alignItems="center" justifyContent="flex-end">
                            <Grid item>
                              <Typography variant="subtitle1" color="inherit">
                                <p style={{ fontStyle: 'italic', fontWeight: 'initial', color: 'gray' }}>
                                  Đã bán: <span style={{ fontStyle: 'revert-layer', fontWeight: 'bolder', color: 'red' }}>{soLuongSP}</span>
                                </p>
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item>
                        <Divider sx={{ my: 1 }} />
                      </Grid>
                    </Grid>
                  );
                })}
              {selectedMenu === 'thang' &&
                thangS.map((n, index) => {
                  const sizeData = n.split(',');
                  const tenSP = sizeData[0];
                  const soLuongSP = sizeData[1];

                  return (
                    <Grid key={index} container direction="column">
                      <Grid item>
                        <Grid container alignItems="center" justifyContent="flex-start">
                          <Grid item>
                            <Typography variant="subtitle1" color="inherit">
                              <p>
                                <span>{tenSP}</span>
                              </p>
                            </Typography>
                          </Grid>
                        </Grid>
                        <Grid item>
                          <Grid container alignItems="center" justifyContent="flex-end">
                            <Grid item>
                              <Typography variant="subtitle1" color="inherit">
                                <p style={{ fontStyle: 'italic', fontWeight: 'initial', color: 'gray' }}>
                                  Đã bán: <span style={{ fontStyle: 'revert-layer', fontWeight: 'bolder', color: 'red' }}>{soLuongSP}</span>
                                </p>
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item>
                        <Divider sx={{ my: 1 }} />
                      </Grid>
                    </Grid>
                  );
                })}
              {selectedMenu === 'nam' &&
                namS.map((n, index) => {
                  const sizeData = n.split(',');
                  const tenSP = sizeData[0];
                  const soLuongSP = sizeData[1];

                  return (
                    <Grid key={index} container direction="column">
                      <Grid item>
                        <Grid container alignItems="center" justifyContent="flex-start">
                          <Grid item>
                            <Typography variant="subtitle1" color="inherit">
                              <p>
                                <span>{tenSP}</span>
                              </p>
                            </Typography>
                          </Grid>
                        </Grid>
                        <Grid item>
                          <Grid container alignItems="center" justifyContent="flex-end">
                            <Grid item>
                              <Typography variant="subtitle1" color="inherit">
                                <p style={{ fontStyle: 'italic', fontWeight: 'initial', color: 'gray' }}>
                                  Đã bán: <span style={{ fontStyle: 'revert-layer', fontWeight: 'bolder', color: 'red' }}>{soLuongSP}</span>
                                </p>
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item>
                        <Divider sx={{ my: 1 }} />
                      </Grid>
                    </Grid>
                  );
                })}
            </Modal.Body>
          </Modal>
        </MainCard>
      )}
    </>
  );
};

PopularCard.propTypes = {
  isLoading: PropTypes.bool
};

export default PopularCard;
