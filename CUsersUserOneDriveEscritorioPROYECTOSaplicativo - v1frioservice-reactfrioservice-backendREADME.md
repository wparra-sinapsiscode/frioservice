# Backend para FrioService

API REST para el sistema de gestión de servicios técnicos de refrigeración FrioService.

## 📋 Descripción

Este backend proporciona una API completa para gestionar:

- 🔐 **Autenticación y autorización** de usuarios (Admin, Técnicos, Clientes)
- 🛠️ **Servicios técnicos** (mantenimiento, reparaciones, instalaciones)
- 💰 **Cotizaciones** y presupuestos
- 👥 **Gestión de clientes** y técnicos
- 📅 **Calendario** de servicios programados
- 📊 **Estadísticas** y reportes de desempeño

## 🛠️ Stack Tecnológico

- **Runtime:** Node.js v22+
- **Framework:** Express.js
- **Base de datos:** PostgreSQL
- **ORM:** Prisma
- **Autenticación:** JWT + bcrypt
- **Lenguaje:** TypeScript
- **Validación:** Zod
- **Testing:** Jest
- **Documentación:** Swagger/OpenAPI

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js >= 18.0.0
- npm >= 8.0.0
- PostgreSQL >= 13.0
- Git

### Instalación

```bash
# Clonar repositorio
git clone <repository-url>
cd frioservice-backend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones

# Configurar base de datos
npx prisma migrate dev
npx prisma generate

# Iniciar servidor de desarrollo
npm run dev
```

## 📚 Documentación API

Una vez iniciado el servidor, la documentación interactiva estará disponible en:
- Swagger UI: `http://localhost:3001/api/docs`

## 🧪 Testing

```bash
# Ejecutar tests unitarios
npm test

# Ejecutar tests con coverage
npm run test:coverage

# Ejecutar tests de integración
npm run test:integration
```

## 📁 Estructura del Proyecto

```
src/
├── config/          # Configuraciones
├── controllers/     # Controladores de rutas
├── middleware/      # Middleware personalizado
├── routes/          # Definición de rutas
├── services/        # Lógica de negocio
├── types/           # Tipos TypeScript
├── utils/           # Utilidades y helpers
└── app.ts           # Configuración Express
```

## 🔧 Scripts Disponibles

- `npm run dev` - Servidor desarrollo con hot reload
- `npm run build` - Compilar TypeScript
- `npm start` - Iniciar servidor producción
- `npm run lint` - Ejecutar ESLint
- `npm test` - Ejecutar tests
- `npm run db:migrate` - Ejecutar migraciones
- `npm run db:seed` - Poblar base de datos

## 🌍 Variables de Entorno

Ver `.env.example` para lista completa de variables requeridas.

## 🤝 Contribución

1. Fork del proyecto
2. Crear branch para feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push al branch (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver archivo [LICENSE](LICENSE) para detalles.

## 👥 Equipo

- **Desarrollo:** Equipo FrioService
- **Contacto:** info@frioservice.com

---

🔧 **Estado del Proyecto:** En desarrollo activo
📅 **Última actualización:** Mayo 2025