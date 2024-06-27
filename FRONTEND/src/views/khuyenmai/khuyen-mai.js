import { useState, useEffect } from 'react';
// import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';
import React from 'react';
import MainCard from 'ui-component/cards/MainCard';
import Table from 'react-bootstrap/Table';
import { useNavigate } from 'react-router-dom';
import { getAllPageKM, searchKM } from 'services/ServiceKhuyenMai';
// import ConfirmDelete from './ConfirmDelete';
import _ from 'lodash';

// @mui material components

// React components

//  React examples
import { deleteKM } from 'services/ServiceKhuyenMai';
import { Card, Pagination } from '@mui/material';
function KhuyenMai() {
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState();
  // const [isShow, setIsShow] = useState(false);
  const [dataDelete] = useState({
    ma: ''
  });

  //loc ngay
  // const [startDate, setStartDate] = useState(null);
  // const [endDate, setEndDate] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getAll(0);
  }, []);

  const getAll = async (page) => {
    setCurrentPage(page);
    const res = await getAllPageKM(page);
    if (res) {
      setData(res.data.content);
      setTotalPages(res.data.totalPages);
    }
  };

  function convertToCurrency(number) {
    // Chuyển đổi số thành định dạng tiền Việt Nam
    const formatter = new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    });
    return formatter.format(number);
  }
  //Xoas
  const del = async (id, values) => {
    const res = await deleteKM(id, values);
    if (res) {
      toast.success('Xóa thành công !');
      getAll(0);
    }
  };

  //Search
  const search = async (key, trangThai, page) => {
    setCurrentPage(page);
    const res = await searchKM(key, trangThai, page);
    if (res) {
      setData(res.data.content);
      setTotalPages(res.data.totalPages);
    }
  };

  const handleSearchKM = _.debounce(async (e) => {
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

  const handleSubmit = (id) => {
    del(id, dataDelete);
  };

  //Format date
  function formatDate(dateString) {
    if (dateString === null) {
      return ''; // Trả về chuỗi rỗng nếu giá trị là null
    }

    const dateObject = new Date(dateString);

    const day = dateObject.getDate();
    const month = dateObject.getMonth() + 1;
    const year = dateObject.getFullYear();

    // const hours = dateObject.getHours();
    // const minutes = dateObject.getMinutes();

    const formattedDate = `${day}/${month}/${year}`;

    return formattedDate;
  }

  return (
    <MainCard>
      <Card>
        <div className="w-auto rounded bg-white border shadow p-4">
          <div className="d-flex justify-content-between">
            <div className="search">
              <input
                style={{ borderRadius: 15, width: 300 }}
                type="text"
                className="input-search"
                placeholder=" Nhập tên, mã màu cần tìm..."
                onChange={handleSearchKM}
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
                  checked={filterStatus === 0}
                  onChange={() => {
                    setFilterStatus(0);
                    search('', 0, 0);
                  }}
                />
                <span className="form-check-label">Sắp diễn ra</span>
              </div>
              <div style={{ marginLeft: 10 }} className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="inlineRadioOptions"
                  checked={filterStatus === 1}
                  onChange={() => {
                    setFilterStatus(1);
                    search('', 1, 0);
                  }}
                />
                <span className="form-check-label">Đã kết thúc</span>
              </div>
              <div style={{ marginLeft: 10 }} className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="inlineRadioOptions"
                  checked={filterStatus === 2}
                  onChange={() => {
                    setFilterStatus(2);
                    search('', 2, 0);
                  }}
                />
                <span className="form-check-label">Đang diễn ra</span>
              </div>
              {/* <div style={{ marginLeft: 10 }} className="form-check form-check-inline">
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <span className="form-check-label">Ngày bắt đầu</span>
          </div>

          <div style={{ marginLeft: 10 }} className="form-check form-check-inline">
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            <span className="form-check-label">Ngày kết thúc</span>
          </div> */}
            </div>

            <div className="d-flex justify-content-end">
              {/* <Link to="/khuyen-mai/add" className="btn btn-primary">
            Thêm <i className="fa-solid fa-plus fa-beat fa-lg"></i>
          </Link> */}
              <button onClick={() => navigate('/voucher/add')} className="btn btn-primary">
                Thêm <i className="fa-solid fa-plus fa-beat fa-lg"></i>
              </button>
            </div>
          </div>

          <Table style={{ textAlign: 'center', marginTop: 50 }}>
            <tr>
              <th>#</th>
              <th>Mã</th>
              <th>Tên</th>
              <th>Mức giảm</th>
              <th>Tối thiểu</th>
              <th>Bắt đầu</th>
              <th>Kết thúc</th>
              <th>Mô tả</th>
              <th>Trạng Thái</th>
              <th>Action</th>
            </tr>
            <tbody>
              {data.map((d, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>
                    {' '}
                    <span>{d.ma}</span>
                  </td>
                  <td>{d.ten}</td>
                  <td>{!d.loaiGiam ? `${d.mucGiam}%` : convertToCurrency(d.mucGiam)}</td>
                  <td>{convertToCurrency(d.tien)}</td>
                  <td>{formatDate(d.thoiGianBatDau)}</td>
                  <td>{formatDate(d.thoiGianKetThuc)}</td>
                  <td>{d.moTa}</td>
                  <td>
                    {d.trangThai === 0 && <span>Sắp diễn ra</span>}
                    {d.trangThai === 1 && <span>Đã kết thúc</span>}
                    {d.trangThai !== 0 && d.trangThai !== 1 && <span>Đang diễn ra</span>}
                  </td>
                  <td>
                    <button className="mx-2 fa-khenh" onClick={() => navigate(`/voucher/detail/${d.id}`)}>
                      <i style={{ color: 'aqua' }} className="fa-regular fa-pen-to-square fa-lg"></i>
                    </button>
                    <button className="mx-2 fa-khenh" onClick={() => handleSubmit(d.id, { ma: d.ma })}>
                      <i style={{ color: '#ff1744' }} className="fa-solid fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
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
  );
}

export default KhuyenMai;