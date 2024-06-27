/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { TextField } from '@mui/material';
import React from 'react';
import InputSpinner from 'react-bootstrap-input-spinner';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Tooltip from '@mui/material/Tooltip';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useState } from 'react';
import ButtonMUI from '@mui/material/Button';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';

function ModalTraHang(props) {
  const {
    show,
    handleClose,
    dataHDCT,
    convertToCurrency,
    setDataHDCT,
    setIsUpdate,
    listLyDo,
    dataSPDoi,
    handleOpen,
    valuesAdd,
    setValuesAdd,
    dataLogin,
    setTotalAmount,
    setDataHDCTDH,
    setIsUpdateHD,
    handleDelete,
    setDataSPDoi,
    totalAmountDH,
    setTotalAmountDH,
    totalAmountDHSP,
    setTotalAmountDHSP,
    handleDoiHang,
    yeuCauDoi,
    setYeuCauDoi,
    totalAmount
  } = props;
  const [value, setValue] = useState('Khác');

  // Hàm để thêm trường maxQuantity vào mỗi phần tử của mảng dataSPDoi
  const addMaxQuantityToData = () => {
    return dataSPDoi.map((d) => {
      const maxQuantityForItem = Math.floor(totalAmountDH / totalAmountDHSP);
      return {
        ...d,
        maxQuantity: maxQuantityForItem
      };
    });
  };

  const handleChange = (e, i) => {
    // Cập nhật số lượng vào sản phẩm d
    let updatedDataHDCT = [...dataSPDoi];
    updatedDataHDCT[i].soLuongHangDoi = e;
    let sum = 0;
    let count = 0;
    updatedDataHDCT.forEach((d) => {
      sum += d.soLuongHangDoi * d.donGia;
      count += d.soLuongHangDoi;
    });
    let sumDH = 0;
    let sumDG = 0;
    dataHDCT.forEach((d) => {
      sumDH += d.soLuongYeuCauDoi * d.donGia;
      sumDG += d.donGia;
    });
    setTotalAmount(sum - sumDH);
    setTotalAmountDH(sumDH);
    setTotalAmountDHSP(sumDG);
    // Thêm trường maxQuantity vào mỗi phần tử của mảng newDataSPDoi
    const dataWithMaxQuantity = addMaxQuantityToData();
    // Cập nhật state với số lượng mới của sản phẩm và maxQuantity tương ứng
    setDataSPDoi(dataWithMaxQuantity);
    setDataHDCTDH(dataWithMaxQuantity);
    setValuesAdd({
      ...valuesAdd,
      doiHang: {
        ...valuesAdd.doiHang,
        trangThai: 15,
        tongTienHangDoi: sum,
        soHangDoi: count,
        nguoiTao: dataLogin.ten,
        tienKhachPhaiTra: sum - sumDH
      }
    });
    setIsUpdateHD(true);
  };

  const handleChangeHD = (e, i) => {
    // Cập nhật số lượng vào sản phẩm d
    let updatedDataHDCT = [...dataHDCT];
    updatedDataHDCT[i].soLuongYeuCauDoi = e;
    setDataHDCT(updatedDataHDCT);
    setIsUpdate(true);
    let sum = 0;
    let count = 0;
    updatedDataHDCT.forEach((d) => {
      sum += d.soLuongYeuCauDoi * d.donGia;
    });
    let sumDH = 0;
    let sumDG = 0;
    dataSPDoi.forEach((d) => {
      sumDH += d.soLuongHangDoi * d.donGia;
      sumDG += d.donGia;
      count += d.soLuongYeuCauDoi;
    });
    setTotalAmount(sumDH - sum);
    setTotalAmountDH(sum);
    setTotalAmountDHSP(sumDG);
    setValuesAdd({
      ...valuesAdd,
      doiHang: {
        ...valuesAdd.doiHang,
        trangThai: 15,
        tongTienHangDoi: sum,
        soHangDoi: count,
        nguoiTao: dataLogin.tenKhachHang,
        tienKhachPhaiTra: sumDH - sum
      }
    });
  };

  console.log(valuesAdd);

  return (
    <div>
      <Modal
        style={{ paddingTop: 90, marginLeft: 150 }}
        show={show}
        onHide={handleClose}
        centered
        size="lg"
        keyboard={false}
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Đổi hàng{'   '}
            <Tooltip title="Bạn chỉ có thể đổi hàng trong vòng 15 ngày" placement="right">
              <i style={{ fontSize: 16 }} className="fa-regular fa-circle-question"></i>
            </Tooltip>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ height: '100%' }}>
          {dataHDCT.map((d, i) => (
            <div key={i} className="d-flex">
              <div className="me-3 mb-3">
                <img
                  src={`http://localhost:8080/api/chi-tiet-san-pham/${d.chiTietSanPham.id}`}
                  alt=""
                  style={{ width: 120, borderRadius: 15 }}
                />
              </div>
              <div className="mt-3" style={{ width: 260 }}>
                <p>
                  {d.chiTietSanPham.sanPham.ten}
                  <br />
                  {d.chiTietSanPham.kichCo.ten} -{' '}
                  <span style={{ backgroundColor: d.chiTietSanPham.mauSac.ten, borderRadius: '50%' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                </p>
              </div>
              <div style={{ width: 140 }} className="d-flex align-items-center justify-content-center ms-5">
                <InputSpinner
                  key={d.id}
                  type={'real'}
                  max={d.soLuong}
                  min={null}
                  step={1}
                  value={d.soLuongYeuCauDoi || null} // Sử dụng counts[i] thay vì count
                  onChange={(e) => handleChangeHD(e, i)}
                  variant={'dark'}
                  size="sm"
                />
              </div>
              <div className="d-flex align-items-center justify-content-center ms-5">
                <p style={{ color: 'red' }}>{convertToCurrency(d.donGia)}</p>
              </div>
              <div className="d-flex align-items-center justify-content-center ms-5">
                <p style={{ color: 'red' }}>{convertToCurrency(d.donGia * d.soLuongYeuCauDoi || 0)}</p>
              </div>
            </div>
          ))}

          {totalAmountDH > 0 && (
            <>
              <hr />
              <ButtonMUI variant="contained" onClick={handleOpen} className="mb-3 mt-1">
                Chọn sản phẩm
              </ButtonMUI>
              {dataSPDoi.map((d, i) => (
                <div key={i} className="d-flex">
                  <div className="me-3 mb-3">
                    <img
                      src={`http://localhost:8080/api/chi-tiet-san-pham/${d.chiTietSanPham.id}`}
                      alt=""
                      style={{ width: 120, borderRadius: 15 }}
                    />
                  </div>
                  <div className="mt-3" style={{ width: 200 }}>
                    <p>
                      {d.chiTietSanPham.sanPham.ten}
                      <br />
                      {d.chiTietSanPham.kichCo.ten} -{' '}
                      <span style={{ backgroundColor: d.chiTietSanPham.mauSac.ten, borderRadius: '50%' }}>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      </span>
                    </p>
                  </div>
                  <div style={{ width: 150 }} className="d-flex align-items-center justify-content-center ms-5">
                    <InputSpinner
                      key={d.id}
                      type={'real'}
                      max={d.chiTietSanPham.soLuong}
                      min={1}
                      step={1}
                      value={d.soLuongHangDoi || 0}
                      onChange={(e) => handleChange(e, i)}
                      variant={'dark'}
                      size="sm"
                    />
                  </div>
                  <div className="d-flex align-items-center justify-content-center ms-5">
                    <p style={{ color: 'red' }}>{convertToCurrency(d.donGia)}</p>
                  </div>
                  <div className="d-flex align-items-center justify-content-center ms-5">
                    <p style={{ color: 'red' }}>{convertToCurrency(d.donGia * d.soLuongHangDoi || 0)}</p>
                  </div>
                  <div className="d-flex align-items-center justify-content-center ms-5">
                    <button onClick={() => handleDelete(d.id)} className="fa-solid fa-trash mx-3"></button>
                  </div>
                </div>
              ))}
              <FormControl required sx={{ mb: 1, mt: 3, width: '100%' }}>
                <InputLabel id="demo-simple-select-required-label">Lý do trả hàng đơn hàng</InputLabel>
                <Select
                  labelId="demo-simple-select-required-label"
                  id="demo-simple-select-required"
                  value={value || 'Khác'} // Nếu ghiChu không có giá trị hoặc không khớp với bất kỳ label nào, sử dụng 'Khác'
                  label="Lý do trả hàng đơn hàng *"
                  onChange={(e) => {
                    setYeuCauDoi({ ...yeuCauDoi, lichSuHoaDon: { ghiChu: e.target.value } });
                    setValue(e.target.value);
                  }}
                >
                  {listLyDo.map((d, i) => (
                    <MenuItem key={i} value={d.label}>
                      {d.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {(value === 'Khác' || yeuCauDoi.lichSuHoaDon.ghiChu === '') && (
                <TextField
                  style={{ width: '100%' }}
                  variant="outlined"
                  onChange={(e) => setYeuCauDoi({ ...yeuCauDoi, lichSuHoaDon: { ghiChu: e.target.value } })}
                />
              )}
              {totalAmount !== 0 && totalAmount > 0 && (
                <div className="d-flex justify-content-between align-items-center">
                  <FormControl>
                    <FormLabel id="demo-row-radio-buttons-group-label">Phương thức thanh toán</FormLabel>
                    <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="row-radio-buttons-group">
                      {totalAmount < 50000000 && (
                        <FormControlLabel
                          // checked={true}
                          value={true}
                          control={<Radio />}
                          label="Tiền mặt"
                          onChange={() =>
                            setValuesAdd({
                              ...valuesAdd,
                              doiHang: {
                                ...valuesAdd.doiHang,
                                phuongThucThanhToan: true
                              }
                            })
                          }
                        />
                      )}
                      <FormControlLabel
                        value={false}
                        control={<Radio />}
                        label="VNPAY"
                        onChange={() =>
                          setValuesAdd({
                            ...valuesAdd,
                            doiHang: {
                              ...valuesAdd.doiHang,
                              phuongThucThanhToan: false
                            }
                          })
                        }
                      />
                    </RadioGroup>
                  </FormControl>

                  {totalAmount > 0 && (
                    <h4>
                      Khách phải trả: <span style={{ color: 'red' }}> {convertToCurrency(totalAmount)}</span>
                    </h4>
                  )}
                </div>
              )}
              {totalAmount < 0 && (
                <h4 style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 10 }}>
                  Tiền trả khách: <span style={{ color: 'red' }}> {convertToCurrency(-totalAmount)}</span>
                </h4>
              )}
            </>
          )}
        </Modal.Body>
        {totalAmountDH > 0 && (
          <>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Huỷ
              </Button>
              <Button variant="primary" onClick={handleDoiHang}>
                Xác nhận
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </div>
  );
}

export default ModalTraHang;