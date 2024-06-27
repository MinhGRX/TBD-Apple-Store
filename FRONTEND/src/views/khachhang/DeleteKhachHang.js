/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/prop-types */
import { Button, Modal } from 'react-bootstrap';
import { deleteKH } from 'service/KhachHangService';
import { toast } from 'react-toastify';

const DeleteKhachHang = (props) => {
  const { handleClose, show, dataDelete, getAll } = props;

  const handleConfirm = async () => {
    let res = await deleteKH(dataDelete);
    if (res) {
      toast.success('Delete success!');
      handleClose();
      getAll();
    } else {
      toast.error('Error!');
    }
  };

  return (
    <div>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Thông báo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="body-add-new">Bạn có muốn xóa khách hàng này không?</div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Đóng
          </Button>
          <Button variant="danger" onClick={() => handleConfirm()}>
            Xoá
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DeleteKhachHang;