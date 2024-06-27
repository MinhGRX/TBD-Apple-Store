import React from 'react';
import Anhuser from '../assets/images/bieutuong.jpg';
import { useNavigate } from 'react-router';
import '../scss/SlideBar.scss';
import { Avatar } from '@mui/material';

function SlideBar() {
  const navigate = useNavigate();
  const picture = localStorage.getItem('picture');
  return (
    <div>
      <ul>
        <li>
          <div className="user-column">
            <div className="avatar d-flex justify-content-center">
              {picture ? (
                <Avatar alt="Remy Sharp" src={picture} sx={{ width: 150, height: 150 }} />
              ) : (
                <div className="avatar-image">
                  <img src={Anhuser} alt="Ảnh đại diện" />
                </div>
              )}
            </div>
          </div>
        </li>
      </ul>
      <ul>
        <li>
          <button onClick={() => navigate('/thong-tin_user')} className="no-border">
            Tài khoản của tôi
          </button>
        </li>
        <li>
          <button onClick={() => navigate('/history')} className="no-border">
            Đơn Hàng của tôi
          </button>
        </li>
        <li>
          <button onClick={() => navigate('/diachi')} className="no-border">
            Địa Chỉ
          </button>
        </li>
        <li>
          <button onClick={() => navigate('/thong-tin_user')} className="no-border">
            Đăng xuất
          </button>
        </li>
      </ul>
    </div>
  );
}

export default SlideBar;