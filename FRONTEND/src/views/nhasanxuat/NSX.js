import { useState, useEffect } from 'react';
import Pagination from '@mui/material/Pagination';
import { toast } from 'react-toastify';
import { Card } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { getAllPageNSX, searchNSX, deleteNSX } from 'services/NhaSanXuatService';

// import ConfirmDelete from './ConfirmDelete';
import _ from 'lodash';
import MainCard from 'ui-component/cards/MainCard';

//  React examples

function NhaSanXuat() {
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

  const navigate = useNavigate();

  const getAll = async (page) => {
    setCurrentPage(page);
    const res = await getAllPageNSX(page);
    if (res && res.data) {
      setData(res.data.content);
      setTotalPages(res.data.totalPages);
    }
  };

  const search = async (key, trangThai, page) => {
    setCurrentPage(page);
    const res = await searchNSX(key, trangThai, page);
    if (res) {
      setData(res.data.content);
      setTotalPages(res.data.totalPages);
    }
  };

  const handleSearchNSX = _.debounce(async (e) => {
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
    const res = await deleteNSX(id, values);
    if (res) {
      toast.success('Xóa thành công !');
      getAll(0);
    }
  };

  const handleSubmit = (id) => {
    del(id, dataDelete);
  };

  function formatDate(dateString) {
    if (dateString === null) {
      return ''; // Trả về chuỗi rỗng nếu giá trị là null
    }

    const dateObject = new Date(dateString);

    const day = dateObject.getDate();
    const month = dateObject.getMonth() + 1;
    const year = dateObject.getFullYear();

    const hours = dateObject.getHours();
    const minutes = dateObject.getMinutes();
    // const seconds = dateObject.getSeconds();

    const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;

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
                  placeholder=" Nhập tên, mã màu cần tìm..."
                  onChange={handleSearchNSX}
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
                  <span className="form-check-label">Đang kích hoạt</span>
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
                  <span className="form-check-label">Ngừng kích hoạt</span>
                </div>
              </div>

              <div className="d-flex justify-content-end">
                <button onClick={() => navigate('/san-pham/nha-san-xuat/add')} className="btn btn-primary ">
                  Thêm <i className="fa-solid fa-plus fa-beat fa-lg"></i>
                </button>
              </div>
            </div>

            <table style={{ textAlign: 'center', marginTop: 50 }} className="table table-hover">
              <tr>
                <th>#</th>
                <th>Mã NSX</th>
                <th>Tên NSX</th>
                <th>Ngày Tạo</th>
                <th>Ngày Sửa</th>
                <th>Trạng Thái</th>
                <th>Action</th>
              </tr>
              <tbody>
                {data.map((d, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{d.ma}</td>
                    <td>{d.ten}</td>
                    <td>{formatDate(d.ngayTao)}</td>
                    <td>{formatDate(d.ngaySua)}</td>
                    <td>{d.trangThai === 0 ? 'Đang kích hoạt' : 'Ngừng kích hoạt'}</td>
                    <td>
                      <button
                        onClick={() => navigate(`/san-pham/nha-san-xuat/detail/${d.id}`)}
                        style={{ color: 'aqua' }}
                        className="fa-regular fa-pen-to-square fa-lg fa-khenh"
                      ></button>

                      <button
                        onClick={() => handleSubmit(d.id, { ma: d.ma })}
                        style={{ color: '#ff1744' }}
                        className="fa-solid fa-trash fa-khenh ms-2"
                      ></button>
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
}

export default NhaSanXuat;