# Sistema de Gestión Hotelera "Mar Azul" - Frontend

**Autor:** Alexander Echeverria  
**Versión:** 1.0.0  
**Tecnología:** React.js + Tailwind CSS

## Descripción

Frontend React para el Sistema de Gestión Hotelera "Mar Azul". Proporciona interfaces intuitivas para huéspedes, personal del hotel y gerencia, implementando todas las historias de usuario definidas en los requerimientos.

## Características Principales

### Para Huéspedes (HU-01, HU-02, HU-03)
- **Reservas en línea:** Sistema de búsqueda y reserva en tiempo real
- **Check-in/Check-out digital:** Proceso autoservicio 24/7
- **Multilenguaje:** Interfaz en español e inglés
- **Diseño responsivo:** Compatible con móviles y tablets

### Para Personal del Hotel (RU-01, RU-02, LU-01, LU-02)
- **Gestión de reservas:** Panel completo para recepcionistas
- **Control de habitaciones:** Estados en tiempo real para limpieza
- **Reporte de incidencias:** Sistema de seguimiento de mantenimiento
- **Check-in/Check-out manual:** Gestión presencial

### Para Gerencia (GU-01, GU-02)
- **Reportes de ocupación:** Análisis detallado de ocupación
- **Reportes de ventas:** Métricas de ingresos y servicios
- **Dashboard ejecutivo:** KPIs y métricas principales
- **Exportación de datos:** PDF, Excel, CSV

## Tecnologías Utilizadas

- **Frontend:** React 18.2.0
- **Routing:** React Router DOM 6.16.0
- **Estilos:** Tailwind CSS 3.3.5
- **Iconos:** Heroicons 2.0.18
- **HTTP Client:** Axios 1.6.0
- **Formularios:** React Hook Form 7.47.0
- **Build Tool:** Create React App

## Instalación y Configuración

### Prerrequisitos
- Node.js >= 16.0.0
- npm >= 8.0.0

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/hotel-mar-azul/frontend.git
cd hotel-mar-azul-frontend
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
```

Editar el archivo `.env` con la configuración correcta:
```env
REACT_APP_API_BASE_URL=https://hotel-management-backend-32ge.onrender.com/api
REACT_APP_HOTEL_NAME=Hotel Mar Azul
REACT_APP_CONTACT_PHONE=+502 7940-0000
REACT_APP_CONTACT_EMAIL=info@hotelmarazul.com
REACT_APP_DEFAULT_LANGUAGE=es
REACT_APP_SUPPORTED_LANGUAGES=es,en
```

4. **Iniciar en modo desarrollo**
```bash
npm start
```

La aplicación estará disponible en `http://localhost:3000`

## Scripts Disponibles

```bash
# Desarrollo
npm start          # Iniciar servidor de desarrollo
npm run dev        # Alias para npm start

# Construcción
npm run build      # Crear build de producción
npm run analyze    # Analizar bundle de producción

# Calidad de código
npm run lint       # Verificar código con ESLint
npm run lint:fix   # Corregir errores automáticamente
npm run format     # Formatear código con Prettier

# Testing
npm test           # Ejecutar tests
npm run test:coverage  # Tests con cobertura
```

## Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── common/         # Componentes generales
│   ├── auth/           # Autenticación
│   ├── guest/          # Portal huéspedes
│   ├── staff/          # Panel personal
│   └── reports/        # Reportes
├── pages/              # Páginas principales
├── services/           # Servicios API
├── context/            # Context providers
├── hooks/              # Custom hooks
├── utils/              # Utilidades
└── styles/             # Estilos globales
```

## Configuración del Backend

La aplicación está configurada para conectarse al backend en:
```
https://hotel-management-backend-32ge.onrender.com/api
```

### Cuentas de Prueba

**Administrador:**
- Usuario: `admin`
- Contraseña: `Admin123!`

**Manager:**
- Usuario: `maria.gonzalez`
- Contraseña: `Admin123!`

**Recepcionista:**
- Usuario: `carlos.perez`
- Contraseña: `Admin123!`

**Personal de Limpieza:**
- Usuario: `ana.lopez`
- Contraseña: `Admin123!`

## Funcionalidades Implementadas

### ✅ Historias de Usuario Completadas

- **HU-01:** Reserva en línea con búsqueda en tiempo real
- **HU-02:** Check-in y check-out digital
- **HU-03:** Multilenguaje y accesibilidad móvil
- **RU-01:** Gestión de reservas para recepcionistas
- **RU-02:** Check-in/Check-out manual
- **LU-01:** Estado de habitaciones para limpieza
- **LU-02:** Reporte de incidencias
- **GU-01:** Reportes de ocupación
- **GU-02:** Reportes de ventas

### 🚧 Funcionalidades en Desarrollo

- Sistema de notificaciones en tiempo real
- Integración con pasarelas de pago
- Chat de soporte en vivo
- Aplicación móvil nativa
- Sistema de fidelización

## Criterios de Aceptación

### Validaciones Implementadas
- ✅ Formularios con validación en tiempo real
- ✅ Manejo de errores de API con mensajes descriptivos
- ✅ Timeout de 15 minutos para completar reservas
- ✅ Verificación de disponibilidad antes de confirmar
- ✅ Autenticación y autorización por roles

### Buenas Prácticas
- ✅ Componentes modulares y reutilizables
- ✅ Manejo de estado centralizado con Context API
- ✅ Código limpio y documentado
- ✅ Responsive design con mobile-first
- ✅ Optimización de rendimiento con lazy loading

### Manejo de Errores
- ✅ Interceptores de Axios para errores globales
- ✅ Fallbacks para errores de red
- ✅ Mensajes de error contextuales
- ✅ Retry automático para operaciones fallidas

## Despliegue

### Desarrollo
```bash
npm start
```

### Producción
```bash
npm run build
npm install -g serve
serve -s build -l 3000
```

### Variables de Entorno para Producción
```env
REACT_APP_API_BASE_URL=https://api.hotelmarazul.com
REACT_APP_HOTEL_NAME=Hotel Mar Azul
REACT_APP_CONTACT_PHONE=+502 7940-0000
REACT_APP_CONTACT_EMAIL=info@hotelmarazul.com
```

## Contribución

1. Fork el proyecto
2. Crear rama para feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit los cambios (`git commit -m 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abrir Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## Contacto

**Desarrollador:** Alexander Echeverria  
**Email:** alexander.echeverria@hotelmarazul.com  
**Proyecto:** Sistema de Gestión Hotelera "Mar Azul"  

## Roadmap

### Versión 1.1.0
- [ ] Sistema de notificaciones push
- [ ] Integración con WhatsApp Business
- [ ] Dashboard en tiempo real con WebSockets
- [ ] Sistema de reviews y calificaciones

### Versión 1.2.0
- [ ] Aplicación móvil (React Native)
- [ ] Integración con sistemas de pago locales
- [ ] Módulo de inventario
- [ ] Sistema de reportes avanzados con BI

---

**Última actualización:** Noviembre 2024  
**Estado:** En desarrollo activo  
**Soporte:** 24/7 durante implementación