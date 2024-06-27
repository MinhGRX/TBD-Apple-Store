/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import '../../scss/Card.scss';
import { Table } from 'react-bootstrap';
import { useEffect } from 'react';
import { useState } from 'react';
import InputSpinner from 'react-bootstrap-input-spinner';
import { Link, useNavigate } from 'react-router-dom';
import { deleteSPInGH, getAllGH, postGH, updateSLGH } from 'services/GioHangService';
import { updateSL } from 'services/SanPhamService';
import { toast } from 'react-toastify';
import { Avatar } from '@mui/material';

function Cart(props) {
  // const [quantity, setQuantity] = useState(1);
  const [totalAmount, setTotalAmount] = useState(0);
  const [check, setCheck] = useState(false);
  const [idGHCT, setIdGHCT] = useState('');
  const [productList, setProductList] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [listSP, setListSP] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [temporaryProductAfter, setTemporaryProductAfter] = useState([]);
  const navigate = useNavigate();
  // eslint-disable-next-line react/prop-types
  const { setProductCount, productCount, idGH, dataLogin, countSP } = props;
  const [valuesUpdateGH, setValuesUpdateGH] = useState({
    chiTietSanPham: {
      id: ''
    },
    soLuong: 1
  });
  // const hoaDonChiTietList = selectedProducts.map((product) => {
  //   return {
  //     chiTietSanPham: {
  //       id: product.id
  //       // Các trường khác của chi tiết sản phẩm nếu cần
  //     },
  //     soLuong: product.soLuong, // Thêm số lượng
  //     donGia: product.soLuong * product.donGia // Thêm giá bán
  //   };
  // });

  useEffect(() => {
    const storedProductList = JSON.parse(localStorage.getItem('product'));
    if (storedProductList) {
      setProductList(storedProductList);
      setTemporaryProductAfter(storedProductList);
    }
  }, []);

  useEffect(() => {
    if (idGH) {
      getAll(idGH);
    }
  }, [idGH]);

  useEffect(() => {
    if (check) {
      update(idGHCT, valuesUpdateGH);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valuesUpdateGH]);

  useEffect(() => {
    // Tính tổng tiền khi valuesSanPham thay đổi
    let sum = 0;
    selectedProducts.forEach((d) => {
      sum += d.soLuong * d.donGia;
    });
    // Cập nhật giá trị tổng tiền
    setTotalAmount(sum);
  }, [selectedProducts, dataLogin]);

  const handleTaoHoaDon = () => {
    if (selectedProducts.length === 0) {
      toast.error('Vui lòng chọn sản phẩm trước khi thanh toán');
      return;
    }
    if (totalAmount >= 50000000) {
      toast.error('Đơn tối thiểu khi đặt không được phép lớn hơn 50.000.000đ');
      return;
    }
    let hasError = false;

    selectedProducts.forEach((product) => {
      if (product.soLuong > product.chiTietSanPham.soLuong) {
        toast.error('Không còn đủ hàng để thanh toán');
        hasError = true;
        return;
      }
      if (product.chiTietSanPham.sanPham.trangThai === 0 || product.chiTietSanPham.trangThai === 0) {
        toast.error('Mặt hàng này đã ngừng kinh doanh');
        hasError = true;
        return;
      }
    });

    if (!hasError) {
      taoHoaDon('', selectedProducts);
    }
  };

  const taoHoaDon = async (nguoiTao, value) => {
    const res = await postGH(nguoiTao, value);
    if (res || value) {
      navigate(`/checkout/${res.data}`);
    }
  };

  const putSl = async (idCTSP, soLuong) => {
    try {
      await updateSL(idCTSP, soLuong);
    } catch (error) {
      // Xử lý lỗi nếu cần
    }
  };

  const getAll = async (id) => {
    try {
      const res = await getAllGH(id);
      if (res) {
        setListSP(res.data);
      }
    } catch (error) {
      // Xử lý lỗi nếu cần
    }
  };

  const update = async (id, value) => {
    try {
      const res = await updateSLGH(id, value);
      if (res) {
        countSP(idGH);
        getAll(idGH);
      }
    } catch (error) {
      // Xử lý lỗi nếu cần
    }
  };

  const handleUpdate = (e, id, soLuong, tongSoLuong, idCTSP) => {
    setIdGHCT(id);
    setCheck(true);
    setValuesUpdateGH({
      ...valuesUpdateGH,
      chiTietSanPham: {
        id: idCTSP
      },
      soLuong: e
    });
    const updatedSelectedProducts = selectedProducts.map((product) => {
      if (product.chiTietSanPham.id === idCTSP) {
        return {
          ...product,
          soLuong: e
        };
      }
      return product;
    });

    setSelectedProducts(updatedSelectedProducts);
  };

  const deleteProductInCart = async (id) => {
    try {
      const res = await deleteSPInGH(id);
      if (res) {
        toast.success('Xoá thành công');
        getAll(idGH);
        countSP(idGH);
      }
    } catch (error) {
      // Xử lý lỗi nếu cần
    }
  };

  const handleDelete = (id, soLuong, tongSoLuong) => {
    if (dataLogin && dataLogin.role == 'KH') {
      deleteProductInCart(id);
    } else {
      putSl(id, tongSoLuong + soLuong);
      const storedData = JSON.parse(localStorage.getItem('product'));
      const updatedData = storedData.filter((item) => item.id !== id);
      setProductCount(productCount - soLuong);
      localStorage.setItem('product', JSON.stringify(updatedData));
      const storedProductList = JSON.parse(localStorage.getItem('product'));
      if (storedProductList) {
        setProductList(storedProductList);
      }
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

  const handleCheckAll = () => {
    setSelectAll(!selectAll);

    // Tùy thuộc vào trạng thái selectAll, bạn có thể cập nhật danh sách sản phẩm đã chọn
    if (selectAll) {
      setSelectedProducts([]);
      setTemporaryProductAfter([...productList]);
    } else {
      if (dataLogin && dataLogin.role == 'KH') {
        setSelectedProducts([...listSP]);
      } else {
        setSelectedProducts([...productList]);
        setTemporaryProductAfter([]);
      }
    }
  };

  const handleCheckboxChange = (product) => {
    const isSelected = selectedProducts.some((p) => p.id === product.id);

    if (isSelected) {
      // Nếu đã chọn, loại bỏ sản phẩm khỏi danh sách đã chọn
      setSelectedProducts(selectedProducts.filter((p) => p.id !== product.id));
      setTemporaryProductAfter([...temporaryProductAfter, product]);
    } else {
      // Nếu chưa chọn, thêm sản phẩm vào danh sách đã chọn
      setSelectedProducts([...selectedProducts, product]);
      setTemporaryProductAfter(temporaryProductAfter.filter((p) => p.id !== product.id));
    }
  };

  console.log(selectedProducts);

  return (
    <div>
      <div className="container">
        <div>
          <p style={{ paddingLeft: 30, fontSize: 20, paddingTop: 30, display: 'flex' }}>
            <Link to="/trang-chu" style={{ color: 'black', textDecorationLine: 'none' }}>
              <p className="trangChu">Trang chủ&nbsp;</p>
            </Link>{' '}
            {'>'}
            <p style={{ textDecorationLine: 'none' }} className="sanPham">
              &nbsp;Giỏ hàng
            </p>
          </p>
        </div>
        <hr></hr>
      </div>
      <div className="wrapper container">
        <div className="row">
          <div className="col-md-8">
            <div className="cart-san-pham">
              <div className="col-12 d-flex justify-content-start title-gio-hang">
                <h1 style={{ fontSize: '25px' }}>Giỏ hàng</h1>
              </div>
              <div className="col-12" style={{ paddingLeft: '25px', paddingBottom: '10px', paddingRight: '25px' }}>
                <Table striped hover className="my-2">
                  <tr>
                    <td>
                      <input
                        className={`form-check-input`}
                        style={{ border: '1px solid black' }}
                        type="checkbox"
                        value=""
                        id="checkAll"
                        checked={selectAll}
                        onChange={handleCheckAll}
                      />
                    </td>
                    <td>Sản phẩm</td>
                    <td>&nbsp;</td>
                    <td>Đơn giá</td>
                    <td>Số lượng</td>
                    <td>Thành tiền</td>
                    <td>Action</td>
                  </tr>
                  {listSP.map((product, index) => (
                    <tr key={index}>
                      <td>
                        <input
                          type="checkbox"
                          name=""
                          id=""
                          checked={selectedProducts.some((p) => p.id === product.id)}
                          onChange={() => handleCheckboxChange(product)}
                        />
                      </td>
                      <td>
                        <Avatar
                          alt={product.chiTietSanPham.sanPham.ten}
                          src={`http://localhost:8080/api/chi-tiet-san-pham/${product.chiTietSanPham.id}`}
                          sx={{ width: 80, height: 110 }}
                          variant="rounded"
                        />
                      </td>
                      <td>
                        {product.chiTietSanPham.sanPham.ten} <br />
                        {product.chiTietSanPham.kichCo.ten} -{' '}
                        <span
                          className="color-circle"
                          style={{
                            backgroundColor: product.chiTietSanPham.mauSac.ten,
                            display: 'inline-block',
                            verticalAlign: 'middle',
                            height: '2px',
                            width: '10px'
                          }}
                        ></span>
                      </td>
                      <td>{convertToCurrency(product.donGia)}</td>
                      <td>
                        <div
                          className="input-spinner"
                          style={{ display: 'flex', alignItems: 'center', width: 140, justifyContent: 'center' }}
                        >
                          <InputSpinner
                            max={product.chiTietSanPham.soLuong + product.soLuong}
                            min={1}
                            className="input-spinner"
                            step={1}
                            variant={'dark'}
                            type="real"
                            size="md"
                            value={product.soLuong}
                            onChange={(e) =>
                              handleUpdate(e, product.id, product.soLuong, product.chiTietSanPham.soLuong, product.chiTietSanPham.id)
                            }
                          />
                        </div>
                      </td>
                      <td>{convertToCurrency(product.donGia * product.soLuong)}</td>
                      <td>
                        <button
                          onClick={() => handleDelete(product.id, product.soLuong, product.chiTietSanPham.soLuong)}
                          className="fa-solid fa-trash mx-3"
                        ></button>
                      </td>
                    </tr>
                  ))}
                </Table>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="cart-san-pham">
              <div className="col-12 tong-tien-cart">
                <div className="text-total">
                  <p>
                    Tổng tiền: <strong>{convertToCurrency(totalAmount)}</strong>
                  </p>
                </div>
                <button type="button" className="btn btn-success" onClick={handleTaoHoaDon}>
                  Thanh toán
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;