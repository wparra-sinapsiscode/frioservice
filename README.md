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
- **Diseño responsivo**: Interfaz adaptable a diferentes dispositivos

## Tecnologías utilizadas

- React 18
- React Router para navegación
- Tailwind CSS para estilos
- Chart.js para gráficos
- React Icons para iconografía
- Context API para gestión de estado

## Estructura del proyecto

```
frioservice-react/
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
   npm start
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