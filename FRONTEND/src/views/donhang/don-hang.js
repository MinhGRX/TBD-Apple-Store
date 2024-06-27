/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
// import ReactPaginate from 'react-paginate';
import { Card } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import '../../scss/DonHang.scss';
import { toast } from 'react-toastify';
import { getAllPageDH, findVIP, xacNhanListIds, huyDonListIds } from 'services/ServiceDonHang';
import MainCard from 'ui-component/cards/MainCard';
import { DateRangePicker } from 'rsuite';
import Select from 'react-select';
import { FormCheck, FormGroup } from 'react-bootstrap';
import { format } from 'date-fns';
import makeAnimated from 'react-select/animated';
import { addMonths, subMonths, isWithinInterval } from 'date-fns';
import Pagination from '@mui/material/Pagination';

function DonHang() {
  const [currentPage, setCurrentPage] = useState(0);
  const dataLogin = JSON.parse(localStorage.getItem('dataLogin'));

  const tenNV = {
    nhanVien: { ten: dataLogin && dataLogin.ten }
  };
  const [totalPages, setTotalPages] = useState(0);
  const [tuNgay, setTuNgay] = useState(null);
  const [denNgay, setDenNgay] = useState(null);
  const navigate = useNavigate();
  const [term, setTerm] = useState('');
  const [loaiDon, setLoaiDon] = useState('');
  const [radioLoai, setRadioLoai] = useState('');
  //select trangThai
  const [selectedOptions, setSelectedOptions] = useState([]);
  //hien thi
  const [data, setData] = useState([]);

  const animatedComponents = makeAnimated();

  const optionList = [
    { value: '0', label: 'Đang chờ xác nhận' },
    { value: '1', label: 'Chờ giao hàng' },
    { value: '2', label: 'Đã hủy đơn' },
    { value: '3,8,9,10', label: 'Đang giao hàng' },
    { value: '4', label: 'Giao hàng thành công' },
    { value: '5,11,12,13', label: 'Giao hàng thất bại' },
    { value: '6', label: 'Thanh toán thành công' },
    // { value: '7', label: 'Đã nhận hàng' },
    { value: '14', label: 'Yêu cầu hủy đơn' },
    { value: '15', label: 'Đổi hàng' },
    // { value: '16', label: 'Đã xác nhận đổi hàng' },
    // { value: '17', label: 'Đổi hàng thất bại' },
    { value: '18', label: 'Hoàn tiền thành công' }
  ];

  function handleSelect(selectedOptions) {
    setSelectedOptions(selectedOptions);
  }

  useEffect(() => {
    getAll(0);
  }, []);

  const getAll = async (page) => {
    setCurrentPage(page);
    const res = await getAllPageDH(page);
    if (res && res.data) {
      setData(res.data.content);
      setTotalPages(res.data.totalPages);
    }
  };

  //fillter DH
  const search = async (key, tuNgay, denNgay, trangThai, loaiDon, page = 0) => {
    const res = await findVIP(key, tuNgay, denNgay, trangThai, loaiDon, page);
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
    const selectedValues = selectedOptions.map((option) => option.value);
    if (term || selectedValues !== 0) {
      const values = selectedValues.length > 0 ? selectedValues : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
      search(term, tuNgay, denNgay, values, loaiDon, page);
    } else {
      const values = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
      search('', null, null, values, '', page);
    }
    if (data.length === 0) {
      setCurrentPage(0);
    }
  }, []);

  useEffect(() => {
    handleSearchDH(currentPage);
  }, [term, tuNgay, denNgay, selectedOptions, loaiDon, currentPage]);

  const handleInputChange = (e) => {
    setTerm(e.target.value);
  };

  const handleRadioChange1 = (e) => {
    setLoaiDon(e.target.value);
    setRadioLoai(e.target.value);
  };

  const handleAllClickLoai = () => {
    setLoaiDon('');
    setRadioLoai('');
  };

  //ngayTao
  const currentDate = new Date();
  const threeMonthsAgo = subMonths(currentDate, 3);
  const threeMonthsLater = addMonths(currentDate, 0);

  const defaultCalendarValue = [threeMonthsAgo, threeMonthsLater];

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

  //Checkbox

  const [isChecked, setIsChecked] = useState([]);
  const [isCheckAllDisabled, setIsCheckAllDisabled] = useState(false);

  useEffect(() => {
    const shouldDisableCheckAll = data.some((d) => (d.trang_thai !== 0 && d.trang_thai !== 1 && d.trang_thai !== 6) || d.loai_don === 0);
    setIsCheckAllDisabled(shouldDisableCheckAll);
  }, [data]);

  const handleCheckAll = (event) => {
    const { checked } = event.target;
    const newCheckedArray = data.map((d) => (d.trang_thai === 0 || d.trang_thai === 1 ? checked : false));
    setIsChecked(newCheckedArray);
  };

  const handleCheck = (index) => {
    const newCheckedArray = [...isChecked];
    newCheckedArray[index] = !newCheckedArray[index];

    // Cập nhật trạng thái disabled của các checkbox dựa trên newCheckedArray
    const updatedData = data.map((d) => {
      if ((d.trang_thai === 0 || d.trang_thai === 6) && d.loai_don === 1) {
        return {
          ...d,
          disabled: newCheckedArray.some((value, index) => value && (data[index].trang_thai === 1 || data[index].trang_thai === 6))
        };
      } else if (d.trang_thai === 1 && d.loai_don === 1) {
        return {
          ...d,
          disabled: newCheckedArray.some((value, index) => value && (data[index].trang_thai === 0 || data[index].trang_thai === 6))
        };
      }
      return d;
    });

    setIsChecked(newCheckedArray);
    setData(updatedData);
  };

  //xac nhan don
  const xacNhan = async (ids, value) => {
    const res = await xacNhanListIds(ids, value, tenNV.nhanVien.ten);
    if (res) {
      toast.success('Cập nhật thành công !');
      getAll(0);
    }
  };

  const handleXacNhanDH = async (event) => {
    event.preventDefault();
    const selectedIds = data
      .filter((d, index) => isChecked[index] && (d.trang_thai === 0 || d.trang_thai === 1 || d.trang_thai === 6))
      .map((d) => d.id);
    if (selectedIds.length > 0) {
      await xacNhan(selectedIds, tenNV.nhanVien.ten);
    } else {
      toast.warning('Bạn phải chọn hóa đơn trước !');
    }
  };

  // huy don
  const huyDon = async (ids, value) => {
    const res = await huyDonListIds(ids, value, tenNV.nhanVien.ten);
    if (res) {
      toast.success('Cập nhật thành công !');
      getAll(0);
    }
  };

  const handleHuyDon = async (event) => {
    event.preventDefault();
    const selectedIds = data
      .filter((d, index) => isChecked[index] && (d.trang_thai === 0 || d.trang_thai === 1 || (d.trang_thai === 6 && d.loai_don === 1)))
      .map((d) => d.id);
    if (selectedIds.length > 0) {
      await huyDon(selectedIds, tenNV.nhanVien.ten);
    } else {
      toast.warning('Bạn phải chọn hóa đơn trước !');
    }
  };

  // // xac nhan giao hang

  // const giaoHang = async (id, value) => {
  //   const res = await xacNhanGiao(id, value);
  //   if (res) {
  //     toast.success('Cập nhật thành công !');
  //     setShow4(false);
  //     detail(id);
  //     detailListLSHD(id);
  //   }
  // };

  // const handleXacNhanGiaoHang = async (event) => {
  //   event.preventDefault();
  //   await giaoHang(id, lshd2);
  // };

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

  return (
    <div>
      <MainCard>
        {/* fillter */}
        <Card>
          <div style={{ height: 'auto' }} className="w-auto rounded bg-white border shadow p-4">
            <div style={{ marginLeft: 80 }} className="row">
              <div className="box col-auto col-6">
                <div className="values">
                  <strong>Mã đơn hàng hoặc tên khách hàng :</strong>
                </div>
                <div style={{ marginTop: 10 }} className="search">
                  <input
                    style={{ borderRadius: 15, width: 362, height: 30, border: '1px solid gray' }}
                    type="text"
                    className="input-search"
                    placeholder="Nhập mã đơn hoặc tên khách hàng cần tìm..."
                    value={term}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="box col-auto col-6">
                <div className="values">
                  <strong>Trạng thái:</strong>
                </div>
                <div className="dropdown-container">
                  <Select
                    options={optionList}
                    components={animatedComponents}
                    placeholder="Chọn trạng thái đơn cần tìm ...."
                    value={selectedOptions}
                    onChange={handleSelect}
                    isSearchable={true}
                    isMulti
                  />
                </div>
              </div>
            </div>
            <br></br>

            <div style={{ marginTop: 10, marginLeft: 80 }} className="row">
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

              <div style={{ marginTop: 8 }} className="box col-auto col-6">
                <div className="values">
                  <strong>Loại đơn:</strong>
                </div>
                <FormGroup style={{ marginTop: 15 }}>
                  <FormCheck inline>
                    <FormCheck.Input
                      type="radio"
                      name="radioLoai"
                      checked={radioLoai === ''}
                      value=""
                      onClick={handleAllClickLoai}
                      onChange={handleRadioChange1}
                    />
                    <FormCheck.Label>Tất Cả</FormCheck.Label>
                  </FormCheck>

                  <FormCheck style={{ marginLeft: 35 }} inline>
                    <FormCheck.Input type="radio" name="radioLoai" checked={radioLoai === '0'} value="0" onChange={handleRadioChange1} />
                    <FormCheck.Label>Tại Quầy</FormCheck.Label>
                  </FormCheck>

                  <FormCheck inline style={{ marginLeft: 35 }}>
                    <FormCheck.Input type="radio" name="radioLoai" checked={radioLoai === '1'} value="1" onChange={handleRadioChange1} />
                    <FormCheck.Label>Đặt hàng online</FormCheck.Label>
                  </FormCheck>
                </FormGroup>
              </div>
            </div>
          </div>
        </Card>
        <br></br>
        {/* table */}
        <Card>
          <div className="w-auto rounded bg-white border shadow p-4">
            <table id="table-to-xls" style={{ textAlign: 'center', alignItems: 'center', cursor: 'pointer' }} className="table table-hover">
              <tr>
                <th>
                  <input
                    className={`form-check-input ${isCheckAllDisabled ? 'disabled-checkbox' : ''}`}
                    style={{ border: '1px solid black' }}
                    type="checkbox"
                    value=""
                    id="checkAll"
                    onChange={handleCheckAll}
                    disabled={isCheckAllDisabled}
                  />
                </th>

                <th>#</th>
                <th>Mã Đơn</th>
                <th>Khách Hàng</th>
                <th>Ngày Tạo Đơn</th>
                <th>Số Luợng</th>
                <th>Tổng tiền</th>
                <th>Trạng Thái</th>
                <th>Loại Đơn</th>
              </tr>
              <br></br>

              <tbody>
                {data.map((d, i) => (
                  <tr key={i} onClick={() => navigate(`/don-hang/chi-tiet/${d.id}`)}>
                    <td>
                      <td>
                        {d.trang_thai === 0 && d.loai_don === 1 && (
                          <input
                            onClick={(e) => e.stopPropagation()}
                            style={{ border: '1px solid black' }}
                            className={`form-check-input ${
                              d.trang_thai === 0
                                ? isChecked.some((value, index) => value && data[index].trang_thai === 1)
                                  ? 'disabled-checkbox'
                                  : ''
                                : d.trang_thai === 1
                                ? isChecked.some((value, index) => value && data[index].trang_thai === 0)
                                  ? 'disabled-checkbox'
                                  : ''
                                : ''
                            }`}
                            type="checkbox"
                            value=""
                            checked={isChecked[i]}
                            disabled={
                              d.trang_thai === 0
                                ? isChecked.some((value, index) => value && data[index].trang_thai === 1)
                                : d.trang_thai === 1
                                ? isChecked.some((value, index) => value && data[index].trang_thai === 0)
                                : false
                            }
                            onChange={() => handleCheck(i, d.id)}
                          />
                        )}
                        {d.trang_thai === 1 && d.loai_don === 1 && (
                          <input
                            onClick={(e) => e.stopPropagation()}
                            style={{ border: '1px solid black' }}
                            className={`form-check-input ${
                              d.trang_thai === 0
                                ? isChecked.some((value, index) => value && data[index].trang_thai === 1)
                                  ? 'disabled-checkbox'
                                  : ''
                                : d.trang_thai === 1
                                ? isChecked.some((value, index) => value && data[index].trang_thai === 0)
                                  ? 'disabled-checkbox'
                                  : ''
                                : ''
                            }`}
                            type="checkbox"
                            value=""
                            checked={isChecked[i]}
                            disabled={
                              d.trang_thai === 0
                                ? isChecked.some((value, index) => value && data[index].trang_thai === 1)
                                : d.trang_thai === 1
                                ? isChecked.some((value, index) => value && data[index].trang_thai === 0)
                                : false
                            }
                            onChange={() => handleCheck(i, d.id)}
                          />
                        )}
                      </td>
                    </td>
                    <td>{i + 1}</td>
                    <td>{d.ma}</td>
                    <td>{d.ten_nguoi_nhan}</td>
                    <td>{formatDate(d.ngay_tao)}</td>
                    <td>{d.tong_so_luong}</td>
                    <td>{convertToCurrency(d.tong_tien)}</td>
                    <td style={{ fontSize: '12px', justifyContent: 'center', display: 'flex' }} className="align-middle">
                      {d.trang_thai === 0 && (
                        <span
                          style={{
                            width: '240px',
                            pointerEvents: 'none',
                            height: '30px',
                            borderRadius: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold'
                          }}
                          className="btn btn-labeled shadow-button btn btn-warning status-pending"
                        >
                          Đang chờ xác nhận
                        </span>
                      )}
                      {d.trang_thai === 1 && (
                        <span
                          style={{
                            width: '240px',
                            pointerEvents: 'none',
                            height: '30px',
                            borderRadius: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold'
                          }}
                          className="btn btn-labeled shadow-button btn btn-secondary status-pending"
                        >
                          Chờ giao hàng
                        </span>
                      )}
                      {d.trang_thai === 2 && (
                        <span
                          style={{
                            width: '240px',
                            pointerEvents: 'none',
                            height: '30px',
                            borderRadius: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            backgroundColor: '#990000',
                            color: 'white'
                          }}
                          className="btn btn-labeled shadow-button btn status-cancelled"
                        >
                          Đã hủy đơn
                        </span>
                      )}

                      {d.trang_thai === 3 && (
                        <span
                          style={{
                            width: '240px',
                            pointerEvents: 'none',
                            height: '30px',
                            borderRadius: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold'
                          }}
                          className="btn btn-labeled shadow-button btn btn-warning status-pending"
                        >
                          Đang giao hàng
                        </span>
                      )}
                      {d.trang_thai === 4 && (
                        <span
                          style={{
                            width: '240px',
                            pointerEvents: 'none',
                            height: '30px',
                            borderRadius: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            backgroundColor: 'greenyellow',
                            color: 'black'
                          }}
                          className="btn btn-labeled shadow-button btn status-completed"
                        >
                          Giao hàng thành công
                        </span>
                      )}
                      {d.trang_thai === 5 && (
                        <span
                          style={{
                            width: '240px',
                            pointerEvents: 'none',
                            height: '30px',
                            borderRadius: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            backgroundColor: 'red',
                            color: 'white'
                          }}
                          className="btn btn-labeled shadow-button btn status-cancelled"
                        >
                          Giao hàng thất bại
                        </span>
                      )}
                      {d.trang_thai === 6 && (
                        <span
                          style={{
                            width: '240px',
                            pointerEvents: 'none',
                            height: '30px',
                            borderRadius: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold'
                          }}
                          className="btn btn-labeled shadow-button btn btn-info status-completed"
                        >
                          Thanh toán thành công
                        </span>
                      )}
                      {d.trang_thai === 7 && (
                        <span
                          style={{
                            width: '240px',
                            pointerEvents: 'none',
                            height: '30px',
                            borderRadius: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            backgroundColor: 'darkblue',
                            color: 'white'
                          }}
                          className="btn btn-labeled shadow-button btn status-completed"
                        >
                          Đã nhận hàng
                        </span>
                      )}
                      {d.trang_thai === 8 && (
                        <span
                          style={{
                            width: '240px',
                            pointerEvents: 'none',
                            height: '30px',
                            borderRadius: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold'
                          }}
                          className="btn btn-labeled shadow-button btn btn-warning status-pending"
                        >
                          Đang giao hàng
                        </span>
                      )}
                      {d.trang_thai === 9 && (
                        <span
                          style={{
                            width: '240px',
                            pointerEvents: 'none',
                            height: '30px',
                            borderRadius: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold'
                          }}
                          className="btn btn-labeled shadow-button btn btn-warning status-pending"
                        >
                          Đang giao hàng
                        </span>
                      )}
                      {d.trang_thai === 10 && (
                        <span
                          style={{
                            width: '240px',
                            pointerEvents: 'none',
                            height: '30px',
                            borderRadius: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold'
                          }}
                          className="btn btn-labeled shadow-button btn btn-warning status-pending"
                        >
                          Đang giao hàng
                        </span>
                      )}
                      {d.trang_thai === 11 && (
                        <span
                          style={{
                            width: '240px',
                            pointerEvents: 'none',
                            height: '30px',
                            borderRadius: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            backgroundColor: 'red',
                            color: 'white'
                          }}
                          className="btn btn-labeled shadow-button btn status-cancelled"
                        >
                          Giao hàng thất bại
                        </span>
                      )}
                      {d.trang_thai === 12 && (
                        <span
                          style={{
                            width: '240px',
                            pointerEvents: 'none',
                            height: '30px',
                            borderRadius: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            backgroundColor: 'red',
                            color: 'white'
                          }}
                          className="btn btn-labeled shadow-button btn status-cancelled"
                        >
                          Giao hàng thất bại
                        </span>
                      )}
                      {d.trang_thai === 13 && (
                        <span
                          style={{
                            width: '240px',
                            pointerEvents: 'none',
                            height: '30px',
                            borderRadius: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            backgroundColor: 'red',
                            color: 'white'
                          }}
                          className="btn btn-labeled shadow-button btn status-cancelled"
                        >
                          Giao hàng thất bại
                        </span>
                      )}
                      {d.trang_thai === 14 && (
                        <span
                          style={{
                            width: '240px',
                            pointerEvents: 'none',
                            height: '30px',
                            borderRadius: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            backgroundColor: '#FFFF00',
                            color: 'black'
                          }}
                          className="btn btn-labeled shadow-button btn status-cancelled"
                        >
                          Yêu cầu hủy đơn
                        </span>
                      )}
                      {d.trang_thai === 15 && (
                        <span
                          style={{
                            width: '240px',
                            pointerEvents: 'none',
                            height: '30px',
                            borderRadius: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            backgroundColor: '#0000FF',
                            color: 'white'
                          }}
                          className="btn btn-labeled shadow-button btn status-cancelled"
                        >
                          Đổi hàng
                        </span>
                      )}
                      {d.trang_thai === 16 && (
                        <span
                          style={{
                            width: '240px',
                            pointerEvents: 'none',
                            height: '30px',
                            borderRadius: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            backgroundColor: '#0000FF',
                            color: 'white'
                          }}
                          className="btn btn-labeled shadow-button btn status-cancelled"
                        >
                          Đã xác nhận đổi hàng
                        </span>
                      )}
                      {d.trang_thai === 17 && (
                        <span
                          style={{
                            width: '240px',
                            pointerEvents: 'none',
                            height: '30px',
                            borderRadius: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            backgroundColor: '#990000',
                            color: 'white'
                          }}
                          className="btn btn-labeled shadow-button btn status-cancelled"
                        >
                          Đã hủy đơn
                        </span>
                      )}
                      {d.trang_thai === 18 && (
                        <span
                          style={{
                            width: '240px',
                            pointerEvents: 'none',
                            height: '30px',
                            borderRadius: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            backgroundColor: 'darkblue',
                            color: 'white'
                          }}
                          className="btn btn-labeled shadow-button btn status-cancelled"
                        >
                          Hoàn tiền thành công
                        </span>
                      )}
                    </td>
                    <td
                      style={{
                        fontSize: '12px',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        verticalAlign: 'middle'
                      }}
                      className="align-middle"
                    >
                      <div style={{ display: 'inline-block', textAlign: 'left' }}>
                        {d.loai_don === 0 && (
                          <span
                            style={{
                              width: '200px',
                              pointerEvents: 'none',
                              height: '30px',
                              borderRadius: '20px',
                              display: 'flex',
                              justifyContent: 'center',
                              justifyItems: 'center',
                              alignItems: 'center',
                              verticalAlign: 'middle',
                              fontWeight: 'bold'
                            }}
                            className="btn btn-labeled shadow-button btn btn-dark status-completed"
                          >
                            Tại Quầy
                          </span>
                        )}
                        {d.loai_don === 1 && (
                          <span
                            style={{
                              width: '200px',
                              pointerEvents: 'none',
                              height: '30px',
                              borderRadius: '20px',
                              display: 'flex',
                              justifyContent: 'center',
                              justifyItems: 'center',
                              verticalAlign: 'middle',
                              alignItems: 'center',
                              fontWeight: 'bold',
                              backgroundColor: '#126e3bff',
                              color: 'white'
                            }}
                            className="btn btn-labeled shadow-button btn status-completed"
                          >
                            Đặt Hàng Online
                          </span>
                        )}
                      </div>
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

            <div style={{ display: 'flex', justifyContent: 'end' }} className="export-form">
              <div style={{ paddingRight: 30 }}>
                <button
                  onClick={handleXacNhanDH}
                  className={`relative inline-block text-base group ${
                    isChecked.some((checked, index) => checked && data[index].trang_thai === 1) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={isChecked.some((checked, index) => checked && data[index].trang_thai === 1)}
                >
                  <span className="relative z-10 block px-8 py-3 overflow-hidden font-medium leading-tight text-gray-800 transition-colors duration-300 ease-out border-2 border-gray-900 rounded-lg group-hover:text-white">
                    <span className="absolute inset-0 w-full h-full px-8 py-3 rounded-lg bg-gray-50"></span>
                    <span className="absolute left-0 w-48 h-48 -ml-5 transition-all duration-300 origin-top-right -rotate-90 -translate-x-full translate-y-12 bg-gray-900 group-hover:-rotate-180 ease"></span>
                    <span className="relative">Xác nhận</span>
                  </span>
                  <span
                    className="absolute bottom-0 right-0 w-full h-10 -mb-1 -mr-1 transition-all duration-200 ease-linear bg-gray-900 rounded-lg group-hover:mb-0 group-hover:mr-0"
                    data-rounded="rounded-lg"
                  ></span>
                </button>
              </div>

              <div>
                <button
                  onClick={handleHuyDon}
                  className={`relative inline-block text-base group ${
                    isChecked.some((checked, index) => checked && data[index].ten === 'VNPay') ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={isChecked.some((checked, index) => checked && data[index].ten === 'VNPay')}
                >
                  <span className="relative z-10 block px-8 py-3 overflow-hidden font-medium leading-tight text-gray-800 transition-colors duration-300 ease-out border-2 border-gray-900 rounded-lg group-hover:text-white">
                    <span className="absolute inset-0 w-full h-full px-8 py-3 rounded-lg bg-gray-50"></span>
                    <span className="absolute left-0 w-48 h-48 -ml-5 transition-all duration-300 origin-top-right -rotate-90 -translate-x-full translate-y-12 bg-gray-900 group-hover:-rotate-180 ease"></span>
                    <span className="relative" style={{ color: 'red' }}>
                      Hủy đơn
                    </span>
                  </span>
                  <span
                    className="absolute bottom-0 right-0 w-full h-10 -mb-1 -mr-1 transition-all duration-200 ease-linear bg-gray-900 rounded-lg group-hover:mb-0 group-hover:mr-0"
                    data-rounded="rounded-lg"
                  ></span>
                </button>
              </div>
            </div>
          </div>
        </Card>
      </MainCard>
    </div>
  );
}

export default DonHang;