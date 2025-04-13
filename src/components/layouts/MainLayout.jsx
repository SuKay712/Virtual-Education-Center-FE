import Footer from '../footers';
import Header from '../headers';
import React from 'react';
import './MainLayout.scss';

function MainLayout(props) {
  const userInfo = JSON.parse(localStorage.getItem('user_info')) || {};
  return (
    <div className="frame-wrapper">
      <Header userInfo={userInfo} />
      <div className="frame-body">
        <props.component />
      </div>
      <Footer />
    </div>
  );
}

export default MainLayout;
