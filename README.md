# FríoService React

Aplicación de gestión de servicios técnicos de refrigeración, migrada de HTML/CSS/JS vanilla a React con Tailwind CSS.

## Características principales

- **Autenticación de usuarios**: Sistema de login con múltiples roles (administrador, técnico, cliente)
- **Panel de administración**: Dashboard con estadísticas y resumen de actividades
- **Gestión de servicios**: Listado, creación, edición y seguimiento de servicios técnicos
- **Gestión de cotizaciones**: Sistema completo para manejo de cotizaciones
- **Calendario de servicios**: Vista de calendario para programación de servicios
- **Gestión de técnicos**: Administración de técnicos y asignación de servicios
- **Perfiles específicos**: Vistas adaptadas para cada tipo de usuario
- **Diseño responsivo**: Interfaz totalmente adaptable a dispositivos móviles, tablets y escritorio

## Diseño Responsivo

El sistema ha sido optimizado para ofrecer una experiencia de usuario óptima en todos los dispositivos:

### Estructura responsiva:
- Diseño mobile-first con Tailwind CSS
- Breakpoints optimizados (sm: 640px, md: 768px, lg: 1024px, xl: 1280px)
- Sidebar adaptativo que se oculta automáticamente en dispositivos móviles
- Vista de tarjetas en móviles que reemplaza las tablas tradicionales

### Componentes responsivos clave:
- `useResponsive`: Hook personalizado para detectar tamaños de pantalla
- `ResponsiveContainer`: Componente para renderizar contenido condicional según dispositivo
- Implementación de MediaQuery para adaptación automática del layout
- Interfaces específicas para cada dispositivo en componentes críticos (tablas/tarjetas)

### Mejoras de usabilidad:
- Elementos táctiles más grandes en dispositivos móviles
- Menús adaptados para interacción táctil
- Diseño de interfaz que prioriza el contenido importante en pantallas pequeñas

## Tecnologías utilizadas

- React 18
- React Router para navegación
- Tailwind CSS para estilos
- React Responsive para detección de dispositivos
- Chart.js para gráficos
- React Icons para iconografía
- Context API para gestión de estado
- Vite como bundler

## Estructura del proyecto

```
frioservice/
├── public/
├── src/
│   ├── assets/            # Imágenes y recursos estáticos
│   ├── components/        # Componentes reutilizables
│   │   ├── auth/          # Componentes de autenticación
│   │   ├── calendar/      # Componentes de calendario
│   │   ├── dashboard/     # Componentes para el dashboard
│   │   ├── layout/        # Componentes de estructura (sidebar, header)
│   │   ├── quotes/        # Componentes para cotizaciones
│   │   ├── services/      # Componentes para servicios
│   │   ├── technicians/   # Componentes para técnicos
│   │   └── ui/            # Componentes UI genéricos
│   ├── context/           # Contextos para gestión de estado
│   ├── hooks/             # Custom hooks
│   │   ├── responsiveHooks/ # Hooks para responsividad
│   ├── pages/             # Componentes de página
│   ├── utils/             # Utilidades y datos de ejemplo
│   ├── App.js             # Componente principal y rutas
│   ├── index.js           # Punto de entrada
│   └── index.css          # Estilos globales y configuración de Tailwind
└── package.json           # Dependencias
```

## Instalación y uso

1. Clonar el repositorio
2. Instalar dependencias:
   ```
   npm install
   ```
3. Iniciar el servidor de desarrollo:
   ```
   npm run dev
   ```

## Credenciales de prueba

- **Administrador**: 
  - Usuario: admin
  - Contraseña: admin123

- **Técnico**: 
  - Usuario: tecnico (o jperez, mlopez, cgonzalez, amartinez)
  - Contraseña: tecnico123 (o 123 para los usuarios específicos)

- **Cliente**: 
  - Usuario: cliente (o norte, buenamesarestaurante, rsanchez, hospitalsanjuan)
  - Contraseña: cliente123 (o 123 para los usuarios específicos)

## Migración desde la versión HTML

Esta aplicación es una migración completa de la versión original en HTML/CSS/JS vanilla a React con Tailwind CSS. Se ha mantenido la apariencia y funcionalidad original mientras se aprovechan las ventajas de React:

- Componentes reutilizables
- Gestión de estado centralizada
- Enrutamiento declarativo
- Estilos modularizados con Tailwind CSS
- Diseño responsivo mejorado para todos los dispositivos