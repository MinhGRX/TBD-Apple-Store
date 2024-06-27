/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
// import { Card } from '@mui/material';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import { useState } from 'react';
import {
  getAllListCL,
  getAllListCO,
  getAllListKC,
  getAllListLSP,
  getAllListMS,
  getAllListNSX,
  postCTSP,
  checkTrung
} from 'services/SanPhamService';
import { useEffect } from 'react';
import '../../scss/SanPham.scss';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import { postCreate } from 'services/ServiceChatLieu';
import { postCreate as postCa } from 'services/ServiceCoAo';
import { add } from 'services/LoaiSanPhamService';
import { postNSX } from 'services/NhaSanXuatService';
import MyVerticallyCenteredModal from './AddQuicklyChatLuong';
import { Autocomplete, TextField } from '@mui/material';
import AddMauSac from './AddQuicklyMauSac';
import { postMS } from 'services/ServiceMauSac';
import { postCreate as postKC, checkTrung1 } from 'services/KichCoService';
function AddSanPham() {
  const [listCL, setListCL] = useState([]);
  const [listNSX, setListNSX] = useState([]);
  const [listLSP, setListLSP] = useState([]);
  const [listCA, setListCA] = useState([]);
  const [listMS, setListMS] = useState([]);
  const [listKC, setListLC] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [modalShowCA, setModalShowCA] = useState(false);
  const [modalShowLSP, setModalShowLSP] = useState(false);
  const [modalShowKC, setModalShowKC] = useState(false);
  const [modalShowMS, setModalShowMS] = useState(false);
  const [modalShowNSX, setModalShowNSX] = useState(false);
  const [isHidden, setIsHidden] = useState(true);
  const [confirmClicked, setConfirmClicked] = useState(false);

  const navigate = useNavigate();

  const [values, setValues] = useState({
    chatLieu: {
      id: ''
    },
    sanPham: {
      ten: '',
      moTa: ''
    },
    loaiSanPham: {
      id: ''
    },
    nhaSanXuat: {
      id: ''
    },
    coAo: {
      id: ''
    },
    kichCo: {
      id: ''
    },
    mauSac: {
      id: ''
    },
    soLuong: '',
    giaBan: '',
    trangThai: 1
  });

  const [valuesMS, setValuesMS] = useState({
    ten: '#ffffffff',
    ma: '',
    trangThai: 0
  });

  const [valuesCL, setValuesCL] = useState({
    ten: '',
    trangThai: 0
  });

  const closeModal = () => {
    setModalShowCA(false);
    setModalShow(false);
    setModalShowNSX(false);
    setModalShowLSP(false);
    setModalShowKC(false);
    setModalShowMS(false);
    getAllList();
    setValuesCL({
      ten: '',
      trangThai: 0
    });
    setValuesMS({
      ten: '#ffffffff',
      ma: '',
      trangThai: 0
    });
  };

  const handleAddNSX = async (event) => {
    event.preventDefault();
    if (!valuesCL.ten.trim()) {
      toast.error('Vui lòng nhập tên nhà sản xuất.');
      return;
    }
    if (valuesCL.ten.length > 50) {
      toast.error('Tên nhà sản xuất không được vượt quá 50 ký tự.');
      return;
    }
    // Kiểm tra nếu tên chất liệu chứa số hoặc ký tự đặc biệt
    if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(valuesCL.ten)) {
      toast.error('Tên nhà sản xuất chỉ được chứa ký tự chữ cái và khoảng trắng.');
      return;
    }
    try {
      await addNSX(valuesCL);
    } catch (error) {
      // Nếu có lỗi từ service, hiển thị thông báo lỗi
      toast.error('Tên nhà sản xuất đã tồn tại');
    }
  };

  const addNSX = async (value) => {
    const res = await postNSX(value);
    if (res) {
      toast.success('Thêm thành công');
      closeModal();
    }
  };

  const handleAddLSP = async (event) => {
    event.preventDefault();
    if (!valuesCL.ten.trim()) {
      toast.error('Vui lòng nhập tên loại sản phẩm.');
      return;
    }
    if (valuesCL.ten.length > 50) {
      toast.error('Tên loại sản phẩm không được vượt quá 50 ký tự.');
      return;
    }
    // Kiểm tra nếu tên chất liệu chứa số hoặc ký tự đặc biệt
    if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(valuesCL.ten)) {
      toast.error('Tên loại sản phẩm chỉ được chứa ký tự chữ cái và khoảng trắng.');
      return;
    }
    try {
      await addLSP(valuesCL);
    } catch (error) {
      // Nếu có lỗi từ service, hiển thị thông báo lỗi
      toast.error('Tên loại sản phẩm đã tồn tại');
    }
  };

  const addLSP = async (value) => {
    const res = await add(value);
    if (res) {
      toast.success('Thêm thành công');
      closeModal();
    }
  };

  const handleSubmitCA = async (event) => {
    event.preventDefault();
    if (!valuesCL.ten.trim()) {
      toast.error('Vui lòng nhập tên cổ áo.');
      return;
    }
    if (valuesCL.ten.length > 50) {
      toast.error('Tên cổ áo không được vượt quá 50 ký tự.');
      return;
    }
    // Kiểm tra nếu tên chất liệu chứa số hoặc ký tự đặc biệt
    if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(valuesCL.ten)) {
      toast.error('Tên cổ áo chỉ được chứa ký tự chữ cái và khoảng trắng.');
      return;
    }
    try {
      await postCA(valuesCL);
    } catch (error) {
      // Nếu có lỗi từ service, hiển thị thông báo lỗi
      toast.error('Tên cổ áo đã tồn tại');
    }
  };

  const postCA = async (value) => {
    const res = await postCa(value);
    if (res) {
      toast.success('Thêm thành công');
      closeModal();
    }
  };

  const handleSubmitCL = async (event) => {
    event.preventDefault();
    if (!valuesCL.ten.trim()) {
      toast.error('Vui lòng nhập tên chất liệu.');
      return;
    }

    if (valuesCL.ten.length > 50) {
      toast.error('Tên chất liệu không được vượt quá 50 ký tự.');
      return;
    }

    // Kiểm tra nếu tên chất liệu chứa số hoặc ký tự đặc biệt
    if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(valuesCL.ten)) {
      toast.error('Tên chất liệu chỉ được chứa ký tự chữ cái và khoảng trắng.');
      return;
    }
    try {
      await post(valuesCL);
    } catch (error) {
      // Nếu có lỗi từ service, hiển thị thông báo lỗi
      toast.error('Tên chất liệu đã tồn tại');
    }
  };

  const post = async (value) => {
    const res = await postCreate(value);
    if (res) {
      toast.success('Thêm thành công');
      closeModal();
    }
  };

  useEffect(() => {
    getAllList();
  }, []);

  const check = async (ten) => {
    try {
      const response = await checkTrung(ten);
      return response.data;
    } catch (error) {
      console.error('Lỗi kiểm tra trùng lặp tên:', error);
      return true;
    }
  };

  const postctsp = async (value) => {
    const res = await postCTSP(value);
    if (res) {
      toast.success('Thêm thành công');
      navigate(`/san-pham/chi-tiet-san-pham/detail/${res.data.id}/${res.data.sanPham.id}`);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!values.mauSac.id || !values.kichCo.id || !values.soLuong) {
      toast.error('Vui lòng chọn thuộc tính để thêm vào sản phẩm');
      return;
    }
    await postctsp(values);
  };

  const handleConfirmClick = async () => {
    // Perform validation
    if (values.sanPham.ten.trim() === '' || values.giaBan.trim() === '' || values.sanPham.moTa.trim() === '') {
      // Display an error message or prevent confirmation
      toast.error('Vui lòng điền đầy đủ thông tin tên, mô tả và giá bán.');
      return;
    }
    if (values.giaBan <= 0) {
      toast.error('Vui lòng nhập giá bán lớn hơn 0');
      return;
    }
    const isDuplicate = await check(values.sanPham.ten);
    if (isDuplicate) {
      toast.error('Tên đã tồn tại');
      return;
    }
    toast.success('Xác nhận thành công');
    setIsHidden(false);
    setConfirmClicked(true);
    // Validation passed, update the states
  };

  const getAllList = async () => {
    const resCL = await getAllListCL();
    const resLSP = await getAllListLSP();
    const resCA = await getAllListCO();
    const resNSX = await getAllListNSX();
    const resMS = await getAllListMS();
    const resKC = await getAllListKC();
    if (resCL || resLSP || resCA || resNSX || resMS || resKC) {
      setListCL(resCL.data);
      setListCA(resCA.data);
      setListLSP(resLSP.data);
      setListNSX(resNSX.data);
      setListMS(resMS.data);
      setListLC(resKC.data);
      if (
        resCL.data.length > 0 ||
        resCA.data.length > 0 ||
        resLSP.data.length > 0 ||
        resNSX.data.length > 0 ||
        resKC.data.length > 0 ||
        resMS.data.length > 0
      ) {
        setValues({
          ...values,
          chatLieu: {
            id: resCL.data[0].id
          },
          coAo: {
            id: resCA.data[0].id
          },
          loaiSanPham: {
            id: resLSP.data[0].id
          },
          nhaSanXuat: {
            id: resNSX.data[0].id
          },
          kichCo: {
            id: resKC.data[0].id
          },
          mauSac: {
            id: resMS.data[0].id
          }
        });
      }
    }
  };

  const handleAutocompleteChange = (event, value) => {
    const selectedMauSac = listMS.find((item) => item.ma === value);
    if (selectedMauSac) {
      setValues({
        ...values,
        mauSac: {
          id: selectedMauSac.id
        }
      });
    } else {
      setValues({
        ...values,
        mauSac: {
          id: ''
        }
      });
    }
  };

  const handleAutocompleteChangeKC = (event, value) => {
    const selectedKichCo = listKC.find((item) => item.ten === value);
    if (selectedKichCo) {
      setValues({
        ...values,
        kichCo: {
          id: selectedKichCo.id
        }
      });
    } else {
      setValues({
        ...values,
        kichCo: {
          id: ''
        }
      });
    }
  };

  const check1 = async (ten) => {
    try {
      const response = await checkTrung1(ten);
      return response.data;
    } catch (error) {
      console.error('Lỗi kiểm tra trùng lặp tên:', error);
      return true;
    }
  };

  const handleAddKC = async (event) => {
    event.preventDefault();
    if (valuesCL.ten.trim() === '') {
      toast.error('Tên không được để trống');
      return;
    }
    if (valuesCL.ten.length > 15) {
      toast.error('Tên không được quá 15 kí tự');
      return;
    }
    const isDuplicate = await check1(valuesCL.ten);
    if (isDuplicate) {
      toast.error('Tên đã tồn tại');
      return;
    }
    addKichCo(valuesCL);
  };

  const addKichCo = async (value) => {
    const res = await postKC(value);
    if (res) {
      toast.success('Thêm thành công !');
      closeModal();
    }
  };

  const handleAddMS = async (event) => {
    event.preventDefault();
    if (!valuesMS.ma.trim()) {
      toast.error('Vui lòng nhập tên màu sắc.');
      return;
    }

    if (valuesMS.ma.length > 50) {
      toast.error('Tên màu sắc không được vượt quá 50 ký tự.');
      return;
    }

    // Kiểm tra nếu tên chất liệu chứa số hoặc ký tự đặc biệt
    if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(valuesMS.ma)) {
      toast.error('Tên màu sắc chỉ được chứa ký tự chữ cái và khoảng trắng.');
      return;
    }
    await addMS(valuesMS);
  };

  const addMS = async (value) => {
    const res = await postMS(value);
    if (res.data === 'Tên màu đã tồn tại') {
      toast.error(res.data);
    } else if (res.data === 'Mã màu đã tồn tại') {
      toast.error(res.data);
    } else {
      toast.success('Thêm thành công !');
      closeModal();
    }
  };

  return (
    <div>
      <MainCard>
        <div className="row g-3">
          <div className="col-md-12">
            <label className="form-label" htmlFor="trang-thai">
              Tên
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Nhập tên sản phẩm..."
              value={values.sanPham.ten}
              onChange={(e) =>
                setValues({
                  ...values,
                  sanPham: { ...values.sanPham, ten: e.target.value }
                })
              }
            />
          </div>
          <div className="col-md-12">
            <label className="form-label" htmlFor="trang-thai1">
              Mô tả
            </label>
            <textarea
              type="text"
              className="form-control"
              placeholder="Nhập mô tả sản phẩm..."
              rows={3}
              value={values.sanPham.moTa}
              onChange={(e) =>
                setValues({
                  ...values,
                  sanPham: { ...values.sanPham, moTa: e.target.value }
                })
              }
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="trang-thai1">
              Giá bán
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Nhập giá sản phẩm..."
              value={values.giaBan}
              onChange={(e) => setValues({ ...values, giaBan: e.target.value })}
            />
          </div>
          <div className="col-6">
            <label className="form-label me-3" htmlFor="trang-thai2">
              Trạng thái:{' '}
            </label>{' '}
            <select
              className="form-select"
              aria-label="Default select example"
              onChange={(e) => setValues({ ...values, trangThai: e.target.value })}
            >
              <option value="1">Kinh doanh</option>
              <option value="0">Ngừng kinh doanh</option>
            </select>
          </div>
          <div className="col-6">
            <label className="form-label me-3" htmlFor="trang-thai3">
              Chất liệu{' '}
              <span
                role="button"
                tabIndex={0}
                className="fa-solid"
                onClick={() => setModalShow(true)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setModalShow(true);
                  }
                }}
                style={{ cursor: 'pointer' }}
              >
                <i style={{ color: 'darkblue' }} className="fa-solid fa-circle-plus fa-lg"></i>
              </span>
            </label>{' '}
            <select
              className="form-select"
              aria-label="Default select example"
              onChange={(e) => {
                setValues({
                  ...values,
                  chatLieu: {
                    id: e.target.value
                  }
                });
              }}
            >
              {listCL.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.ten}
                </option>
              ))}
            </select>
          </div>
          <div className="col-6">
            <label className="form-label me-3" htmlFor="trang-thai5">
              Loại sản phẩm:{' '}
              <span
                role="button"
                tabIndex={0}
                className="fa-solid"
                onClick={() => setModalShowLSP(true)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setModalShowLSP(true);
                  }
                }}
                style={{ cursor: 'pointer' }}
              >
                <i style={{ color: 'darkblue' }} className="fa-solid fa-circle-plus fa-lg"></i>
              </span>
            </label>
            <select
              className="form-select"
              aria-label="Default select example"
              onChange={(e) => {
                setValues({
                  ...values,
                  loaiSanPham: {
                    id: e.target.value
                  }
                });
              }}
            >
              {listLSP.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.ten}
                </option>
              ))}
            </select>
          </div>
          <div className="col-6">
            <label className="form-label me-3" htmlFor="trang-thai6s">
              Cổ áo:{' '}
              <span
                role="button"
                tabIndex={0}
                className="fa-solid"
                onClick={() => setModalShowCA(true)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setModalShowCA(true);
                  }
                }}
                style={{ cursor: 'pointer' }}
              >
                <i style={{ color: 'darkblue' }} className="fa-solid fa-circle-plus fa-lg"></i>
              </span>
            </label>{' '}
            <select
              className="form-select"
              aria-label="Default select example"
              onChange={(e) => {
                setValues({
                  ...values,
                  coAo: {
                    id: e.target.value
                  }
                });
              }}
            >
              {listCA.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.ten}
                </option>
              ))}
            </select>
          </div>
          <div className="col-6">
            <label className="form-label me-3" htmlFor="trang-thai6">
              Nhà sản xuất:{' '}
              <span
                role="button"
                tabIndex={0}
                className="fa-solid"
                onClick={() => setModalShowNSX(true)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setModalShowNSX(true);
                  }
                }}
                style={{ cursor: 'pointer' }}
              >
                <i style={{ color: 'darkblue' }} className="fa-solid fa-circle-plus fa-lg"></i>
              </span>
            </label>{' '}
            <select
              className="form-select"
              aria-label="Default select example"
              onChange={(e) => {
                setValues({
                  ...values,
                  nhaSanXuat: {
                    id: e.target.value
                  }
                });
              }}
            >
              {listNSX.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.ten}
                </option>
              ))}
            </select>
          </div>
          <div className="col-12 d-flex justify-content-end">
            {!isHidden && (
              <div className="hidden-element">
                <button onClick={handleSubmit} type="submit" className="btn btn-primary">
                  ADD
                </button>
              </div>
            )}
            {confirmClicked ? (
              <p></p>
            ) : (
              <button onClick={handleConfirmClick} type="submit" className="btn btn-success">
                Xác Nhận
              </button>
            )}
          </div>
        </div>
        <MyVerticallyCenteredModal
          show={modalShow}
          onHide={() => setModalShow(false)}
          handleSubmit={handleSubmitCL}
          values={valuesCL}
          setValues={setValuesCL}
        />
        <MyVerticallyCenteredModal
          show={modalShowCA}
          onHide={() => setModalShowCA(false)}
          handleSubmit={handleSubmitCA}
          values={valuesCL}
          setValues={setValuesCL}
        />
        <MyVerticallyCenteredModal
          show={modalShowLSP}
          onHide={() => setModalShowLSP(false)}
          handleSubmit={handleAddLSP}
          values={valuesCL}
          setValues={setValuesCL}
        />
        <MyVerticallyCenteredModal
          show={modalShowNSX}
          onHide={() => setModalShowNSX(false)}
          handleSubmit={handleAddNSX}
          values={valuesCL}
          setValues={setValuesCL}
        />
        <MyVerticallyCenteredModal
          show={modalShowKC}
          onHide={() => setModalShowKC(false)}
          handleSubmit={handleAddKC}
          values={valuesCL}
          setValues={setValuesCL}
        />
        <AddMauSac
          show={modalShowMS}
          onHide={() => setModalShowMS(false)}
          handleSubmit={handleAddMS}
          values={valuesMS}
          setValues={setValuesMS}
        />
      </MainCard>
      {!isHidden && (
        <div className="hidden-element">
          <MainCard className="my-3">
            <div className="row">
              <div className="col-12">
                <h2>Thuộc tính</h2>
              </div>
              <br></br>
              <div className="col-12 row">
                <div className="col-6">
                  <div className="form-inline">
                    <label style={{ fontWeight: 'bold' }} className="form-label me-3" htmlFor="trang-thai6">
                      Màu sắc:{' '}
                      <span
                        role="button"
                        tabIndex={0}
                        className="fa-solid"
                        onClick={() => setModalShowMS(true)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            setModalShowMS(true);
                          }
                        }}
                        style={{ cursor: 'pointer' }}
                      >
                        <i style={{ color: 'darkblue' }} className="fa-solid fa-circle-plus fa-lg"></i>
                      </span>
                    </label>{' '}
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      options={listMS.map((item) => item.ma)}
                      sx={{ width: '100%' }}
                      renderInput={(params) => <TextField {...params} label="Chọn màu sắc" />}
                      onChange={handleAutocompleteChange}
                    />
                  </div>
                </div>
                <div className="col-6">
                  <div className="form-inline">
                    <label style={{ fontWeight: 'bold' }} className="form-label me-3" htmlFor="trang-thai6">
                      Kích cỡ:{' '}
                      <span
                        role="button"
                        tabIndex={0}
                        className="fa-solid"
                        onClick={() => setModalShowKC(true)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            setModalShowKC(true);
                          }
                        }}
                        style={{ cursor: 'pointer' }}
                      >
                        <i style={{ color: 'darkblue' }} className="fa-solid fa-circle-plus fa-lg"></i>
                      </span>
                    </label>{' '}
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      options={listKC.map((item) => item.ten)}
                      sx={{ width: '100%' }}
                      renderInput={(params) => <TextField {...params} label="Chọn Kích cỡ" />}
                      onChange={handleAutocompleteChangeKC}
                    />
                  </div>
                </div>
                <div className="col-6">
                  <div className="form-inline">
                    <div className="form-check form-check-inline">
                      <TextField
                        id="standard-basic"
                        label="Số lượng"
                        variant="standard"
                        // style={{
                        //   display: 'inline-block',
                        //   width: '100%',
                        //   fontSize: '15px',
                        //   fontWeight: 'bold'
                        // }}
                        type="number"
                        value={values.soLuong}
                        onChange={(e) => {
                          if (e.target.value >= 1) {
                            setValues({
                              ...values,
                              soLuong: e.target.value
                            });
                          } else {
                            e.preventDefault();
                          }
                        }}
                        inputProps={{ min: 1 }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </MainCard>
        </div>
      )}
    </div>
  );
}

export default AddSanPham;