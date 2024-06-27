/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types';

import { Grid, MenuItem, TextField, Typography } from '@mui/material';
import { bieuDoNam, bieuDoNgay, bieuDoThang, tienNam, tienNgay, tienThang } from 'services/ServiceThongKe';
import { useState, useEffect } from 'react';

// project imports
import SkeletonTotalGrowthBarChart from 'ui-component/cards/Skeleton/TotalGrowthBarChart';
import MainCard from 'ui-component/cards/MainCard';
// import { gridSpacing } from 'store/constant';
import { BarChart } from '@mui/x-charts/BarChart';
import '../../../scss/Chart.scss';

// ==============================|| DASHBOARD DEFAULT - TOTAL GROWTH BAR CHART ||============================== //

const TotalGrowthBarChart = ({ isLoading }) => {
  const [selectedMenu, setSelectedMenu] = useState('nam');
  const [ngay, setNgay] = useState(['']);
  const [thang, setThang] = useState(['']);
  const [nam, setNam] = useState(['']);

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

  const SPBCNgay = async () => {
    const res = await bieuDoNgay();
    if (res && res.data) {
      setNgay(res.data);
    }
  };

  const SPBCThang = async () => {
    const res = await bieuDoThang();
    if (res && res.data) {
      setThang(res.data);
    }
    console.log(res.data);
  };

  const SPBCNam = async () => {
    const res = await bieuDoNam();
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
    handleSPBCNam();
    doanhThuNgay1();
    doanhThuThang1();
    doanhThuNam1();
  }, []);

  const currentDate = new Date();

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  const width = 985;

  return (
    <>
      {isLoading ? (
        <SkeletonTotalGrowthBarChart />
      ) : (
        <MainCard>
          <Grid container>
            <Grid item xs={12}>
              <Grid container alignItems="center" justifyContent="space-between">
                <Grid item>
                  <Grid container direction="column" spacing={1}>
                    <Grid item>
                      <Typography variant="h3">BIỂU ĐỒ DOANH THU</Typography>
                      {selectedMenu === 'ngay' && 'Hôm Nay'}
                      {selectedMenu === 'nam' && `Trong Năm ${currentYear}`}
                      {selectedMenu === 'thang' && `Trong Tháng ${currentMonth}/${currentYear}`}
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <TextField id="standard-select-currency" select value={selectedMenu} onChange={(e) => setSelectedMenu(e.target.value)}>
                    <MenuItem value="ngay" onClick={handleSPBCNgay}>
                      Hôm nay
                    </MenuItem>
                    <MenuItem value="thang" onClick={handleSPBCThang}>
                      Trong tháng
                    </MenuItem>
                    <MenuItem value="nam" onClick={handleSPBCNam}>
                      Trong năm
                    </MenuItem>
                  </TextField>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              {selectedMenu === 'ngay' &&
                (ngay.some((item) => {
                  const parts = item.split(',');
                  return parseFloat(parts[1]) !== 0;
                }) ? (
                  <BarChart
                    margin={{ left: 85 }}
                    xAxis={[
                      {
                        id: 'barCategories',
                        data: ngay.map((item) => {
                          const parts = item.split(',');
                          return parts[0];
                        }),
                        scaleType: 'band'
                      }
                    ]}
                    series={[
                      {
                        data: ngay.map((item) => {
                          const parts = item.split(',');
                          return parseFloat(parts[1]);
                        }),
                        label: 'Doanh thu'
                      }
                    ]}
                    width={width}
                    height={600}
                  />
                ) : (
                  <div style={{ height: 529 }} className="empty-icon-container">
                    <div style={{ alignItems: 'center', paddingTop: 200 }} className="animation-container">
                      <div className="bounce"></div>
                      <div className="pebble1"></div>
                      <div className="pebble2"></div>
                      <div className="pebble3"></div>
                    </div>
                    <div>
                      <h2>Không có dữ liệu</h2>
                      <p>Chúng tôi không tìm thấy dữ liệu để thống kê!</p>
                      <p>Vui lòng mua hàng và thử lại sau!</p>
                    </div>
                  </div>
                ))}
              {selectedMenu === 'thang' &&
                (thang.some((item) => {
                  const parts = item.split(',');
                  return parseFloat(parts[1]) !== 0;
                }) ? (
                  <BarChart
                    margin={{ left: 85 }}
                    xAxis={[
                      {
                        id: 'barCategories',
                        data: thang.map((item) => {
                          const parts = item.split(',');
                          return parts[0];
                        }),
                        scaleType: 'band'
                      }
                    ]}
                    series={[
                      {
                        data: thang.map((item) => {
                          const parts = item.split(',');
                          return parseFloat(parts[1]);
                        }),
                        label: 'Doanh thu'
                      }
                    ]}
                    width={width}
                    height={600}
                  />
                ) : (
                  <div style={{ height: 528 }} className="empty-icon-container">
                    <div style={{ alignItems: 'center', paddingTop: 200 }} className="animation-container">
                      <div className="bounce"></div>
                      <div className="pebble1"></div>
                      <div className="pebble2"></div>
                      <div className="pebble3"></div>
                    </div>
                    <div>
                      <h2>Không có dữ liệu</h2>
                      <p>Chúng tôi không tìm thấy dữ liệu để thống kê!</p>
                      <p>Vui lòng mua hàng và thử lại sau!</p>
                    </div>
                  </div>
                ))}
              {selectedMenu === 'nam' &&
                (nam.some((item) => {
                  const parts = item.split(',');
                  return parseFloat(parts[1]) !== 0;
                }) ? (
                  <BarChart
                    margin={{ left: 85 }}
                    xAxis={[
                      {
                        id: 'barCategories',
                        data: nam.map((item) => {
                          const parts = item.split(',');
                          return parts[0];
                        }),
                        scaleType: 'band'
                      }
                    ]}
                    series={[
                      {
                        data: nam.map((item) => {
                          const parts = item.split(',');
                          return parseFloat(parts[1]);
                        }),
                        label: 'Doanh thu'
                      }
                    ]}
                    width={width}
                    height={600}
                  />
                ) : (
                  <div style={{ height: 600 }} className="empty-icon-container">
                    <div style={{ alignItems: 'center', paddingTop: 200 }} className="animation-container">
                      <div className="bounce"></div>
                      <div className="pebble1"></div>
                      <div className="pebble2"></div>
                      <div className="pebble3"></div>
                    </div>
                    <div>
                      <h2>Không có dữ liệu</h2>
                      <p>Chúng tôi không tìm thấy dữ liệu để thống kê!</p>
                      <p>Vui lòng mua hàng và thử lại sau!</p>
                    </div>
                  </div>
                ))}
            </Grid>
          </Grid>
        </MainCard>
      )}
    </>
  );
};

TotalGrowthBarChart.propTypes = {
  isLoading: PropTypes.bool
};

export default TotalGrowthBarChart;