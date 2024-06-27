// assets
import { IconDashboard, IconShoppingCart, IconShirt, IconBuildingStore } from '@tabler/icons';

// constant
const icons = { IconDashboard, IconShirt, IconShoppingCart, IconBuildingStore };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const BanHangTaiQuay = {
  id: 'ban-hang-tai-quay',
  title: 'Bán hàng tại quầy',
  type: 'group',
  children: [
    {
      id: 'ban-hang-tai-quay',
      title: 'Bán hàng tại quầy',
      type: 'item',
      url: '/ban-hang-tai-quay',
      icon: icons.IconBuildingStore
    }
  ]
};

export default BanHangTaiQuay;