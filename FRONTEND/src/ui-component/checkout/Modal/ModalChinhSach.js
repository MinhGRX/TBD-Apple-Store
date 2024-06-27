/* eslint-disable react/prop-types */

import Modal from 'react-bootstrap/Modal';

function ModalChinhSach({ handleClose, show }) {
  return (
    <>
      <Modal show={show} size="md" onHide={handleClose} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Chính sách</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>1, Đổi hàng trong vòng 15 ngày </p>
          <p>2, Đơn hàng khi có mã khuyễn mãi thì sẽ mất mã khuyễn mãi đó khi đổi</p>
          <p>3, Hoá đơn chỉ được đổi 1 lần duy nhất</p>
          <p>4, Phí gửi hàng sẽ do người mua trả</p>
          <p>5, Chỉ có thể đổi hàng với đơn hàng được mua tại quầy</p>
          <p>6, Đổi hàng cần phải có hoá đơn</p>
          <p>7, Nếu hàng bị hỏng hoặc lỗi thì cần phải có bằng chứng để đổi hàng</p>
          <p>8, Nếu số lượng hàng còn ít thì khách hàng mua tại cửa hàng sẽ được ưu tiên</p>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ModalChinhSach;