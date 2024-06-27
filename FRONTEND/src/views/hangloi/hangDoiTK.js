/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { Table } from 'react-bootstrap';
import { Avatar, Pagination } from '@mui/material';
import { hienThiALLSPYCDoiHang,searchALl } from 'services/ServiceDonHang';
import MainCard from 'ui-component/cards/MainCard';
import { DateRangePicker } from 'rsuite';
import { format } from 'date-fns';
import { addMonths, subMonths } from 'date-fns';

function HangDoiTK() {
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState();
  const [tuNgay, setTuNgay] = useState(null);
  const [denNgay, setDenNgay] = useState(null);
  const [term, setTerm] = useState(null);
  const [data, setData] = useState([]);
  //ngayTao
  const currentDate = new Date();
  const threeMonthsAgo = subMonths(currentDate, 3);
  const threeMonthsLater = addMonths(currentDate, 0);

  const defaultCalendarValue = [threeMonthsAgo, threeMonthsLater];

  useEffect(() => {
    getAll(0);
  }, []);

  useEffect(() => {
    handleSearch();
  }, [term, tuNgay, denNgay]);

  const getAll = async (page) => {
    setCurrentPage(page);
    const res = await hienThiALLSPYCDoiHang(page);
    if (res) {
      console.log(res);
      setData(res.data.content);
      setTotalPages(res.data.totalPages);
    }
  };

  const searchHL = async (key, tuNgay, denNgay, page) => {
    const res = await searchALl(key, tuNgay, denNgay, page);
    if (res) {
      setData(res.data.content);
      setTotalPages(res.data.totalPages);
    }
  };

  const handleSearch = _.debounce(async () => {
    if (term) {
      searchHL(term, tuNgay, denNgay, currentPage);
    } else {
      searchHL('', tuNgay, denNgay, currentPage);
    }
  }, 100);

  const handlePageClick = (event) => {
    const selectedPage = event.selected;
    searchHL('', tuNgay, denNgay, selectedPage);
  };

  const handleInputChange = (e) => {
    setTerm(e.target.value);
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

    const hours = dateObject.getHours();
    const minutes = dateObject.getMinutes();

    const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;

    return formattedDate;
  }

  const handleDateChange = (selectedRange) => {
    if (selectedRange && selectedRange[0] && selectedRange[1]) {
      const startDate = selectedRange[0];
      const endDate = selectedRange[1];

      const formattedStartDate = format(startDate, 'dd/MM/yyyy HH:mm aa');
      const formattedEndDate = format(endDate, 'dd/MM/yyyy HH:mm aa');

      setTuNgay(formattedStartDate);
      setDenNgay(formattedEndDate);
    }
  };

  return (
    <div>
      <MainCard>
        <div className="row">
          <div className="text-center">
            <h1>Hàng khách yêu cầu đổi</h1>
          </div>
          <div className="col-7">
            <div className="search">
              <input
                style={{ borderRadius: 15, width: 300, height: 40, paddingBottom: 3, paddingLeft: 10 }}
                type="text"
                className="input-search"
                placeholder=" Nhập tên sản phẩm, mã hóa đơn cần tìm..."
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="col-3">
            <DateRangePicker
              format="dd/MM/yyyy HH:mm aa"
              showMeridian
              defaultCalendarValue={defaultCalendarValue}
              onChange={handleDateChange}
              onClean={() => {
                setTuNgay(null);
                setDenNgay(null);
              }}
              // disabledDate={disabledDate}
            />
          </div>
        </div>
        <Table style={{ marginTop: 20 }}>
          <tr>
            <th style={{ textAlign: 'center' }}>#</th>
            <th>Sản phẩm</th>
            <th style={{ textAlign: 'center' }}>Mã hoá đơn</th>
            <th style={{ textAlign: 'center' }}>Số lượng</th>
            {/* <th style={{ textAlign: 'center' }}>Tiền Hàng</th> */}
            <th style={{ textAlign: 'center' }}>Ghi chú</th>
            <th style={{ textAlign: 'center' }}>Ngày tạo</th>
            <th style={{ textAlign: 'center' }}>Người xác nhận</th>
          </tr>
          <tbody>
            {data.map((d, i) => (
              <tr key={i}>
                <td style={{ textAlign: 'center' }}>{i + 1}</td>
                <td>
                  <div className="d-flex justify-content-start">
                    <Avatar
                      alt={d.chiTietSanPham.sanPham.ten}
                      src={`http://localhost:8080/api/chi-tiet-san-pham/${d.chiTietSanPham.id}`}
                      sx={{ width: 80, height: 110 }}
                      variant="rounded"
                      className="me-3"
                    />
                    <div>
                      {d.chiTietSanPham.sanPham.ten} <br />
                      {d.chiTietSanPham.kichCo.ten} -{' '}
                      <span style={{ backgroundColor: d.chiTietSanPham.mauSac.ten, borderRadius: 15, fontSize: 15 }}>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      </span>
                    </div>
                  </div>
                </td>
                <td style={{ textAlign: 'center', marginTop: 50 }}>{d.hoaDon.ma}</td>
                <td style={{ textAlign: 'center', marginTop: 50 }}>{d.lichSuSoLuongYeuCauDoi}</td>
                {/* <td style={{ textAlign: 'center', marginTop: 50 }}>{d.donGia}</td> */}
                <td style={{ textAlign: 'center', marginTop: 50 }}>{d.doiHang.ghiChu}</td>
                <td style={{ textAlign: 'center', marginTop: 50 }}>{formatDate(d.doiHang.ngayTao)}</td>
                <td style={{ textAlign: 'center', marginTop: 50 }}>{d.doiHang.nguoiTao}</td>
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
          //   onPageChange={handlePageClick}
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
      </MainCard>
    </div>
  );
}

export default HangDoiTK;