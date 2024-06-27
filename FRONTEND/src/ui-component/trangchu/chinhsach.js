// ChinhSach.js

import React from 'react';
import Header from 'ui-component/trangchu/Header';
import Footer from 'ui-component/trangchu/Footer';
import '../../scss/chinhsachdoitra.scss';

const ChinhSach = () => {
  return (
    <div>
      <Header />
      <div className="chinh-sach-container">
        <section>
          <h2>CHÍNH SÁCH ĐỔI HÀNG</h2>
          <p>ĐỔI HÀNG LÊN ĐẾN 15 NGÀY</p>
        </section>

        <section>
          <h2>ĐIỀU KIỆN ĐỔI HÀNG</h2>
          <ul>
            <li>Sản phẩm chỉ được đổi khi khách mua tại cửa hàng.</li>
            <li>Sản phẩm còn nguyên tem mác, chưa qua sử dụng.</li>
            <li>Sản phẩm được xác định có lỗi kỹ thuật (không do tác động ngoại quan và nguyên nhân do sử dụng).</li>
            <li>
              Lỗi do quá trình vận chuyển, có căn cứ chứng minh (bằng video, hình ảnh khi nhận hàng)/ nhận hàng không đúng với mã hàng đã
              đặt.
            </li>
          </ul>
        </section>

        <section>
          <h2>Phí đổi sản phẩm</h2>
          <ul>
            <li>Trường hợp đổi hàng trong chính sách: Miễn phí.</li>
            {/* <li>
              Trường hợp đổi hàng do phát sinh từ phía khách hàng ngoài chính sách và đổi hàng lần hai, vui lòng thanh toán phí vận chuyển 2
              chiều (nếu có).
            </li> */}
          </ul>
        </section>

        <section>
          <h2>NỘI DUNG CHÍNH SÁCH</h2>

          <table>
            <thead>
              <tr>
                <th>Chi tiết</th>
                <th>Nhóm hàng</th>
              </tr>
            </thead>
            <tbody>
              <td>Áo Thể Thao Nam</td>
              <td>
                - Khi mua hàng tại Sports Shop: Đổi hàng trong 15 ngày
                <br></br>
              </td>
            </tbody>
          </table>
        </section>

        {/* Thêm các section khác tương tự ở đây */}
      </div>
      <Footer />
    </div>
  );
};

export default ChinhSach;