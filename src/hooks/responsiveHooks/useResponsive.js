import { useMediaQuery } from 'react-responsive';

/**
 * Hook personalizado para manejar la responsividad en la aplicación
 * Proporciona una API fácil de usar para detectar diferentes tamaños de pantalla
 */
export const useResponsive = () => {
  // Breakpoints basados en Tailwind
  const isMobile = useMediaQuery({ maxWidth: 639 }); // sm - 1
  const isTablet = useMediaQuery({ minWidth: 640, maxWidth: 1023 }); // sm a lg - 1
  const isDesktop = useMediaQuery({ minWidth: 1024 }); // lg y superior
  const isLargeDesktop = useMediaQuery({ minWidth: 1280 }); // xl y superior
  
  // Breakpoints específicos
  const isSmall = useMediaQuery({ maxWidth: 639 }); // < sm
  const isMedium = useMediaQuery({ minWidth: 640, maxWidth: 767 }); // sm
  const isLarge = useMediaQuery({ minWidth: 768, maxWidth: 1023 }); // md
  const isXLarge = useMediaQuery({ minWidth: 1024, maxWidth: 1279 }); // lg
  const is2XLarge = useMediaQuery({ minWidth: 1280 }); // xl+
  
  // Orientación
  const isPortrait = useMediaQuery({ orientation: 'portrait' });
  const isLandscape = useMediaQuery({ orientation: 'landscape' });
  
  // Agrupaciones útiles
  const isMobileOrTablet = isMobile || isTablet; // < lg
  const belowMedium = useMediaQuery({ maxWidth: 767 }); // < md
  const belowLarge = useMediaQuery({ maxWidth: 1023 }); // < lg
  
  return {
    // Categorías principales
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    
    // Breakpoints específicos
    isSmall,
    isMedium,
    isLarge,
    isXLarge,
    is2XLarge,
    
    // Orientación
    isPortrait,
    isLandscape,
    
    // Agrupaciones
    isMobileOrTablet,
    belowMedium,
    belowLarge,
    
    // Los valores numéricos de los breakpoints para referencia
    breakpoints: {
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      '2xl': 1536
    }
  };
};

export default useResponsive;