import CheckoutForm from 'ui-component/checkout/CheckOut';
import { backToGH } from 'services/GioHangService';
import { useNavigate, useParams } from 'react-router';

function Checkout() {
  const navigate = useNavigate();
  const dataLogin = JSON.parse(localStorage.getItem('dataLogin'));
  const idGH = localStorage.getItem('idGH') || '';
  const { id } = useParams();
  const handleBackToCart = () => {
    backToCart(id);
  };

  const backToCart = async (idHD) => {
    try {
      const res = await backToGH(idHD);
      if (res) {
        navigate('/gio-hang');
        setDataHDCT(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <CheckoutForm dataLogin={dataLogin} idGH={idGH} handleBackToCart={handleBackToCart} label={'Quay về giỏ hàng'} />
    </div>
  );
}
export default Checkout;