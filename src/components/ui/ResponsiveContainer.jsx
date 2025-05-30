import React from 'react';
import { useResponsive } from '../../hooks/responsiveHooks';

/**
 * Componente contenedor responsivo que muestra diferentes componentes según el tamaño de pantalla
 * 
 * @param {React.ReactNode} mobile - Componente a mostrar en dispositivos móviles
 * @param {React.ReactNode} tablet - Componente a mostrar en tablets
 * @param {React.ReactNode} desktop - Componente a mostrar en escritorio
 * @param {boolean} showTabletOnMobile - Si es true, mostrará el componente de tablet en móviles si mobile no está definido
 * @param {boolean} showDesktopOnTablet - Si es true, mostrará el componente de desktop en tablets si tablet no está definido
 */
const ResponsiveContainer = ({ 
  mobile, 
  tablet, 
  desktop, 
  showTabletOnMobile = true,
  showDesktopOnTablet = true
}) => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  if (isMobile) {
    return mobile || (showTabletOnMobile && tablet) || desktop || null;
  }
  
  if (isTablet) {
    return tablet || (showDesktopOnTablet && desktop) || mobile || null;
  }
  
  return desktop || tablet || mobile || null;
};

export default ResponsiveContainer;