import BanHangTaiQuay from './BanHangTaiQuay';
import ThongKe from './ThongKe';
import dashboard from './dashboard';
import pages from './pages';
import utilities from './utilities';

// ==============================|| MENU ITEMS ||============================== //

// const dataLoginNV = JSON.parse(localStorage.getItem('dataLoginNV'));
const dataLoginAD = JSON.parse(localStorage.getItem('dataLoginAD'));
const menuItems = {
  items: dataLoginAD ? [ThongKe, BanHangTaiQuay, dashboard, pages, utilities] : [BanHangTaiQuay, dashboard]
};

export default menuItems;