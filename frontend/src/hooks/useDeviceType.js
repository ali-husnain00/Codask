import { useState, useEffect } from 'react';

const useDeviceType = () => {
  const [deviceType, setDeviceType] = useState({
    isDesktop: false,
    isLaptop: false,
    isTablet: false,
    isMobile: false,
    width: window.innerWidth
  });

  useEffect(() => {
    const updateDeviceType = () => {
      const width = window.innerWidth;
      setDeviceType({
        isDesktop: width >= 1280,
        isLaptop: width >= 1024 && width < 1280,
        isTablet: width >= 768 && width < 1024,
        isMobile: width < 768,
        width
      });
    };

    updateDeviceType();
    window.addEventListener('resize', updateDeviceType);
    return () => window.removeEventListener('resize', updateDeviceType);
  }, []);

  return deviceType;
};

export default useDeviceType;
