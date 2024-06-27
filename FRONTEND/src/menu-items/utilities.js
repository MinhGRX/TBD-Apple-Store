// assets
import { IconTypography, IconPalette, IconShadow, IconWindmill, IconTicket, IconUsers, IconUserSearch } from '@tabler/icons';

// constant
const icons = {
  IconTypography,
  IconPalette,
  IconShadow,
  IconWindmill,
  IconTicket,
  IconUsers,
  IconUserSearch
};

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const utilities = {
  id: 'other',
  title: 'Khác',
  type: 'group',
  children: [
    {
      id: 'util-typography',
      title: 'Voucher',
      type: 'item',
      url: '/voucher',
      icon: icons.IconTicket,
      breadcrumbs: false
    },
    {
      id: 'util-color',
      title: 'Nhân viên',
      type: 'item',
      url: '/nhan-vien',
      icon: icons.IconUserSearch,
      breadcrumbs: false
    },
    {
      id: 'util-shadow',
      title: 'Khách hàng',
      type: 'item',
      url: '/khach-hang',
      icon: icons.IconUsers,
      breadcrumbs: false
    }
  ]
};

export default utilities;