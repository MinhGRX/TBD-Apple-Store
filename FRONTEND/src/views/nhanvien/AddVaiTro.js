/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/prop-types */
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import '../../scss/AddQuickly.scss';
import { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';
import { fetchAllList, deleteVT, searchVT, detailVT, putUpdateVT } from 'services/ServiceVaiTro';
import UpdateModal from './UpdateVaiTro'; // Đảm bảo đường dẫn đúng đến UpdateModal.js

function MyVerticallyCenteredModal(props) {
  const { onHide, handleSubmit, values, setValues } = props;
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState();
  const [dataDelete, setDataDelete] = useState({
    ma: ''
  });

  useEffect(() => {
    getAll(0);
    setDataDelete();
  }, []);

  const getAll = async (page) => {
    setCurrentPage(page);
    const res = await fetchAllList(page);
    if (res && res.data) {
      const newData = res.data.content;
      setData(newData);
      setTotalPages(res.data.totalPages);
      console.log(data);
    }
  };

  const search = async (key, trangThai, page) => {
    const res = await searchVT(key, trangThai, page);
    if (res) {
      setData(res.data.content);
      setTotalPages(res.data.totalPages);
    }
  };

  const handleSearchVT = _.debounce(async (e) => {
    let term = e.target.value;
    if (term || filterStatus !== 0) {
      search(term, filterStatus, currentPage);
    } else {
      search('', 0, currentPage);
    }
  }, 100);

  const handlePageClick = (event) => {
    const selectedPage = event.selected;
    if (filterStatus === '') {
      getAll(selectedPage);
    } else {
      search('', filterStatus, selectedPage);
    }
  };

  const del = async (id, values) => {
    const res = await deleteVT(id, values);
    if (res) {
      toast.success('Xóa thành công !');
      getAll(0);
    }
  };

  const handleSubmitVT = (id) => {
    del(id, dataDelete);
  };

  //Update:
  const [modalShow, setModalShow] = useState(false);
  const [valuesVT, setValuesVT] = useState({
    ten: '',
    trangThai: 1
  });

  const closeModal = () => {
    setModalShow(false);
    setValuesVT({
      ten: '',
      trangThai: 1
    });
  };

  const handleEdit = async (idVT) => {
    const response = await detailVT(idVT);
    if (response) {
      setValuesVT({
        id: idVT,
        ten: response.data.ten,
        trangThai: response.data.trangThai
      });
      setModalShow(true);
    }
  };

  const put = async (idVT, value) => {
    const res = await putUpdateVT(idVT, value);
    if (res) {
      toast.success('Cập nhật thành công !');
      closeModal();
      getAll(0);
    }
  };

  const handleSubmitUpdate = (event) => {
    event.preventDefault();
    const idVT = valuesVT.id; // Lấy giá trị id từ valuesVT
    put(idVT, valuesVT);
  };

  return (
    <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Vai Trò</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form className="row g-3" onSubmit={handleSubmit}>
          <div className="col-md-6">
            <label htmlFor="ten" className="form-label"></label>
            <input
              placeholder=" Nhập tên vai trò muốn thêm"
              type="text"
              className="form-control"
              id="ten"
              value={values.ten}
              onChange={(e) => setValues({ ...values, ten: e.target.value })}
            />
          </div>
          <div className="col-4" style={{ marginTop: '30px' }}>
            <div className="form-inline">
              <label style={{ fontWeight: 'bold' }} className="form-label me-3" htmlFor="inlineRadio">
                Trạng thái:
              </label>
              <br />
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="inlineRadioOptions"
                  id="inlineRadio1"
                  value="1"
                  checked={true}
                  onChange={() => setValues({ ...values, trangThai: 1 })}
                />
                <label className="form-check-label" htmlFor="inlineRadio1">
                  Kích hoạt
                </label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input pb-2"
                  type="radio"
                  name="inlineRadioOptions"
                  id="inlineRadio2"
                  value="0"
                  onChange={() => setValues({ ...values, trangThai: 0 })}
                />
                <label className="form-check-label" htmlFor="inlineRadio2">
                  Ngừng kích hoạt
                </label>
              </div>
            </div>
          </div>
          <div className="col-2" style={{ textAlign: 'center', marginTop: '36px' }}>
            <Button type="submit" className="btn btn-primary" onClick={onHide}>
              Thêm
            </Button>
          </div>
        </form>

        {/* //Hiển thị danh sách */}
        <div className="w-auto rounded bg-white border shadow p-4">
          <div className="d-flex justify-content-between">
            <div className="search">
              <input
                style={{ borderRadius: 15, width: 200 }}
                type="text"
                className="input-search"
                placeholder=" Nhập tên, mã vai trò cần tìm..."
                onChange={handleSearchVT}
              />
            </div>
            <div style={{ marginRight: 50 }}>
              <span style={{ fontWeight: 'bold', marginRight: 25 }} className="form-check-label">
                Trạng Thái:
              </span>

              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="inlineRadioOptions"
                  id="inlineRadio1"
                  checked={filterStatus === ''}
                  onChange={() => {
                    setFilterStatus('');
                    search('', '', 0);
                  }}
                />
                <span style={{ marginLeft: 10 }} className="form-check-label">
                  Tất Cả
                </span>
              </div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="inlineRadioOptions"
                  id="inlineRadio1"
                  checked={filterStatus === 1}
                  onChange={() => {
                    setFilterStatus(1);
                    search('', 1, 0);
                  }}
                />
                <span className="form-check-label">Đang kích hoạt</span>
              </div>
              <div style={{ marginLeft: 10 }} className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="inlineRadioOptions"
                  id="inlineRadio2"
                  checked={filterStatus === 0}
                  onChange={() => {
                    setFilterStatus(0);
                    search('', 0, 0);
                  }}
                />
                <span className="form-check-label">Ngừng kích hoạt</span>
              </div>
            </div>
          </div>

          <table style={{ textAlign: 'center', marginTop: 30 }} className="table table-hover">
            <tr>
              <th>#</th>
              <th>Mã</th>
              <th>Tên Vai Trò</th>
              <th>Trạng Thái</th>
              <th>Action</th>
            </tr>
            <tbody>
              {data.map((d, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td> {d.ma}</td>
                  <td>{d.ten}</td>
                  <td>{d.trangThai === 1 ? 'Đang kích hoạt' : 'Ngừng kích hoạt'}</td>
                  <td>
                    <button
                      onClick={() => handleEdit(d.id)}
                      style={{ color: 'aqua' }}
                      className="fa-regular fa-pen-to-square fa-lg fa-khenh"
                    ></button>

                    <button
                      onClick={() => handleSubmitVT(d.id, { ma: d.ma })}
                      style={{ color: '#ff1744' }}
                      className="fa-solid fa-trash fa-khenh"
                    ></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <ReactPaginate
            breakLabel="..."
            nextLabel=">"
            onPageChange={handlePageClick}
            pageRangeDisplayed={5}
            pageCount={totalPages}
            previousLabel="<"
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousClassName="page-item"
            previousLinkClassName="page-link"
            nextClassName="page-item"
            nextLinkClassName="page-link"
            breakClassName="page-item"
            breakLinkClassName="page-link"
            containerClassName="pagination justify-content-center"
            activeClassName="active"
          />

          <UpdateModal
            show={modalShow}
            handleClose={closeModal}
            onHide={() => setModalShow(false)}
            handleUpdate={handleSubmitUpdate}
            values={valuesVT}
            setValues={setValuesVT}
          />
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default MyVerticallyCenteredModal;