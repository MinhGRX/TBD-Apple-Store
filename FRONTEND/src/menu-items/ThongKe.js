// assets
import { IconDashboard, IconShoppingCart, IconShirt, IconSatellite } from '@tabler/icons';

// constant
const icons = { IconDashboard, IconShirt, IconShoppingCart, IconSatellite };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const ThongKe = {
  id: 'thong-ke',
  title: 'Thống kê',
  type: 'group',
  children: [
    {
      id: 'thong-ke',
      title: 'Thống kê',
      type: 'item',
      url: '/thong-ke',
      icon: icons.IconDashboard
    }
  ]
};

export default ThongKe;