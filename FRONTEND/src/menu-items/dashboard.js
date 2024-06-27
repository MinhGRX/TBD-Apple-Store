// assets
import { IconDashboard, IconShoppingCart, IconShirt, IconShirtOff } from '@tabler/icons';

// constant
const icons = { IconDashboard, IconShirt, IconShoppingCart, IconShirtOff };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
  id: 'don-hang',
  title: 'Đơn hàng',
  type: 'group',
  children: [
    {
      id: 'don-hang',
      title: 'Quản lý đơn hàng',
      type: 'item',
      url: '/don-hang',
      icon: icons.IconShoppingCart,
      breadcrumbs: false
    },
    {
      id: 'don-huy-chua-hoan-tien',
      title: 'Đơn huỷ chưa hoàn tiền',
      type: 'item',
      url: '/don-huy-chua-hoan-tien',
      icon: icons.IconShirt
    },
    {
      id: 'hang-loi',
      title: 'Hàng lỗi',
      type: 'item',
      url: '/hang-loi',
      icon: icons.IconShirtOff
    }
  ]
};

export default dashboard;