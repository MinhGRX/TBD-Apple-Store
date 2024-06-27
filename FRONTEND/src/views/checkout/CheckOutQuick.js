
import CheckoutForm from 'ui-component/checkout/CheckOut';
import { deleteByIdHD } from 'services/GioHangService';
import { useParams } from 'react-router';

function CheckOutQuick() {
  // const navigate = useNavigate();
  const { id } = useParams();
  const dataLogin = JSON.parse(localStorage.getItem('dataLogin'));
  const idGH = localStorage.getItem('idGH') || '';
  const handleBackToCart = () => {
    backToCart(id);
  };

  const backToCart = async (idHD) => {
    try {
      const res = await deleteByIdHD(idHD);
      if (res) {
        // Sử dụng window.history để quay lại trang trước đó
        window.history.back();
        setDataHDCT(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <CheckoutForm dataLogin={dataLogin} idGH={idGH} handleBackToCart={handleBackToCart} label={'Quay về trang sản phẩm'} />
    </div>
  );
}
export default CheckOutQuick;
