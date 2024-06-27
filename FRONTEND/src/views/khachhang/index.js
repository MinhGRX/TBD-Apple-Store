import { useEffect, useState } from 'react';
// import ReactPaginate from 'react-paginate';
import MainCard from 'ui-component/cards/MainCard';
import { Avatar, Card, Pagination } from '@mui/material';
import { getAllPageKH, deleteKH, searchKh } from 'services/KhachHangService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
// import DeleteKhachHang from "./DeleteKhachHang";
import '../../scss/MauSac.scss';

const KhachHang = () => {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState(' ');
  const [filterGender, setFilterGender] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  // const [isShow, setIsShow] = useState(false)
  // const [dataDelete, setDataDelete] = useState({
  //   ma: ""
  // })

  useEffect(() => {
    getAll(0);
  }, []);

  const getAll = async (page) => {
    const res = await getAllPageKH(page);
    if (res && res.data) {
      setData(res.data.content);
      setTotalPages(res.data.totalPages);
    }
  };

  const del = async (id) => {
    const res = await deleteKH(id);
    if (res) {
      toast.success('Xóa thành công!');
      getAll(0);
    }
  };

  const handleFilterGenderChange = (selectedGender) => {
    setFilterGender(selectedGender);
    search(searchTerm, filterStatus, selectedGender, 0);
  };

  const handleFilterStatusChange = (status) => {
    setFilterStatus(status);
    search(searchTerm, status, filterGender, 0);
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    search(term, filterStatus, filterGender, 0);
  };

  const search = async (term, trangThai, gioiTinh, page) => {
    const res = await searchKh(term, trangThai, gioiTinh, page);
    if (res && res.data) {
      setData(res.data.content);
      setTotalPages(res.data.totalPages);
    }
  };

  const handleDeleteKH = (id) => {
    del(id);
  };

  const handlePageClick = (event) => {
    getAll(event.selected);
  };

  function formatDate(dateString) {
    const dateObject = new Date(dateString);

    const day = dateObject.getDate();
    const month = dateObject.getMonth() + 1; // Tháng bắt đầu từ 0, cần cộng thêm 1
    const year = dateObject.getFullYear();

    const formattedDate = `${day}/${month}/${year}`;

    return formattedDate;
  }

  return (
    <div>
      <MainCard>
        <Card>
          <div className="w-auto rounded bg-white border shadow p-4">
            <div className="d-flex justify-content-between">
              <div className="search">
                <input
                  style={{ borderRadius: 15, width: 300 }}
                  type="text"
                  className="input-search"
                  value={searchTerm}
                  placeholder="Nhập tên, mã khách hàng cần tìm..."
                  onChange={handleSearch}
                />
              </div>
              <div>
                <div style={{ paddingBottom: 10 }}>
                  <label htmlFor="all" style={{ fontWeight: 'bold', marginRight: 25 }} className="form-check-label">
                    Giới tính:
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="genderOptions"
                    id="all"
                    checked={filterGender === ''}
                    onChange={() => handleFilterGenderChange('')}
                  />
                  <label htmlFor="all" style={{ marginLeft: 10 }} className="form-check-label">
                    Tất Cả
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="genderOptions"
                    id="male"
                    checked={filterGender === true}
                    onChange={() => handleFilterGenderChange(true)}
                  />
                  <label htmlFor="male" className="form-check-label">
                    Nam
                  </label>
                </div>
                <div style={{ marginLeft: 10 }} className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="genderOptions"
                    id="female"
                    checked={filterGender === false}
                    onChange={() => handleFilterGenderChange(false)}
                  />
                  <label htmlFor="female" className="form-check-label">
                    Nữ
                  </label>
                </div>
              </div>
              <div style={{ marginRight: 50 }}>
                <div style={{ paddingBottom: 10 }}>
                  <label htmlFor="all" style={{ fontWeight: 'bold', marginRight: 25 }} className="form-check-label">
                    Trạng Thái:
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="inlineRadioOptions"
                    id="all"
                    checked={filterStatus === ''}
                    onChange={() => handleFilterStatusChange('')}
                  />
                  <label htmlFor="all" style={{ marginLeft: 10 }} className="form-check-label">
                    Tất Cả
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="inlineRadioOptions"
                    id="inactive"
                    checked={filterStatus === 0}
                    onChange={() => handleFilterStatusChange(0)}
                  />
                  <label htmlFor="inactive" className="form-check-label">
                    Không hoạt động
                  </label>
                </div>
                <div style={{ marginLeft: 10 }} className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="inlineRadioOptions"
                    id="active"
                    checked={filterStatus === 1}
                    onChange={() => handleFilterStatusChange(1)}
                  />
                  <label htmlFor="active" className="form-check-label">
                    Hoạt động
                  </label>
                </div>
              </div>
              <div color="blue">
                <button className="btn btn-primary" onClick={() => navigate('/khach-hang/add')}>
                  Thêm <i className="fa-solid fa-plus fa-beat fa-lg"></i>
                </button>
              </div>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Mã</th>
                  <th>Tên</th>
                  <th>Email</th>
                  <th>SĐT</th>
                  <th>Ngày sinh</th>
                  <th>Giới tính</th>
                  <th>Ảnh</th>
                  <th>Trạng thái</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {data.map((d, i) => (
                  <tr key={d.id}>
                    <td>{i + 1}</td>
                    <td>{d.maKhachHang}</td>
                    <td>{d.tenKhachHang}</td>
                    <td>{d.email}</td>
                    <td>{d.sdt}</td>
                    <td>{formatDate(d.ngaySinh)}</td>
                    <td>{d.gioiTinh === true ? 'Nam' : 'Nữ'}</td>
                    <td>
                      <Avatar
                        alt={d.tenKhachHang}
                        src={`http://localhost:8080/api/khach-hang/getAll/${d.id}`}
                        sx={{ width: 80, height: 80 }}
                      />
                      {/* <img src={`http://localhost:8080/api/khach-hang/getAll/${d.id}`} alt="" style={{ width: '90px', height: '100px' }} /> */}
                    </td>
                    <td>{d.trangThai === 0 ? 'Không hoạt động' : 'Hoạt động'}</td>
                    <td>
                      <button
                        className="mx-2 fa-khenh"
                        onClick={() =>
                          navigate(
                            `/khach-hang/detail/${d.id}?imageURL=${encodeURIComponent(
                              `http://localhost:8080/api/khach-hang/getAll/${d.id}`
                            )}`
                          )
                        }
                      >
                        <i style={{ color: 'aqua' }} className="fa-regular fa-pen-to-square fa-lg fa-khenh"></i>
                      </button>
                      <button className="mx-2 fa-khenh" onClick={() => handleDeleteKH(d.id)}>
                        <i style={{ color: '#ff1744' }} className="fa-solid fa-trash fa-khenh"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination
              count={totalPages}
              onChange={(event, page) => handlePageClick({ selected: page - 1 })}
              variant="text"
              color="primary"
              showFirstButton
              showLastButton
              className="d-flex justify-content-center"
            />
            {/* <ReactPaginate
              breakLabel="..."
              nextLabel="Next >"
              onPageChange={handlePageClick}
              pageRangeDisplayed={5}
              pageCount={totalPages}
              previousLabel="< Previous"
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
            /> */}
          </div>
        </Card>
      </MainCard>
    </div>
  );
};

export default KhachHang;