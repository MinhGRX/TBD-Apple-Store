import { useState } from 'react';
import '../../scss/ContentCart.scss';
import { Button } from 'react-bootstrap';
import { Image } from 'react-bootstrap';

function Content() {
  // const [cartItems, setCartItems] = useState([
  //   { id: 1, name: 'Product 1', price: 10, quantity: 2 }
  //   // { id: 2, name: 'Product 2', price: 20, quantity: 1 },
  //   // { id: 3, name: 'Product 3', price: 15, quantity: 3 }
  // ]);

  // const removeItem = (itemId) => {
  //   const updatedCartItems = cartItems.filter((item) => item.id !== itemId);
  //   setCartItems(updatedCartItems);
  // };

  // const updateQuantity = (itemId, newQuantity) => {
  //   const updatedCartItems = cartItems.map((item) => {
  //     if (item.id === itemId) {
  //       return { ...item, quantity: newQuantity };
  //     }
  //     return item;
  //   });
  //   setCartItems(updatedCartItems);
  // };

  // const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  // return (
  //   <div className="cart-container">
  //     <h2>Giỏ hàng</h2>
  //     {cartItems.length === 0 ? (
  //       <Button href="trang-chu">Mời bạn tiếp tục mua sắm</Button>
  //     ) : (
  //       <div className="cart">
  //         <div className="image-container">
  //           <Image className="cart-image" src="https://th.bing.com/th/id/OIP.SfmmSX0rhS_GsEKBHY_miAAAAA?pid=ImgDet&rs=1"></Image>
  //         </div>
  //         <div className="title">
  //           <ul className="cart-items">
  //             {cartItems.map((item) => (
  //               <li key={item.id} className="cart-item">
  //                 <div className="item-info">
  //                   <span className="item-name">{item.name}</span>
  //                   <span className="item-price">Đơn giá: {item.price}</span>
  //                   <span className="item-quantity">Số lượng: {item.quantity}</span>
  //                 </div>

  //                 <div className="item-actions">
  //                   <button className="item-remove" onClick={() => removeItem(item.id)}>
  //                     Xóa
  //                   </button>
  //                   <input
  //                     type="number"
  //                     min="1"
  //                     value={item.quantity}
  //                     onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
  //                     className="item-quantity-input"
  //                   />
  //                 </div>
  //               </li>
  //             ))}
  //           </ul>
  //         </div>
  //         <div className="count">
  //           <ul className="cart-sums">
  //             {cartItems.map((item) => (
  //               <li key={item.id} className="cart-sums">
  //                 <div className="item-information">
  //                   <span className="item-quantity">Số lượng: {item.quantity}</span>
  //                 </div>

  //                 <div className="item-actions">
  //                   <button className="item-remove" onClick={() => removeItem(item.id)}>
  //                     Xóa
  //                   </button>
  //                   <input
  //                     type="number"
  //                     min="1"
  //                     value={item.quantity}
  //                     onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
  //                     className="item-quantity-input"
  //                   />
  //                 </div>
  //               </li>
  //             ))}
  //           </ul>
  //         </div>
  //         <p className="total-amount">Tổng thành tiền: {totalAmount}</p>
  //       </div>
  //     )}
  //   </div>
  // );
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Product 1', price: 10, quantity: 2, image: 'product1.jpg' },
    { id: 2, name: 'Product 2', price: 20, quantity: 1, image: 'product2.jpg' },
    { id: 3, name: 'Product 3', price: 15, quantity: 3, image: 'product3.jpg' }
  ]);

  const removeItem = (itemId) => {
    const updatedCartItems = cartItems.filter((item) => item.id !== itemId);
    setCartItems(updatedCartItems);
  };

  const updateQuantity = (itemId, newQuantity) => {
    const updatedCartItems = cartItems.map((item) => {
      if (item.id === itemId) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setCartItems(updatedCartItems);
  };

  const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
  const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const shippingCost = 5;
  const currency = 'VND';

  const handleSelectVoucher = () => {
    // Handle voucher selection event
  };

  return (
    <div className="cart-container">
      <h2>Giỏ hàng</h2>
      {cartItems.length === 0 ? (
        <p>Mời bạn tiếp tục mua sắm</p>
      ) : (
        <div className="cart">
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="item-image">
                  <Image className="image" src="https://th.bing.com/th/id/OIP.SfmmSX0rhS_GsEKBHY_miAAAAA?pid=ImgDet&rs=1" />
                </div>
                <div className="item-details">
                  <p className="item-name">{item.name}</p>
                  <p className="item-price">Đơn giá: {item.price}</p>
                  <div className="item-actions">
                    <button className="item-remove" onClick={() => removeItem(item.id)}>
                      <i style={{ color: '#ff1744' }} className="fa-solid fa-trash"></i>
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                      className="item-quantity-input"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <div className="summary-details">
              <p className="summary-item">Tổng số lượng: {totalQuantity}</p>
              <p className="summary-item">Chi phí vận chuyển: {shippingCost}</p>
              <p className="summary-item">Đơn vị tiền tệ: {currency}</p>
              <Button className="coupon-button" onClick={handleSelectVoucher}>
                <i className="fa-solid fa-ticket-alt"></i>
                Phiếu giảm giá
              </Button>
            </div>
            <p className="total-amount">Tổng thành tiền: {totalAmount + shippingCost}</p>
            <div className="checkout-buttons">
              <Button className="checkout-button">Thanh toán</Button>
              <Button className="continue-shopping-button" href="trang-chu">
                Quay về mua sắm
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Content;