// assets
import { IconShirt } from '@tabler/icons';

// constant
const icons = {
  IconShirt
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //
const pages = {
  id: 'san-pham',
  title: 'Sản phẩm',
  type: 'group',
  children: [
    {
      id: 'san-pham',
      title: 'Quản lý sản phẩm',
      type: 'collapse',
      icon: icons.IconShirt,
      children: [
        {
          id: 'san-pham',
          title: 'Sản phẩm',
          type: 'item',
          url: '/san-pham/chi-tiet-san-pham',
          breadcrumbs: false
        },
        {
          id: 'mau-sac',
          title: 'Màu sắc',
          type: 'item',
          url: '/san-pham/mau-sac',
          breadcrumbs: false
        },
        {
          id: 'kich-co',
          title: 'Kích cỡ',
          type: 'item',
          url: '/san-pham/kich-co',
          breadcrumbs: false
        },
        {
          id: 'co-ao',
          title: 'Cổ áo',
          type: 'item',
          url: '/san-pham/co-ao',
          breadcrumbs: false
        },
        {
          id: 'chat-lieu',
          title: 'Chất liệu',
          type: 'item',
          url: '/san-pham/chat-lieu',
          breadcrumbs: false
        },
        {
          id: 'nha-san-xuat',
          title: 'Nhà sản xuất',
          type: 'item',
          url: '/san-pham/nha-san-xuat',
          breadcrumbs: false
        },
        {
          id: 'loai-san-pham',
          title: 'Loại sản phẩm',
          type: 'item',
          url: '/san-pham/loai-san-pham',
          breadcrumbs: false
        }
      ]
    }
  ]
};

export default pages;