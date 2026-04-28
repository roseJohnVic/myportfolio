import React, { useState, useEffect } from 'react';
import { arrowIcon } from '../assets/gallery/Gallery';

const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollUp = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return visible ? (
    <button onClick={scrollUp}  className='up-btn'>
      <img src={arrowIcon} alt="" />
    </button>
  ) : null;
};


export default ScrollToTop;
