/* eslint-disable react/prop-types */
import { Modal } from 'react-bootstrap';

function ModalUpdateKH({ show, handleClose, handleAddKH, setValuesKH, valuesKH }) {
  return (
    <Modal
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      style={{ marginLeft: 150, paddingBottom: 110 }}
      show={show}
      onHide={handleClose}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter" style={{ marginLeft: 290 }}>
          Cập nhật khách hàng
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form className="needs-validation" noValidate onSubmit={handleAddKH}>
          <div className="row">
            <div className="col-6">
              <div className="form-group row">
                <label style={{ fontWeight: 'bold' }} htmlFor="tenNguoiNhan" className="col-sm-3 col-form-label">
                  Mã KH:
                </label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Mã mặc định"
                    value={valuesKH.maKhachHang}
                    onChange={(e) => {
                      setValuesKH({ ...valuesKH, maKhachHang: e.target.value });
                    }}
                  />
                </div>
              </div>
              <br></br>
              <div className="form-group row">
                <label style={{ fontWeight: 'bold' }} htmlFor="tenNguoiNhan" className="col-sm-3 col-form-label">
                  Họ Và Tên:
                </label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control"
                    // name="tenKhachHang"
                    placeholder=""
                    value={valuesKH.tenKhachHang}
                    onChange={(e) => {
                      setValuesKH({ ...valuesKH, tenKhachHang: e.target.value });
                    }}
                  />
                  {/* {!none && <div style={{ color: 'red' }}>Tên người nhận không được để trống !</div>}
                    {!none1 && <div style={{ color: 'red' }}>Tên người nhận không được quá 20 ký tự và phải là chữ !</div>} */}
                </div>
              </div>
              <br></br>
              <div className="form-group row">
                <label style={{ fontWeight: 'bold' }} htmlFor="soDienThoai" className="col-sm-3 col-form-label">
                  Số ĐT:
                </label>
                <div className="col-sm-9">
                  <input
                    type="tel"
                    className="form-control"
                    // name="soDienThoai"
                    placeholder=""
                    value={valuesKH.sdt}
                    onChange={(e) => {
                      setValuesKH({ ...valuesKH, sdt: e.target.value });
                    }}
                  />
                  {/* {!none2 && <div style={{ color: 'red' }}>Số điện thoại không được để trống !</div>}
                    {!none3 && (
                      <div style={{ color: 'red' }}>Số điện thoại phải là số, bắt đầu bằng số 0 và phải đúng 10 số !</div>
                    )} */}
                </div>
              </div>
            </div>
            <div className="col-6">
              <div className="form-group row">
                <label style={{ fontWeight: 'bold' }} htmlFor="tenNguoiNhan" className="col-sm-3 col-form-label">
                  Email:
                </label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control"
                    // name="email"
                    placeholder=""
                    value={valuesKH.email}
                    onChange={(e) => {
                      setValuesKH({ ...valuesKH, email: e.target.value });
                    }}
                  />
                </div>
              </div>
              <br></br>
              <div className="form-group row">
                <label style={{ fontWeight: 'bold' }} htmlFor="tenNguoiNhan" className="col-sm-3 col-form-label">
                  Giới Tính:
                </label>
                <div className="col-sm-9">
                  <div style={{ marginTop: 5 }} className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="gt"
                      checked={valuesKH.gioiTinh === true}
                      onChange={() => {
                        setValuesKH({ ...valuesKH, gioiTinh: true });
                      }}
                    />
                    <span style={{ marginLeft: 5 }} className="form-check-label">
                      Nam
                    </span>
                  </div>
                  <div style={{ marginLeft: 15 }} className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="gt"
                      checked={valuesKH.gioiTinh === false}
                      onChange={() => {
                        setValuesKH({ ...valuesKH, gioiTinh: false });
                      }}
                    />
                    <span style={{ marginLeft: 5 }} className="form-check-label">
                      Nữ
                    </span>
                  </div>
                </div>
              </div>
              <br></br>
              <div className="form-group row">
                <label style={{ fontWeight: 'bold' }} htmlFor="soDienThoai" className="col-sm-3 col-form-label">
                  Ngày sinh:
                </label>
                <div className="col-sm-9">
                  <input
                    type="datetime-local"
                    className="form-control"
                    value={valuesKH.ngaySinh}
                    onChange={(e) => {
                      setValuesKH({ ...valuesKH, ngaySinh: e.target.value });
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <br></br>
          <div className="text-center">
            <button
              // onClick={handleAddKH}
              // type="submit"
              className="btn btn-labeled shadow-button"
              style={{
                background: 'deepskyblue',
                borderRadius: '50px',
                border: '1px solid black',
                justifyItems: 'center'
              }}
            >
              <span
                style={{
                  marginBottom: '3px',
                  color: 'white',
                  fontSize: '15px',
                  fontWeight: 'bold'
                }}
                className="btn-text"
              >
                Cập nhật
              </span>
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}

export default ModalUpdateKH;