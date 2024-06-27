import { useEffect, useState } from 'react';

// material-ui
import { Grid } from '@mui/material';

// project imports
import EarningCard from './DoanhThuTong';
import PopularCard from './PopularCard';
// import TotalOrderLineChartCard from './TotalOrderLineChartCard';
import TotalGrowthBarChart from './TotalGrowthBarChart';
import { gridSpacing } from 'store/constant';
import DoanhThuTaiQuay from './DoanhThuTaiQuay';
import DoanhThuOnline from './DoanhThuOnline';
import DonBan from './DonBan';
import DonChoXacNhan from './DonChoXacNhan';
import DonHuy from './DonHuy';
import DonTra from './DonTra';
import DoanhThuAll from './DoanhThuTongAll';
import HangLoi from 'views/hang-loi/HangLoi';
import HangDoiTK from 'views/hang-loi/hangDoiTK';
// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item lg={6} md={6} sm={6} xs={12}>
            <DoanhThuTaiQuay isLoading={isLoading} />
          </Grid>
          <Grid item lg={6} md={6} sm={6} xs={12}>
            <DoanhThuOnline isLoading={isLoading} />
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={gridSpacing}>
              <Grid item lg={3} md={6} sm={6} xs={12}>
                <DonChoXacNhan isLoading={isLoading} />
              </Grid>
              <Grid item lg={3} md={6} sm={6} xs={12}>
                <DonBan isLoading={isLoading} />
              </Grid>
              <Grid item lg={3} md={6} sm={6} xs={12}>
                <DonHuy isLoading={isLoading} />
              </Grid>
              <Grid item lg={3} md={6} sm={6} xs={12}>
                <DonTra isLoading={isLoading} />
              </Grid>
            </Grid>
          </Grid>
          <Grid item lg={6} md={6} sm={6} xs={12}>
            <EarningCard isLoading={isLoading} />
          </Grid>
          <Grid item lg={6} md={6} sm={6} xs={12}>
            <DoanhThuAll isLoading={isLoading} />
          </Grid>
          {/*  */}
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} md={8.6}>
            <TotalGrowthBarChart isLoading={isLoading} />
          </Grid>
          <Grid item xs={12} md={3.4}>
            <PopularCard isLoading={isLoading} />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} md={12}>
            <HangLoi></HangLoi>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} md={12}>
            <HangDoiTK></HangDoiTK>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Dashboard;