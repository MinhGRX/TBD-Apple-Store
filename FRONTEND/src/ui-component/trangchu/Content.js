import React from 'react';
// import { Image } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import '../../scss/Content.scss';
import '../../scss/ChiTietSanPham.scss';
import { getAllBestseller, getAllSPNEW, getAllProduct } from '../../services/SanPhamService';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AnhBanner from '../../assets/images/banner44.jpg';
import AnhBanner1 from '../../assets/images/333333.jpg';

function Content() {
  const [data, setData] = useState([]);
  const [productNew, setProductNew] = useState([]);

  useEffect(() => {
    getAllCTSP();
    getAllSP();
  }, []);

  const getAllCTSP = async () => {
    let allProduct;
    const res = await getAllBestseller();

    if (res && res.data && res.data.length > 0) {
      setData(res.data);
    } else {
      allProduct = await getAllProduct();
      setData(allProduct);
    }

    console.log(allProduct);
  };

  const getAllSP = async () => {
    const res = await getAllSPNEW();
    if (res && res.data) {
      setProductNew(res.data);
    }
  };

  const navigate = useNavigate();

  const handleDetail = (idCTSP, idSP, idMS) => {
    navigate(`/detail/${idCTSP}/${idSP}/${idMS}`);
    localStorage.setItem('idMS', idMS);
  };

  function convertToCurrency(number) {
    // Chuyển đổi số thành định dạng tiền Việt Nam
    const formatter = new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    });
    return formatter.format(number);
  }

  return (
    <>
      <section className="product">
        <div className="container">
          <div style={{ display: 'flex', paddingLeft: 17, paddingTop: 30 }}>
            <div className="col-4" style={{ width: 430, paddingRight: 30 }}>
              <Card.Img src="https://i.ytimg.com/vi/3K689mxA6a0/maxresdefault.jpg" />
            </div>
            <div className="col-4" style={{ width: 430, paddingRight: 30 }}>
              <Card.Img src={AnhBanner1} />
            </div>
            <div className="col-4" style={{ width: 430, paddingRight: 30 }}>
              <Card.Img src="https://bizweb.dktcdn.net/thumb/large/100/376/467/collections/z2137541763817-65adcff79dc0f58c8d9ac9d4110ffdcc.jpg?v=1603270072300" />
            </div>
          </div>
          <div style={{ paddingLeft: 17, paddingRight: 20, color: 'red' }}>
            <hr></hr>
          </div>
          <p className="title">Sản Phẩm Bán Chạy</p>
          <div className="row">
            {Array.isArray(data) &&
              data.slice(0, 8).map((product, index) => {
                return (
                  <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 product-item" key={index}>
                    <Card
                      onClick={() => handleDetail(product.id, product.sanPham.id, product.mauSac.id)}
                      style={{ width: '260px', height: '400px' }}
                    >
                      <Card.Img
                        style={{ textAlign: 'center', width: '260px', height: '300px' }}
                        src={`http://localhost:8080/api/chi-tiet-san-pham/${product.id}`}
                      />
                      <Card.Body>
                        <Card.Title>{product.sanPham.ten}</Card.Title>
                        <Card.Text>
                          <span>{convertToCurrency(product.giaBan)}</span>
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </div>
                );
              })}
          </div>
          <div className="text-center">
            <Link to="/san-pham/web" className="btn btn1">
              Xem tất cả{' '}
            </Link>
          </div>
        </div>

        <div className="container">
          <Card.Img style={{ height: 250, paddingTop: 20 }} src={AnhBanner} />
        </div>

        <div className="container">
          <p className="title">Sản Phẩm Mới Nhất</p>
          <div className="row">
            {productNew.slice(0, 8).map((product, i) => {
              return (
                <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 product-item" key={i}>
                  <Card
                    onClick={() => handleDetail(product.id, product.sanPham.id, product.mauSac.id)}
                    style={{ width: '260px', height: '400px' }}
                  >
                    <Card.Img
                      style={{ textAlign: 'center', width: '260px', height: '300px' }}
                      src={`http://localhost:8080/api/chi-tiet-san-pham/${product.id}`}
                    />
                    <Card.Body>
                      <Card.Title>{product.sanPham.ten}</Card.Title>
                      <Card.Text>
                        <span>{convertToCurrency(product.giaBan)}</span>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </div>
              );
            })}
          </div>
          <div className="text-center">
            <Link to="/san-pham/web" className="btn btn1">
              Xem tất cả{' '}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default Content;