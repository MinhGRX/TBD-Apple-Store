import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import MauSac from 'views/mausac/mau-sac';
import AddMauSac from 'views/mausac/addMS';
import UpdateMS from 'views/mausac/updateMS';
import DonHang from 'views/donhang/don-hang';
import DonHangCT from 'views/donhang/don-hang-chi-tiet';
//chatlieu
import UpdateCL from 'views/chat-lieu/UpdateChatLieu';
// cổ áo
import AddCoAo from 'views/co-ao/addCoAo';
import UpdateCA from 'views/co-ao/UpdateCoAo';
import CoAo from 'views/co-ao/coAo';
import NhaSanXuat from 'views/nha-san-xuat/NSX';
import AddNSX from 'views/nha-san-xuat/NSXadd';
import UpdateNSX from 'views/nha-san-xuat/NSXupdate';

//
import AddKichCo from 'views/kich-co/addKichCo';
import BanHangTaiQuay from 'views/ban-hang-tai-quay/BanHangTaiQuay';
import HangLoi from 'views/hang-loi/HangLoi';
import DonHuyChuaHoan from 'views/don-huy-chua-hoan/donHuyChuaHoan';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));

//chatlieu
const AddChatLieu = Loadable(lazy(() => import('views/chat-lieu/addchatlieu')));
const ChatLieu = Loadable(lazy(() => import('views/chat-lieu/chatlieu')));

// Sản phẩm
const ChiTietSanPham = Loadable(lazy(() => import('views/san-pham/SanPham')));
const AddChiTietSanPham = Loadable(lazy(() => import('views/san-pham/AddSanPham')));
const UpdateSanPham = Loadable(lazy(() => import('views/san-pham/UpdateSanPham')));
// ==============================|| MAIN ROUTING ||============================== //

// Khuyen Mai
const KhuyenMai = Loadable(lazy(() => import('views/khuyen-mai/khuyen-mai')));
const AddKhuyenMai = Loadable(lazy(() => import('views/khuyen-mai/add')));
const UpdateKhuyenMai = Loadable(lazy(() => import('views/khuyen-mai/update')));

//Khách Hàng
const KhachHang = Loadable(lazy(() => import('views/khach-hang/index')));
const AddKhachHang = Loadable(lazy(() => import('views/khach-hang/addKhachHang')));
const UpdateKhachHang = Loadable(lazy(() => import('views/khach-hang/UpdateKhachHang')));

// Nhân Viên
const NhanVien = Loadable(lazy(() => import('views/nhanvien/NhanVien')));
const AddNhanVien = Loadable(lazy(() => import('views/nhanvien/addNhanVien')));
const UpdateNhanVien = Loadable(lazy(() => import('views/nhanvien/UpdateNhanVien')));

// ==============================|| MAIN ROUTING ||============================== //

//Loại Sản Phẩm
const LoaiSanPham = Loadable(lazy(() => import('views/loaisanpham/loaisanpham')));
const UpdateLSP = Loadable(lazy(() => import('views/loaisanpham/UpdateLSP')));
const AddLSP = Loadable(lazy(() => import('views/loaisanpham/AddLSP')));
// ==============================|| MAIN ROUTING ||============================== //

// kich co
const KichCo = Loadable(lazy(() => import('views/kich-co/KichCo')));
const UpdateKC = Loadable(lazy(() => import('views/kich-co/UpdateKichCo')));
// error
const Error = Loadable(lazy(() => import('views/errors/Error')));

// import { Navigate } from 'react-router';
const dataLoginAD = JSON.parse(localStorage.getItem('dataLoginAD'));
const dataLoginNV = JSON.parse(localStorage.getItem('dataLoginNV'));
// const dataLogin = JSON.parse(localStorage.getItem('dataLogin'));

const MainRoutes = {
  path: '/',
  element: dataLoginNV || dataLoginAD ? <MainLayout /> : '',
  children: [
    //đơn hàng
    {
      path: '/don-hang',
      element: dataLoginNV || dataLoginAD ? <DonHang /> : <Error />
    },
    {
      path: '/don-hang/chi-tiet/:id',
      element: dataLoginNV || dataLoginAD ? <DonHangCT /> : <Error />
    },
    {
      path: '/hang-loi',
      element: dataLoginNV || dataLoginAD ? <HangLoi /> : <Error />
    },
    {
      path: '/don-huy-chua-hoan-tien',
      element: dataLoginNV || dataLoginAD ? <DonHuyChuaHoan /> : <Error />
    },
    {
      path: '/san-pham',
      children: [
        {
          path: 'chi-tiet-san-pham',
          element: dataLoginAD ? <ChiTietSanPham /> : <Error />
        },
        {
          path: 'chi-tiet-san-pham/add',
          element: dataLoginAD ? <AddChiTietSanPham /> : <Error />
        },
        {
          path: 'chi-tiet-san-pham/detail/:id/:idSP',
          element: dataLoginAD ? <UpdateSanPham /> : <Error />
        },
        //màu sắc
        {
          path: 'mau-sac',
          element: dataLoginAD ? <MauSac /> : <Error />
        },
        {
          path: 'mau-sac/add',
          element: dataLoginAD ? <AddMauSac /> : <Error />
        },
        {
          path: 'mau-sac/detail/:id',
          element: dataLoginAD ? <UpdateMS /> : <Error />
        },
        {
          path: 'mau-sac/update/:id',
          element: dataLoginAD ? <UpdateMS /> : <Error />
        },
        {
          path: 'mau-sac/delete/:id',
          element: dataLoginAD ? <MauSac /> : <Error />
        },
        //kichco
        {
          path: 'kich-co',
          element: dataLoginAD ? <KichCo /> : <Error />
        },
        {
          path: 'kich-co/add',
          element: dataLoginAD ? <AddKichCo /> : <Error />
        },
        {
          path: 'kich-co/update/:id',
          element: dataLoginAD ? <UpdateKC /> : <Error />
        },
        {
          path: 'kich-co/delete/:id',
          element: dataLoginAD ? <KichCo /> : <Error />
        },
        {
          path: 'kich-co/detail/:id',
          element: dataLoginAD ? <UpdateKC /> : <Error />
        },
        //co ao
        {
          path: 'co-ao',
          element: dataLoginAD ? <CoAo /> : <Error />
        },
        {
          path: 'co-ao/add',
          element: dataLoginAD ? <AddCoAo /> : <Error />
        },
        {
          path: 'co-ao/detail/:id',
          element: dataLoginAD ? <UpdateCA /> : <Error />
        },
        {
          path: 'co-ao/update/:id',
          element: dataLoginAD ? <UpdateCA /> : <Error />
        },
        {
          path: 'co-ao/delete/:id',
          element: dataLoginAD ? <CoAo /> : <Error />
        },
        {
          path: 'chat-lieu',
          element: dataLoginAD ? <ChatLieu /> : <Error />
        },
        {
          path: 'chat-lieu/add',
          element: dataLoginAD ? <AddChatLieu /> : <Error />
        },
        {
          path: 'chat-lieu/detail/:id',
          element: dataLoginAD ? <UpdateCL /> : <Error />
        },
        {
          path: 'chat-lieu/update/:id',
          element: dataLoginAD ? <UpdateCL /> : <Error />
        },
        {
          path: 'chat-lieu/delete/:id',
          element: dataLoginAD ? <ChatLieu /> : <Error />
        },

        //Loại Sản Phẩm
        {
          path: 'loai-san-pham',

          element: dataLoginAD ? <LoaiSanPham /> : <Error />
        },
        //Nha San Xuat
        {
          path: 'nha-san-xuat',
          element: dataLoginAD ? <NhaSanXuat /> : <Error />
        },
        {
          path: 'nha-san-xuat/add',
          element: dataLoginAD ? <AddNSX /> : <Error />
        },
        {
          path: 'nha-san-xuat/detail/:id',
          element: dataLoginAD ? <UpdateNSX /> : <Error />
        },
        {
          path: 'nha-san-xuat/update/:id',
          element: dataLoginAD ? <UpdateNSX /> : <Error />
        },
        {
          path: 'loai-san-pham/add',
          element: dataLoginAD ? <AddLSP /> : <Error />
        },
        {
          path: 'loai-san-pham/detail/:id',
          element: dataLoginAD ? <UpdateLSP /> : <Error />
        },
        {
          path: 'loai-san-pham/update/:id',
          element: dataLoginAD ? <UpdateLSP /> : <Error />
        },
        {
          path: 'loai-san-pham/delete/:id',
          element: dataLoginAD ? <LoaiSanPham /> : <Error />
        }
        //====================
      ]
    },

    //khuyen mai
    {
      path: '/voucher',
      element: dataLoginAD ? <KhuyenMai /> : <Error />
    },
    {
      path: '/voucher/add',
      element: dataLoginAD ? <AddKhuyenMai /> : <Error />
    },
    {
      path: '/voucher/update/:id',
      element: dataLoginAD ? <UpdateKhuyenMai /> : <Error />
    },
    {
      path: '/voucher/detail/:id',
      element: dataLoginAD ? <UpdateKhuyenMai /> : <Error />
    },

    //Khách Hàng
    {
      path: '/khach-hang',
      element: dataLoginAD ? <KhachHang /> : <Error />
    },
    {
      path: '/khach-hang/add',
      element: dataLoginAD ? <AddKhachHang /> : <Error />
    },
    {
      path: '/khach-hang/detail/:id',
      element: dataLoginAD ? <UpdateKhachHang /> : <Error />
    },
    // {
    //   path: '/dia-chi/detail/:id',
    //   element: <UpdateKhachHang />
    // },
    {
      path: '/khach-hang/update/:id',
      element: dataLoginAD ? <UpdateKhachHang /> : <Error />
    },

    //Nhân Viên
    {
      path: '/nhan-vien/add',
      element: dataLoginAD ? <AddNhanVien /> : <Error />
    },
    {
      path: '/nhan-vien',
      element: dataLoginAD ? <NhanVien /> : <Error />
    },
    {
      path: '/nhan-vien/detail/:id',
      element: dataLoginAD ? <UpdateNhanVien /> : <Error />
    },
    {
      path: '/nhan-vien/update/:id',
      element: dataLoginAD ? <UpdateNhanVien /> : <Error />
    },
    //============//
    {
      path: '/thong-ke',
      element: dataLoginAD ? <DashboardDefault /> : <Error />
    },
    // Bán hàng tại quầy
    {
      path: '/ban-hang-tai-quay',
      element: dataLoginNV || dataLoginAD ? <BanHangTaiQuay /> : <Error />
    }
  ]
};

export default MainRoutes;