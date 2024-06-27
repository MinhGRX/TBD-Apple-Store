
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/prop-types */
import { Button, Modal } from 'react-bootstrap';
import { deleteNhanVien } from 'service/KhachHangService';
import { toast } from 'react-toastify';

const deleteNV = (props) => {
  const { handleClose, show, dataDelete, getAll } = props;

  const handleConfirm = async () => {
    let res = await deleteNhanVien(dataDelete);
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

export default deleteNV;

// /* eslint-disable react/react-in-jsx-scope */
// /* eslint-disable react/prop-types */
// import { useEffect } from "react";
// import { Button, Modal } from "react-bootstrap";
// import { useParams } from "react-router-dom";
// import { toast } from "react-toastify";
// import { deleteNhanVien } from "service/ServiceNhanVien";

// const ConfirmDelete = ({ handleClose, show, dataDelete, getAll }) => {

//   const { id } = useParams();

//   const handleConfirm = async (id) => {
//     let res = await deleteNhanVien(dataDelete.id); // Truyền dataDelete.id vào hàm deleteMS
//     if (res) {
//       toast.success("Delete success!");
//       handleClose();
//       getAll(0);
//     } else {
//       toast.error("Error!");
//     }
//   };

//   return (
//     <div>
//       <Modal
//         show={show}
//         onHide={handleClose}
//         backdrop="static"
//         keyboard={false}
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>Thông báo</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <div className="body-add-new">Bạn có chắc muốn xoá không?</div>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleClose}>
//             Đóng
//           </Button>
//           <Button variant="danger" onClick={handleConfirm}>
//             Xoá
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };
// export default ConfirmDelete;
