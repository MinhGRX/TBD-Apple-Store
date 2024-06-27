import Content from 'ui-component/sanpham/Content';
import Banner from 'ui-component/trangchu/Banner';
import Footer from 'ui-component/trangchu/Footer';
import Header from 'ui-component/trangchu/Header';

function SanPham() {
  return (
    <div>
      <Header />
      <div className="content-container">
        <Banner />
      </div>
      <Content />
      <Footer />
    </div>
  );
}
export default SanPham;