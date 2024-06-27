
import { useEffect, useState } from 'react';
import Pagination from '@mui/material/Pagination';
import MainCard from 'ui-component/cards/MainCard';
import { Avatar, Card } from '@mui/material';
import { getAllPageNV, deleteNhanVien, searchNV } from 'services/NhanVienService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const NhanVien = () => {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState(' ');
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    getAll(0);
  }, []);

  const getAll = async (page) => {
    const res = await getAllPageNV(page);
    if (res && res.data) {
      setData(res.data.content);
      setTotalPages(res.data.totalPages);
    }
  };

  const del = async (id) => {
    const res = await deleteNhanVien(id);
    if (res) {
      toast.success('Xóa thành công!');
      getAll(0);
    }
  };

  const handleFilterStatusChange = (status) => {
    setFilterStatus(status);
    search(searchTerm, status, 0);
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    search(term, filterStatus, 0);
  };

  const search = async (term, trangThai, page) => {
    const res = await searchNV(term, trangThai, page);
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

  console.log(data);

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
                  placeholder="Nhập tên, mã màu cần tìm..."
                  onChange={handleSearch}
                />
              </div>
              <div style={{ marginRight: 50 }}>
                <label htmlFor="all" style={{ fontWeight: 'bold', marginRight: 25 }} className="form-check-label">
                  Trạng Thái:
                </label>
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
                    Hoạt động
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
                    Không Hoạt động
                  </label>
                </div>
              </div>
              <div color="blue">
                <button className="btn btn-primary" onClick={() => navigate('/nhan-vien/add')}>
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
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Địa Chỉ</th>
                  <th>Ngày Sinh</th>
                  <th>Vai Trò</th>
                  <th>Giới Tính</th>
                  <th>Trạng Thái</th>
                  <th>Ảnh</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {data.map((d, i) => (
                  <tr key={d.id}>
                    <td>{i + 1}</td>
                    <td>{d.ma}</td>
                    <td>{d.ten}</td>
                    <td>{d.sdt}</td>
                    <td>{d.email}</td>
                    <td>{d.diaChi}</td>
                    <td>{formatDate(d.ngaySinh)}</td>
                    <td>{d.vaiTro.ten}</td>
                    <td>{d.gioiTinh === true ? 'Nam' : 'Nữ'}</td>
                    <td>{d.trangThai === 0 ? 'Hoạt động' : 'Không hoạt động'}</td>
                    <td>
                      <Avatar alt={d.ten} src={`http://localhost:8080/api/nhanvien/getAll/${d.id}`} sx={{ width: 80, height: 80 }} />
                      {/* <img src={`http://localhost:8080/api/nhanvien/getAll/${d.id}`} alt="" style={{ width: '90px', height: '100px' }} /> */}
                    </td>

                    <td>
                      <Link
                        className="mx-2"
                        to={`/nhan-vien/detail/${d.id}?imageURL=${encodeURIComponent(`http://localhost:8080/api/nhanvien/getAll/${d.id}`)}`}
                      >
                        <i style={{ color: 'aqua' }} className="fa-regular fa-pen-to-square fa-lg"></i>
                      </Link>

                      <button className="mx-2 fa-khenh" onClick={() => handleDeleteKH(d.id)}>
                        <i style={{ color: '#ff1744' }} className="fa-solid fa-trash"></i>
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

export default NhanVien;
