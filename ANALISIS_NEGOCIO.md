# ANÁLISIS DE NEGOCIO Y ARQUITECTURA DE SOFTWARE
## FRIOSERVICE - Sistema de Gestión de Servicios Técnicos de Refrigeración

---

## PARTE 1: DESCRIPCIÓN DEL NEGOCIO

### DESCRIPCIÓN INICIAL

**FríoService** es una aplicación integral de gestión de servicios técnicos especializados en sistemas de refrigeración. La plataforma facilita la administración completa del ciclo de vida de servicios técnicos, desde la solicitud inicial hasta la finalización y seguimiento post-servicio.

**Propósito del Negocio:**
- Centralizar la gestión de servicios técnicos de refrigeración
- Optimizar la asignación y programación de técnicos
- Mejorar la comunicación entre clientes, técnicos y administradores
- Proporcionar trazabilidad completa de servicios y cotizaciones
- Facilitar el análisis de rendimiento y estadísticas operacionales

**Modelo de Negocio:**
- Empresa de servicios técnicos especializados en refrigeración
- Atención a clientes comerciales (restaurantes, hospitales, empresas)
- Gestión de técnicos especializados
- Servicios programados y de emergencia
- Sistema de cotizaciones y facturación

**Usuarios Principales:**
1. **Administradores**: Gestión completa del sistema
2. **Técnicos**: Ejecución y seguimiento de servicios
3. **Clientes**: Solicitud de servicios y seguimiento

---

## PARTE 2: LISTA DE FUNCIONALIDADES

### 2.1 FUNCIONALIDADES ESENCIALES

#### 1. Sistema de Autenticación y Autorización
- **Descripción**: Gestión segura de acceso al sistema con roles diferenciados
- **Categoría**: Esencial
- **Complejidad**: Media
- **Dependencias**: Base para todas las demás funcionalidades
- **Usuarios**: Todos los roles
- **Criterios de Aceptación**:
  - Login seguro con validación de credenciales
  - Redirección automática según rol de usuario
  - Cierre de sesión seguro
  - Manejo de sesiones inactivas
  - Recuperación de contraseñas

#### 2. Dashboard Administrativo
- **Descripción**: Panel central con estadísticas y resumen de actividades
- **Categoría**: Esencial
- **Complejidad**: Alta
- **Dependencias**: Autenticación, todos los módulos de datos
- **Usuarios**: Administrador
- **Criterios de Aceptación**:
  - Visualización de KPIs en tiempo real
  - Gráficos interactivos de rendimiento
  - Resumen de servicios activos
  - Alertas de servicios urgentes
  - Acceso rápido a funciones principales

#### 3. Gestión de Servicios Técnicos
- **Descripción**: CRUD completo para servicios técnicos con seguimiento de estados
- **Categoría**: Esencial
- **Complejidad**: Alta
- **Dependencias**: Autenticación, Técnicos, Clientes
- **Usuarios**: Administrador, Técnico (limitado)
- **Criterios de Aceptación**:
  - Creación de servicios con datos completos
  - Asignación automática o manual de técnicos
  - Actualización de estados en tiempo real
  - Historial completo de cambios
  - Filtros y búsqueda avanzada

#### 4. Sistema de Cotizaciones
- **Descripción**: Gestión completa del proceso de cotización
- **Categoría**: Esencial
- **Complejidad**: Alta
- **Dependencias**: Autenticación, Clientes, Servicios
- **Usuarios**: Administrador, Cliente (visualización)
- **Criterios de Aceptación**:
  - Creación de cotizaciones detalladas
  - Aprobación/rechazo por parte del cliente
  - Conversión automática a servicio
  - Historial de versiones
  - Generación de reportes

#### 5. Calendario de Servicios
- **Descripción**: Programación visual de servicios técnicos
- **Categoría**: Esencial
- **Complejidad**: Alta
- **Dependencias**: Servicios, Técnicos
- **Usuarios**: Administrador, Técnico
- **Criterios de Aceptación**:
  - Vista calendario mensual/semanal/diaria
  - Drag & drop para reprogramación
  - Código de colores por estado
  - Filtros por técnico/cliente
  - Sincronización automática

### 2.2 FUNCIONALIDADES IMPORTANTES

#### 6. Gestión de Técnicos
- **Descripción**: Administración de perfiles y asignaciones de técnicos
- **Categoría**: Importante
- **Complejidad**: Media
- **Dependencias**: Autenticación
- **Usuarios**: Administrador
- **Criterios de Aceptación**:
  - CRUD de perfiles de técnicos
  - Asignación de especialidades
  - Seguimiento de disponibilidad
  - Evaluación de rendimiento
  - Historial de servicios

#### 7. Gestión de Clientes
- **Descripción**: Base de datos completa de clientes
- **Categoría**: Importante
- **Complejidad**: Media
- **Dependencias**: Autenticación
- **Usuarios**: Administrador
- **Criterios de Aceptación**:
  - CRUD de información de clientes
  - Historial de servicios por cliente
  - Información de contacto actualizable
  - Clasificación por tipo de cliente
  - Notas y observaciones

#### 8. Dashboard de Técnico
- **Descripción**: Panel personalizado para técnicos
- **Categoría**: Importante
- **Complejidad**: Media
- **Dependencias**: Autenticación, Servicios
- **Usuarios**: Técnico
- **Criterios de Aceptación**:
  - Servicios asignados del día
  - Actualización de estados
  - Historial personal
  - Evaluaciones pendientes
  - Navegación optimizada móvil

#### 9. Dashboard de Cliente
- **Descripción**: Portal de autoservicio para clientes
- **Categoría**: Importante
- **Complejidad**: Media
- **Dependencias**: Autenticación, Servicios, Cotizaciones
- **Usuarios**: Cliente
- **Criterios de Aceptación**:
  - Visualización de servicios activos
  - Solicitud de nuevos servicios
  - Seguimiento de cotizaciones
  - Historial de servicios
  - Información de equipos

### 2.3 FUNCIONALIDADES DESEABLES

#### 10. Módulo de Estadísticas Avanzadas
- **Descripción**: Reportes y análisis detallados
- **Categoría**: Deseable
- **Complejidad**: Alta
- **Dependencias**: Todos los módulos de datos
- **Usuarios**: Administrador
- **Criterios de Aceptación**:
  - Reportes personalizables
  - Exportación a Excel/PDF
  - Gráficos interactivos
  - Comparativas históricas
  - Predicciones de tendencias

#### 11. Sistema de Evaluaciones
- **Descripción**: Evaluación de calidad post-servicio
- **Categoría**: Deseable
- **Complejidad**: Media
- **Dependencias**: Servicios, Clientes
- **Usuarios**: Cliente, Administrador
- **Criterios de Aceptación**:
  - Formularios de evaluación
  - Sistema de calificaciones
  - Comentarios de clientes
  - Alertas de baja calificación
  - Reportes de satisfacción

#### 12. Gestión de Equipos
- **Descripción**: Inventario y seguimiento de equipos de clientes
- **Categoría**: Deseable
- **Complejidad**: Media
- **Dependencias**: Clientes, Servicios
- **Usuarios**: Administrador, Cliente
- **Criterios de Aceptación**:
  - Registro de equipos por cliente
  - Historial de mantenimientos
  - Alertas de mantenimiento preventivo
  - Especificaciones técnicas
  - Documentos asociados

---

## PARTE 3: FLUJOS DE TRABAJO

### 3.1 FLUJO PRINCIPAL: GESTIÓN DE SERVICIO TÉCNICO

#### Flujo Completo (Solicitud → Finalización)

**1. Inicio del Flujo**
- **Actor**: Cliente o Administrador
- **Acción**: Solicita servicio técnico
- **Datos**: Información del problema, ubicación, urgencia
- **Estado**: "Solicitado"

**2. Evaluación y Cotización**
- **Actor**: Administrador
- **Acción**: Evalúa la solicitud y genera cotización
- **Datos**: Descripción técnica, costos estimados, tiempo
- **Estados**: "En Evaluación" → "Cotización Enviada"
- **Notificación**: Email/SMS al cliente

**3. Aprobación del Cliente**
- **Actor**: Cliente
- **Decisión**: Aprobar/Rechazar cotización
- **Estados Posibles**:
  - Aprobado → "Cotización Aprobada"
  - Rechazado → "Cotización Rechazada" (Fin del flujo)
  - Sin respuesta → "Cotización Pendiente" (Escalamiento después de X días)

**4. Asignación de Técnico**
- **Actor**: Administrador (automático o manual)
- **Acción**: Asigna técnico disponible con especialidad
- **Criterios**: Disponibilidad, especialidad, ubicación
- **Estado**: "Técnico Asignado"
- **Notificación**: A técnico y cliente

**5. Programación**
- **Actor**: Administrador/Técnico
- **Acción**: Define fecha y hora del servicio
- **Estado**: "Programado"
- **Notificación**: Confirmación a cliente

**6. Ejecución del Servicio**
- **Actor**: Técnico
- **Acciones**:
  - Check-in al llegar al sitio
  - Diagnóstico del problema
  - Ejecución de reparación/mantenimiento
  - Documentación de trabajo realizado
  - Check-out al finalizar
- **Estados**: "En Curso" → "Completado"
- **Tiempo Estimado**: Variable según tipo de servicio

**7. Validación y Cierre**
- **Actor**: Cliente/Administrador
- **Acción**: Valida trabajo realizado
- **Estado**: "Validado" → "Cerrado"
- **Notificación**: Confirmación de finalización

**8. Evaluación (Opcional)**
- **Actor**: Cliente
- **Acción**: Califica servicio recibido
- **Datos**: Puntuación, comentarios
- **Estado**: "Evaluado"

#### Manejo de Condiciones de Error

**Errores Comunes**:
- Técnico no disponible → Reasignación automática
- Cliente no disponible en cita → Reprogramación
- Problema más complejo → Escalamiento a especialista
- Equipos/repuestos no disponibles → Servicio parcial + seguimiento

### 3.2 FLUJO SECUNDARIO: MANTENIMIENTO PREVENTIVO

**1. Identificación Automática**
- **Trigger**: Sistema detecta fecha de mantenimiento
- **Actor**: Sistema automático
- **Acción**: Genera alerta de mantenimiento preventivo

**2. Programación Proactiva**
- **Actor**: Administrador
- **Acción**: Programa mantenimiento con cliente
- **Estado**: "Mantenimiento Programado"

**3. Ejecución**
- **Flujo**: Similar al flujo principal desde el paso 6

---

## PARTE 4: LÓGICA DE NEGOCIO Y REGLAS

### 4.1 REGLAS DE VALIDACIÓN

#### Servicios
- Todo servicio debe tener un cliente asignado
- Fecha de servicio no puede ser anterior a la fecha actual
- Servicios de emergencia tienen prioridad automática
- Descripción del problema es obligatoria (mínimo 10 caracteres)

#### Técnicos
- Técnico debe tener al menos una especialidad
- No puede tener más de 3 servicios simultáneos activos
- Horario de trabajo: Lunes a Viernes 8:00-18:00, Sábados 8:00-14:00
- Debe confirmar disponibilidad antes de asignación

#### Clientes
- Información de contacto es obligatoria (teléfono y dirección)
- Clientes corporativos pueden tener múltiples ubicaciones
- Debe existir al menos un contacto responsable

### 4.2 REGLAS DE CÁLCULO

#### Cotizaciones
- Precio base por tipo de servicio + costos de materiales
- Servicios de emergencia: recargo del 50%
- Servicios fuera de horario: recargo del 30%
- Descuentos por volumen para clientes corporativos
- IVA aplicable según configuración fiscal

#### Tiempo de Respuesta
- Servicios normales: 24-48 horas
- Servicios urgentes: 4-8 horas
- Emergencias: 1-2 horas
- Mantenimientos preventivos: programable hasta 30 días

### 4.3 REGLAS DE AUTORIZACIÓN

#### Administrador
- Acceso completo a todas las funcionalidades
- Puede modificar cualquier registro
- Puede asignar/reasignar servicios
- Acceso a reportes y estadísticas

#### Técnico
- Solo puede ver servicios asignados a él
- Puede actualizar estado de sus servicios
- Puede registrar evaluaciones técnicas
- No puede modificar precios o asignaciones

#### Cliente
- Solo puede ver sus propios servicios y cotizaciones
- Puede solicitar nuevos servicios
- Puede aprobar/rechazar cotizaciones
- Puede evaluar servicios completados

### 4.4 REGLAS TEMPORALES

#### Seguimiento
- Cotizaciones expiran después de 30 días sin respuesta
- Servicios no atendidos escalan después de 2 horas del tiempo programado
- Evaluaciones se solicitan 24 horas después de completar servicio
- Mantenimientos preventivos se programan cada 6 meses (configurable)

#### Notificaciones
- Recordatorio de cita: 24 horas antes
- Escalamiento por retraso: 30 minutos después de hora programada
- Seguimiento de cotización: a los 7, 15 y 25 días

### 4.5 REGLAS DE INTEGRIDAD

#### Relaciones Obligatorias
- Todo servicio debe tener un cliente asociado
- Servicios activos deben tener técnico asignado
- Cotizaciones aprobadas deben generar servicio
- Evaluaciones solo pueden existir para servicios completados

#### Consistencia de Estados
- Un servicio no puede estar "Completado" sin técnico asignado
- Técnicos "No Disponibles" no pueden recibir nuevas asignaciones
- Clientes "Inactivos" no pueden generar nuevos servicios

### 4.6 REGLAS DE ESCALAMIENTO

#### Escalamiento por Tiempo
- Servicios sin asignar después de 4 horas → Notificación a supervisor
- Servicios atrasados más de 2 horas → Contacto directo con cliente
- Cotizaciones sin respuesta después de 20 días → Llamada de seguimiento

#### Escalamiento por Problema
- Problemas complejos que exceden capacidad del técnico → Asignación de especialista
- Equipos obsoletos → Recomendación de reemplazo
- Problemas recurrentes → Análisis de causa raíz

---

## PARTE 5: PLANIFICACIÓN DE DATOS

### 5.1 REQUISITOS DE DATOS

#### A. Entidades Principales

**1. Usuario**
- Atributos: ID, nombre, email, teléfono, rol, estado, fecha_creación, último_acceso
- Relaciones: 1:N con Servicios (como cliente), 1:N con Servicios (como técnico)
- Volumen: 100-500 usuarios iniciales
- Frecuencia: Actualización diaria

**2. Cliente**
- Atributos: ID, razón_social, tipo_cliente, dirección, contacto_principal, estado
- Relaciones: 1:N con Servicios, 1:N con Equipos, 1:N con Cotizaciones
- Volumen: 50-200 clientes iniciales
- Frecuencia: Actualización semanal

**3. Técnico**
- Atributos: ID, nombre, especialidades, estado, horario, ubicación_base
- Relaciones: 1:N con Servicios, 1:N con Evaluaciones
- Volumen: 5-15 técnicos iniciales
- Frecuencia: Actualización diaria (disponibilidad)

**4. Servicio**
- Atributos: ID, descripción, tipo, prioridad, estado, fecha_solicitud, fecha_programada, fecha_completado
- Relaciones: N:1 con Cliente, N:1 con Técnico, 1:N con Evaluaciones
- Volumen: 500-2000 servicios anuales
- Frecuencia: Actualización en tiempo real

**5. Cotización**
- Atributos: ID, descripción, monto, estado, fecha_creación, fecha_vencimiento
- Relaciones: N:1 con Cliente, 1:1 con Servicio (si aprobada)
- Volumen: 200-800 cotizaciones anuales
- Frecuencia: Actualización semanal

**6. Equipo**
- Atributos: ID, tipo, marca, modelo, número_serie, fecha_instalación, estado
- Relaciones: N:1 con Cliente, 1:N con Servicios
- Volumen: 100-1000 equipos
- Frecuencia: Actualización mensual

**7. Evaluación**
- Atributos: ID, calificación, comentarios, fecha_evaluación
- Relaciones: N:1 con Servicio, N:1 con Cliente
- Volumen: 60-80% de servicios completados
- Frecuencia: Actualización post-servicio

### 5.2 DATOS SIMULADOS VS. REALES

#### A. Datos Simulados Durante Desarrollo

**Usuarios de Prueba**:
```json
{
  "administrador": {
    "usuario": "admin",
    "contraseña": "admin123",
    "nombre": "Administrador Sistema",
    "rol": "admin"
  },
  "tecnicos": [
    {
      "usuario": "jperez",
      "contraseña": "123",
      "nombre": "Juan Pérez",
      "especialidad": "Refrigeración Comercial"
    }
  ],
  "clientes": [
    {
      "usuario": "norte",
      "contraseña": "123",
      "nombre": "Norte Restaurant",
      "tipo": "Restaurante"
    }
  ]
}
```

**Servicios Simulados**:
- 50 servicios de ejemplo con diferentes estados
- Fechas realistas (últimos 6 meses + próximos 2 meses)
- Variedad de tipos de servicio y prioridades
- Asignaciones lógicas técnico-servicio

**Datos Estadísticos**:
- Métricas calculadas en base a servicios simulados
- Tendencias artificiales pero realistas
- Distribución equilibrada de estados y tipos

#### B. Fuentes para Datos Reales

**Clientes Reales**:
- Base de datos existente de la empresa
- Formularios de registro en línea
- Migración desde sistemas legacy (Excel, CRM básico)

**Servicios Históricos**:
- Registros de servicios de años anteriores
- Órdenes de trabajo físicas digitalizadas
- Facturas y cotizaciones históricas

**Equipos en Campo**:
- Inventario actual de equipos instalados
- Manuales y especificaciones técnicas
- Historial de mantenimientos

### 5.3 PLAN DE TRANSICIÓN

#### A. Estrategia de Migración

**Fase 1: Preparación (2 semanas)**
- Auditoría de datos existentes
- Limpieza y normalización de información
- Definición de mappings de datos
- Creación de scripts de migración

**Fase 2: Migración Piloto (1 semana)**
- Migración de 10% de datos reales
- Validación de integridad
- Ajustes de scripts
- Entrenamiento del equipo

**Fase 3: Migración Completa (2 semanas)**
- Migración de todos los datos históricos
- Validación exhaustiva
- Configuración de procesos de sincronización
- Go-live con datos reales

#### B. Criterios de Validación

**Integridad Referencial**:
- Todos los servicios deben tener cliente válido
- Técnicos asignados deben existir
- Fechas deben ser lógicamente consistentes

**Completitud de Datos**:
- Mínimo 95% de registros con campos obligatorios completos
- Información de contacto validada
- Estados consistentes con fechas

**Consistencia Temporal**:
- Fechas de servicios en orden lógico
- Estados progresivos sin saltos ilógicos
- Evaluaciones posteriores a servicios completados

#### C. Plan de Contingencia

**Rollback Completo**:
- Backup completo antes de migración
- Scripts de rollback automatizados
- Tiempo máximo de rollback: 2 horas

**Rollback Parcial**:
- Identificación de registros problemáticos
- Corrección en caliente
- Validación incremental

**Operación Manual Temporal**:
- Procedimientos de entrada manual
- Validación posterior automatizada
- Sincronización diferida

---

## ENTREGABLES

### 1. DOCUMENTO PRINCIPAL
✅ **Completado**: Este documento contiene todas las secciones solicitadas

### 2. DIAGRAMAS DE FLUJO
📋 **Pendiente**: Crear diagramas visuales para:
- Flujo principal de servicios
- Flujo de cotizaciones
- Flujo de autenticación
- Flujo de asignación de técnicos

### 3. TABLA DE ENTIDADES Y RELACIONES
📋 **Incluido en Sección 5.1**: Entidades principales con atributos y relaciones

### 4. MATRIZ DE FUNCIONALIDADES
📋 **Incluido en Sección 2**: Funcionalidades categorizadas con criterios de aceptación

### 5. CRONOGRAMA DE IMPLEMENTACIÓN

#### Fase 1 - Base (4 semanas)
- Autenticación y autorización
- Estructura de base de datos
- Interfaces básicas de usuario

#### Fase 2 - Funcionalidades Core (6 semanas)
- Gestión de servicios
- Sistema de cotizaciones
- Dashboards básicos

#### Fase 3 - Gestión Avanzada (4 semanas)
- Calendario de servicios
- Gestión de técnicos y clientes
- Reportes básicos

#### Fase 4 - Funcionalidades Avanzadas (4 semanas)
- Estadísticas avanzadas
- Sistema de evaluaciones
- Gestión de equipos

#### Fase 5 - Optimización y Producción (2 semanas)
- Testing integral
- Optimización de rendimiento
- Migración a producción

**Tiempo Total Estimado**: 20 semanas (5 meses)

---

## RECOMENDACIONES CRÍTICAS

### Puntos Críticos Identificados

1. **Gestión de Estados**: Implementar máquina de estados robusta para servicios
2. **Notificaciones**: Sistema de notificaciones en tiempo real es esencial
3. **Seguridad**: Implementar autenticación robusta y autorización granular
4. **Escalabilidad**: Diseñar base de datos para crecimiento futuro
5. **Móvil**: Optimizar interfaz para técnicos en campo

### Riesgos y Mitigaciones

1. **Resistencia al Cambio**: Plan de capacitación intensivo
2. **Pérdida de Datos**: Backups automáticos y redundancia
3. **Tiempo de Inactividad**: Migración gradual en horarios de menor uso
4. **Complejidad Técnica**: Desarrollo iterativo con validación constante

---

*Documento generado para FríoService v1.0*  
*Fecha: $(date)*  
*Versión del Análisis: 1.0*