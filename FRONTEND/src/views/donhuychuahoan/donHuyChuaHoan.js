/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
// import ReactPaginate from 'react-paginate';
import { Card, Pagination } from '@mui/material';
import { toast } from 'react-toastify';
import '../../scss/DonHang.scss';
import { getAllPageDHHuyChuaHoan, findDonHuyChuaHoan, hoanTien } from 'services/ServiceDonHang';
import MainCard from 'ui-component/cards/MainCard';
import { DateRangePicker } from 'rsuite';
import Button from '@mui/material/Button';
import { addMonths, subMonths, isWithinInterval } from 'date-fns';
import { format } from 'date-fns';

function DonHuyChuaHoan() {
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [tuNgay, setTuNgay] = useState(null);
  const [denNgay, setDenNgay] = useState(null);
  const [term, setTerm] = useState('');
  const [data, setData] = useState([]);
  const dataLoginNV = JSON.parse(localStorage.getItem('dataLoginNV'));
  const dataLoginAD = JSON.parse(localStorage.getItem('dataLoginAD'));

  //ngayTao
  const currentDate = new Date();
  const threeMonthsAgo = subMonths(currentDate, 3);
  const threeMonthsLater = addMonths(currentDate, 0);

  const defaultCalendarValue = [threeMonthsAgo, threeMonthsLater];

  useEffect(() => {
    getAll(0);
  }, []);

  const getAll = async (page) => {
    setCurrentPage(page);
    const res = await getAllPageDHHuyChuaHoan(page);
    if (res && res.data) {
      setData(res.data.content);
      setTotalPages(res.data.totalPages);
    }
  };

  //fillter DH
  const search = async (key, tuNgay, denNgay, page = 0) => {
    const res = await findDonHuyChuaHoan(key, tuNgay, denNgay, page);
    if (res) {
      setData(res.data.content);
      setTotalPages(res.data.totalPages);

      if (res.data.content.length === 0 && currentPage !== 0) {
        setCurrentPage(0);
      } else {
        setCurrentPage(page);
      }
    }
  };

  const handleSearchDH = _.debounce(async (page = 0) => {
    if (term !== '') {
      search(term, tuNgay, denNgay, page);
    } else {
      search('', null, null, page);
    }
    if (data.length === 0) {
      setCurrentPage(0);
    }
  }, []);

  useEffect(() => {
    handleSearchDH(currentPage);
  }, [term, tuNgay, denNgay, currentPage]);

  const handleInputChange = (e) => {
    setTerm(e.target.value);
  };

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

  const disabledDate = (date) => {
    return !isWithinInterval(date, { start: threeMonthsAgo, end: threeMonthsLater });
  };

  //Phan trang
  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage);
  };

  const handlePageClick = (event) => {
    handlePageChange(event.selected);
  };

  // huy don
  const huyDon = async (id, value) => {
    const res = await hoanTien(id, dataLoginAD.id || dataLoginNV.id, value);
    if (res) {
      toast.success('Cập nhật thành công !');
      getAll(0);
    }
  };

  const handleHuyDon = async (id, event) => {
    event.preventDefault();
    await huyDon(id, { ghiChu: 'hoan tien' });
  };

  function convertToCurrency(number) {
    // Chuyển đổi số thành định dạng tiền Việt Nam
    const formatter = new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    });

    return formatter.format(number);
  }

  function formatDate(dateString) {
    if (dateString === null) {
      return '';
    }

    const dateObject = new Date(dateString);

    const day = dateObject.getDate();
    const month = dateObject.getMonth() + 1;
    const year = dateObject.getFullYear();

    let hours = dateObject.getHours();
    const minutes = dateObject.getMinutes();
    let meridian = 'AM';

    if (hours >= 12) {
      meridian = 'PM';
      hours = hours % 12; // Chuyển sang định dạng 12 giờ
    }

    // Đảm bảo hiển thị đúng định dạng hh:mm
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');

    const formattedDate = `${day}/${month}/${year} ${formattedHours}:${formattedMinutes} ${meridian}`;

    return formattedDate;
  }

  // const tenNV = {
  //   nhanVien: { ten: dataLogin && dataLogin.ten }
  // };

  return (
    <div>
      <MainCard>
        {/* fillter */}
        <Card>
          <div style={{ height: 'auto' }} className="w-auto rounded bg-white border shadow p-4">
            <div className="row" style={{ marginLeft: 100 }}>
              <div className="box col-auto col-6">
                <div style={{ marginLeft: 6 }} className="values">
                  <strong>Mã đơn hàng, mã giao dịch hoặc tên khách hàng :</strong>
                </div>
                <div style={{ marginTop: 10 }} className="search">
                  <input
                    style={{ borderRadius: 15, width: 450, height: 30, border: '1px solid gray' }}
                    type="text"
                    className="input-search"
                    placeholder="Nhập mã đơn, mã giao dịch hoặc tên khách hàng cần tìm..."
                    value={term}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="box col-auto col-6">
                <div style={{ textAlign: 'start' }} className="field">
                  <div className="values">
                    <strong>Ngày tạo đơn :</strong>
                  </div>
                  <div style={{ marginTop: 10 }}>
                    <DateRangePicker
                      format="dd/MM/yyyy HH:mm aa"
                      showMeridian
                      defaultCalendarValue={defaultCalendarValue}
                      onChange={handleDateChange}
                      onClean={() => {
                        setTuNgay(null);
                        setDenNgay(null);
                      }}
                      disabledDate={disabledDate}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
        <br></br>
        {/* table */}
        <Card>
          <div className="w-auto rounded bg-white border shadow p-4">
            <table id="table-to-xls" style={{ textAlign: 'center', alignItems: 'center', cursor: 'pointer' }} className="table">
              <tr>
                <th>#</th>
                <th>Mã Đơn</th>
                <th>Mã Giao Dịch</th>
                <th>Khách Hàng</th>
                <th>Ngày Tạo Đơn</th>
                <th>Số Luợng</th>
                <th>Tổng tiền</th>
                <th>Action</th>
              </tr>
              <br></br>

              <tbody>
                {data.map((d, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{d.ma}</td>
                    <td>{d.ma_giao_dich}</td>
                    <td>{d.ten_nguoi_nhan}</td>
                    <td>{formatDate(d.ngay_tao)}</td>
                    <td>{d.tong_so_luong}</td>
                    <td>{convertToCurrency(d.tong_tien)}</td>
                    <td>
                      <Button onClick={(e) => handleHuyDon(d.id, e)} variant="outlined" color="info" size="small">
                        Hoàn tiền
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {data.length === 0 && (
              <div className="col-sm-12">
                <div
                  style={{ background: 'whitesmoke' }}
                  className="alert fade alert-simple alert-danger alert-dismissible text-left font__family-montserrat font__size-28 font__weight-light brk-library-rendered rendered show"
                  role="alert"
                  data-brk-library="component__alert"
                >
                  <div className="start-icon far fa-times-circle faa-pulse animated fa-times">
                    <strong style={{ fontFamily: 'Arial' }} className="font__weight-semibold">
                      Không tìm thấy dữ liệu!
                    </strong>
                  </div>
                </div>
              </div>
            )}

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
              containerClassName="pagination justify-content-center po"
              activeClassName="active"
            /> */}
          </div>
        </Card>
      </MainCard>
    </div>
  );
}

export default DonHuyChuaHoan;