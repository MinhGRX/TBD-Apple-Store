import '../../scss/Header.scss';
import { Image } from 'react-bootstrap';

function Header() {
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <a className="navbar-brand nameShop" href="#">
          <Image style={{ width: 60, height: 60 }} src="https://i.imgur.com/r5WRVvP.png" alt="Shop" />
          Sports Sh<span style={{ fontFamily: "'Material Icons'", fontSize: 'inherit' }}>op</span>
        </a>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <form className="d-flex" role="search">
            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
            <button className="btn btn-outline-success" type="submit">
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </form>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="#">
                <i className="fa-solid fa-user"></i>Tài Khoản
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="/cart">
                <i className="fa-solid fa-cart-shopping"></i>Giỏ hàng
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;