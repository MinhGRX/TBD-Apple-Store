/* eslint-disable jsx-a11y/alt-text */
import SlideBar from 'layout/SlideBar';
import '../../scss/information.scss';
import React from 'react';
import Footer from 'ui-component/trangchu/Footer';
import Header from 'ui-component/trangchu/Header';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent, { timelineOppositeContentClasses } from '@mui/lab/TimelineOppositeContent';
import Button from '@mui/material/Button';
import { useNavigate, useParams } from 'react-router';
import { detailLSHD, detailHD, getById, getKmById } from 'services/ServiceDonHang';
import { useEffect } from 'react';
import { useState } from 'react';

function ChiTietDonHang() {
  const [steps, setSteps] = useState(['Đặt đơn', 'Thanh toán', 'Giao hàng', 'Hoàn thành']);
  const { id } = useParams();
  const navigate = useNavigate();
  const [dataDetailLSHD, setDataDetailLSHD] = useState([]);
  const [dataHDCT, setHDCT] = useState([]);
  const [dataKM, setKM] = useState([]);
  const [dataHD, setDataHD] = useState({});
  const [lyDo, setLyDo] = useState('');

  useEffect(() => {
    listLSHD(id);
    getOneHD(id);
    getAllHDCT(id);
    getAllKM(id);
  }, [id]);

  useEffect(() => {
    const lyDo = dataDetailLSHD.filter((d) => d.trangThai === 14 || d.trangThai === 15);
    if (lyDo[0] !== undefined) {
      setLyDo(lyDo[0].ghiChu);
      console.log(lyDo[0].ghiChu);
    }
  }, [dataDetailLSHD, id]);

  const getOneHD = async (id) => {
    const res = await detailHD(id);
    if (res) {
      setDataHD(res.data);
      if ((res.data.trangThai === 2 || res.data.trangThai === 14) && res.data.hinhThucThanhToan.ten === 'Tiền mặt') {
        setSteps(['Yêu cầu huỷ đơn', 'Huỷ đơn']);
      } else if ((res.data.trangThai === 2 || res.data.trangThai === 14) && res.data.hinhThucThanhToan.ten === 'VNPay') {
        setSteps(['Yêu cầu huỷ đơn', 'Hoàn tiền', 'Huỷ đơn']);
      } else if (
        (res.data.trangThai === 2 || res.data.trangThai === 15 || res.data.trangThai === 16) &&
        res.data.hinhThucThanhToan.ten === 'VNPay'
      ) {
        setSteps(['Yêu cầu Đổi hàng', 'Đổi hàng thành công']);
      } else if (
        (res.data.trangThai === 2 || res.data.trangThai === 15 || res.data.trangThai === 16) &&
        res.data.hinhThucThanhToan.ten === 'Tiền mặt'
      ) {
        setSteps(['Yêu cầu Đổi hàng', 'Đổi hàng thành công']);
      } else if ((res.data.trangThai === 2 || res.data.trangThai === 17) && res.data.hinhThucThanhToan.ten === 'VNPay') {
        setSteps(['Yêu cầu Đổi hàng', 'Đổi hàng thất bại']);
      } else if ((res.data.trangThai === 2 || res.data.trangThai === 17) && res.data.hinhThucThanhToan.ten === 'Tiền mặt') {
        setSteps(['Yêu cầu Đổi hàng', 'Đổi hàng thất bại']);
      }
    }
  };

  const getAllKM = async (id) => {
    const res = await getKmById(id);
    if (res) {
      setKM(res.data);
    }
  };

  const getAllHDCT = async (id) => {
    const res = await getById(id);
    if (res) {
      setHDCT(res.data);
    }
  };

  const listLSHD = async (id) => {
    const res = await detailLSHD(id);
    if (res) {
      setDataDetailLSHD(res.data.reverse());
    }
  };

  function formatDate(dateString) {
    const dateObject = new Date(dateString);

    const day = dateObject.getDate();
    const month = dateObject.getMonth() + 1; // Tháng bắt đầu từ 0, cần cộng thêm 1
    const year = dateObject.getFullYear();
    const hours = dateObject.getHours();
    const minutes = dateObject.getMinutes();

    // Sử dụng padStart để đảm bảo phút luôn có 2 chữ số
    const formattedMinutes = minutes.toString().padStart(2, '0');
    // Sử dụng padStart để đảm bảo phút luôn có 2 chữ số
    const formattedHours = hours.toString().padStart(2, '0');
    // Sử dụng padStart để đảm bảo phút luôn có 2 chữ số
    const formattedDay = day.toString().padStart(2, '0');
    // Sử dụng padStart để đảm bảo phút luôn có 2 chữ số
    const formattedMonth = month.toString().padStart(2, '0');

    const formattedDate = `${formattedHours}:${formattedMinutes} ${formattedDay}/${formattedMonth}/${year}`;

    return formattedDate;
  }

  function convertToCurrency(number) {
    // Chuyển đổi số thành định dạng tiền Việt Nam
    const formatter = new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    });
    return formatter.format(number);
  }

  return (
    <div>
      <Header />
      <div className="container">
        <div className="row slide-bar mt-4">
          <div className="col-3 slide-bar-children">
            <SlideBar></SlideBar>
          </div>
          <div className="col-9">
            <div className="user-details row">
              <div className="col-12 d-flex align-items-center justify-content-between">
                <Button className="back-to-history" variant="text" onClick={() => navigate(`/history`)}>
                  {'<'} Trở lại
                </Button>
                <h6 className="d-flex align-items-center" style={{ color: 'red' }}>
                  {dataHD.trangThai === 0
                    ? 'Chờ xác nhận'
                    : dataHD.trangThai === 1
                    ? 'Chờ giao hàng'
                    : dataHD.trangThai === 2
                    ? 'Huỷ đơn'
                    : dataHD.trangThai === 3 || dataHD.trangThai === 8 || dataHD.trangThai === 9 || dataHD.trangThai === 10
                    ? 'Đang giao hàng'
                    : dataHD.trangThai === 5 || dataHD.trangThai === 1 || dataHD.trangThai === 12 || dataHD.trangThai === 13
                    ? 'Đang giao hàng'
                    : dataHD.trangThai === 4
                    ? 'Giao hàng thành công'
                    : dataHD.trangThai === 14
                    ? 'Yêu cầu huỷ đơn'
                    : dataHD.trangThai === 15
                    ? 'Yêu cầu Đổi hàng'
                    : dataHD.trangThai === 16
                    ? 'Đổi hàng thành công'
                    : dataHD.trangThai === 17
                    ? 'Đổi hàng thất bại'
                    : dataHD.trangThai === 6
                    ? 'Thanh toán thành công'
                    : 'Hoàn thành'}
                </h6>
              </div>
              <div className="col-12 d-flex align-items-center" style={{ height: 170, borderBottom: '1px solid gray' }}>
                <Box sx={{ width: '100%' }}>
                  <Stepper
                    activeStep={
                      dataHD.trangThai === 0 || dataHD.trangThai === 14
                        ? 0
                        : dataHD.trangThai === 1
                        ? 2
                        : dataHD.trangThai === 2
                        ? 2
                        : dataHD.trangThai === 3 || dataHD.trangThai === 8 || dataHD.trangThai === 9 || dataHD.trangThai === 10
                        ? 2
                        : dataHD.trangThai === 5 || dataHD.trangThai === 1 || dataHD.trangThai === 12 || dataHD.trangThai === 13
                        ? 2
                        : dataHD.trangThai === 4
                        ? 2
                        : dataHD.trangThai === 6
                        ? 1
                        : dataHD.trangThai === 15
                        ? 0
                        : dataHD.trangThai === 16
                        ? 3
                        : 3
                    }
                    alternativeLabel
                  >
                    {steps.map((label, i) => (
                      <Step key={i}>
                        <StepLabel>{label}</StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                </Box>
              </div>
              <h4 style={{ padding: '20px 0 20px 30px' }}>Địa chỉ nhận hàng</h4>
              <div className="col-12 d-flex">
                <div className="col-5">
                  <h6 style={{ padding: '0 0 0 20px' }}> {dataHD.tenNguoiNhan}</h6>
                  <p style={{ padding: '0 20px 0 20px' }}>
                    {dataHD.soDienThoai} <br />
                    {dataHD.diaChi}, {dataHD.xa}, {dataHD.huyen}, {dataHD.tinh}
                  </p>
                </div>
                <div className="col-7" style={{ borderLeft: '1px solid gray' }}>
                  <Timeline
                    sx={{
                      [`& .${timelineOppositeContentClasses.root}`]: {
                        flex: 0.2
                      }
                    }}
                  >
                    {dataDetailLSHD.map((d, i) => (
                      <TimelineItem key={i}>
                        <TimelineOppositeContent color="textSecondary">{formatDate(d.ngayTao)}</TimelineOppositeContent>
                        <TimelineSeparator>
                          <TimelineDot color={d.trangThai === dataHD.trangThai ? 'success' : 'grey'} />
                          {i < dataDetailLSHD.length - 1 && <TimelineConnector />}
                        </TimelineSeparator>
                        <TimelineContent>{d.trangThai === dataHD.trangThai ? <strong>{d.ten}</strong> : d.ten}</TimelineContent>
                      </TimelineItem>
                    ))}
                  </Timeline>
                </div>
              </div>
              {dataHDCT.map((d, i) => (
                <div key={i} className="col-12 row d-flex align-items-center">
                  <div className="col-2">
                    <img
                      src={`http://localhost:8080/api/chi-tiet-san-pham/${d.chiTietSanPham.id}`}
                      className="product-image"
                      style={{ width: '120px', height: '130px' }}
                    />
                  </div>
                  <div className="col-2">
                    <h6>{d.chiTietSanPham.sanPham.ten}</h6>
                    <span>
                      {d.chiTietSanPham.kichCo.ten} -{' '}
                      <span
                        className="color-circle"
                        style={{
                          backgroundColor: d.chiTietSanPham.mauSac.ten,
                          display: 'inline-block',
                          verticalAlign: 'middle'
                        }}
                      ></span>
                    </span>
                  </div>
                  <div className="col-2 d-flex justify-content-end">x{d.soLuong}</div>
                  <div className="col-2"></div>
                  <div className="col-2">
                    {' '}
                    <span>{convertToCurrency(d.donGia)}</span>
                  </div>
                  <div style={{ color: 'red' }} className="col-2 d-flex justify-content-end">
                    {convertToCurrency(d.soLuong * d.donGia)}
                  </div>
                </div>
              ))}
              <div className="col-12 d-flex justify-content-end">
                <div className="col-7">&nbsp;</div>
                <div className="col-5 d-flex justify-content-between">
                  <h6>Phương thức thanh toán:</h6>
                  <h6>{dataHD.hinhThucThanhToan && dataHD.hinhThucThanhToan.ten}</h6>
                </div>{' '}
              </div>
              <div className="col-12 d-flex justify-content-end">
                <div className="col-7">&nbsp;</div>
                <div className="col-5 d-flex justify-content-between">
                  <h6>Tổng tiền:</h6>
                  <h6>{convertToCurrency(dataHD.tongTien)}</h6>
                </div>
              </div>
              <div className="col-12 d-flex justify-content-end">
                <div className="col-7">&nbsp;</div>
                <div className="col-5 d-flex justify-content-between">
                  <h6>Tiền ship:</h6>
                  <h6>{convertToCurrency(dataHD.tienShip)}</h6>
                </div>
              </div>
              {dataKM.map((d, i) => (
                <div key={i} className="col-12 d-flex justify-content-end">
                  <div className="col-7">&nbsp;</div>
                  <div className="col-5 d-flex justify-content-between">
                    <h6>Tiền giảm:</h6>
                    <h6>-{convertToCurrency(d.tienGiam)}</h6>
                  </div>
                </div>
              ))}
              <div className="col-12 d-flex justify-content-end">
                <div className="col-7">&nbsp;</div>
                <div className="col-5 d-flex justify-content-between">
                  <h5 style={{ color: 'red' }}>Thành tiền:</h5>
                  <h5 style={{ color: 'red' }}>{convertToCurrency(dataHD.tongTienKhiGiam)}</h5>
                </div>
              </div>
              {lyDo ? (
                <div className="col-12 d-flex justify-content-start">
                  <p style={{ fontSize: 17 }}>Lý do: {lyDo}</p>
                </div>
              ) : (
                ''
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ChiTietDonHang;