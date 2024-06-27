
import { lazy } from 'react';
// project imports
import Loadable from 'ui-component/Loadable';
import CheckThanhToan from 'ui-component/checkout/CheckVNP/CheckThanhToan';
import ThanhToanThatBai from 'ui-component/checkout/CheckVNP/ThanhToanThatBai';
import ChiTietDonHang from 'ui-component/login/ChiTietDonHang';

// login option 3 routing
const TrangChu = Loadable(lazy(() => import('views/home/TrangChu')));
const SanPham = Loadable(lazy(() => import('views/sanpham/SanPham')));
const Detail = Loadable(lazy(() => import('views/sanpham/DetailSanPham')));
const GioHang = Loadable(lazy(() => import('views/giohang/GioHang')));
const CheckOut = Loadable(lazy(() => import('views/checkout/CheckOut')));
const ThankYou = Loadable(lazy(() => import('ui-component/checkout/ThankYou')));
const CheckOutQuick = Loadable(lazy(() => import('views/checkout/CheckOutQuick')));
const Login = Loadable(lazy(() => import('views/login')));
const UserAccount = Loadable(lazy(() => import('ui-component/login/information_user')));

const DiaChi = Loadable(lazy(() => import('ui-component/login/diachi')));
const History = Loadable(lazy(() => import('ui-component/login/lichsudonhang')));
const Loading = Loadable(lazy(() => import('ui-component/checkout/LoadingPay')));
const ChinhSach = Loadable(lazy(() => import('ui-component/trangchu/chinhsach')));
// ==============================|| AUTHENTICATION ROUTING ||============================== //

// import { Navigate } from 'react-router';
// const dataLogin = JSON.parse(localStorage.getItem('dataLogin'));

const AuthenticationRoutes = {
  path: '/',
  children: [
    {
      path: '/trang-chu',
      element: <TrangChu />
    },
    {
      path: '/san-pham/web',
      element: <SanPham />
    },
    {
      path: '/san-pham/web/:productName',
      element: <SanPham />
    },
    {
      path: '/detail/:id/:idSP/:idMS',
      element: <Detail />
    },
    {
      path: '/gio-hang',
      element: <GioHang />
    },
    {
      path: '/checkout/:id',
      element: <CheckOut />
    },
    {
      path: '/checkoutquick/:id',
      element: <CheckOutQuick />
    },
    {
      path: '/checkout/thankyou',
      element: <ThankYou />
    },
    {
      path: '/login',
      element: <Login />
    },
    {
      path: '/error',
      element: <Login />
    },
    {
      path: '/thong-tin_user',
      element: <UserAccount />
    },
    {
      path: '/diachi',
      element: <DiaChi />
    },
    {
      path: '/history',
      element: <History />
    },
    {
      path: '/history/:id',
      element: <ChiTietDonHang />
    },
    {
      path: '/khachhang-info/:id',
      element: <UserAccount />
    },
    {
      path: '/khachhang-doiMatKhau/:id',
      element: <UserAccount />
    },
    {
      path: '/loading',
      element: <Loading />
    },
    {
      path: '/chinh-sach',
      element: <ChinhSach />
    },
    {
      path: '/check-vnp',
      element: <CheckThanhToan />
    },
    {
      path: '/pay-error',
      element: <ThanhToanThatBai />
    }
  ]
};

export default AuthenticationRoutes;
