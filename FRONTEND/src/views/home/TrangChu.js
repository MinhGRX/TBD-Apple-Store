import Banner from 'ui-component/trangchu/Banner';
import Content from 'ui-component/trangchu/Content';
import Footer from 'ui-component/trangchu/Footer';
import Header from 'ui-component/trangchu/Header';

function TrangChu() {
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
export default TrangChu;