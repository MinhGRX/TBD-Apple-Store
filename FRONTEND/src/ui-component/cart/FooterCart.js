import React from 'react';

function Footer() {
  return (
    <div>
      <footer className="text-center text-lg-start bg-light text-muted">
        <section className="d-flex justify-content-center justify-content-lg-between p-4 border-bottom">
          <div className="me-5 d-none d-lg-block">
            <span>Get connected with us on social networks:</span>
          </div>

          <div>
            <a href="" className="me-4 text-reset">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="" className="me-4 text-reset">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="" className="me-4 text-reset">
              <i className="fab fa-google"></i>
            </a>
            <a href="" className="me-4 text-reset">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="" className="me-4 text-reset">
              <i className="fab fa-linkedin"></i>
            </a>
            <a href="" className="me-4 text-reset">
              <i className="fab fa-github"></i>
            </a>
          </div>
        </section>

        <section className="">
          <div className="container text-center text-md-start mt-5">
            <div className="row mt-3">
              <div className="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">
                <h6 className="text-uppercase fw-bold mb-4">
                  <i className="fas fa-gem me-3"></i>SportsShop
                </h6>
                <p>
                  Tại đây chúng tôi có những mặt hàng áo thể thao chất lượng, phù hợp với mọi lứa tuổi. Chúng tôi mong muốn đem lại những
                  trải nghiệm tốt cho người sử dụng các mặt hàng bên chúng tôi.
                </p>
              </div>

              <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mb-4">
                <h6 className="text-uppercase fw-bold mb-4">Giới thiệu</h6>
                <p>
                  <a href="#!" className="text-reset">
                    Giới thiệu
                  </a>
                </p>
                <p>
                  <a href="#!" className="text-reset">
                    Liên hệ
                  </a>
                </p>
                <p>
                  <a href="#!" className="text-reset">
                    Hỗ trợ
                  </a>
                </p>
              </div>
              <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4">
                <h6 className="text-uppercase fw-bold mb-4">Thông tin liên hệ</h6>
                <p>
                  <i className="fas fa-home me-3"></i> Trịnh Văn Bô, Nam Từ Liêm, Hà Nội
                </p>
                <p>
                  <i className="fas fa-envelope me-3"></i>
                  SportsShop@gmail.com
                </p>
                <p>
                  <i className="fas fa-phone me-3"></i> + 01 234 567 88
                </p>
                <p>
                  <i className="fas fa-print me-3"></i> + 01 234 567 89
                </p>
              </div>
            </div>
          </div>
        </section>
      </footer>
    </div>
  );
}
export default Footer;