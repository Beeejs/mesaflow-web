# MesaFlow Web

Frontend web de **MesaFlow** desarrollado con **React + Vite**.


---

## 1. Requisitos

Para ejecutar el proyecto localmente se necesita:

- Node.js
- npm
- Git
- Backend de MesaFlow ejecutándose localmente
- Visual Studio Code o IDE compatible

URLs utilizadas en desarrollo:

```text
Frontend: http://localhost:5173
Backend:  http://localhost:8080
```

---

## 2. Tecnologías principales

```text
React
Vite
React Router
Tailwind CSS v4
Material UI
Axios
Sonner
Google OAuth
```

---

## 3. Instalación

Después de clonar el repositorio:

```bash
git clone <url-del-repositorio>
cd mesaflow-web
```

Instalar dependencias:

```bash
npm install
```

Crear un archivo `.env` en la raíz del proyecto:

```env
VITE_API_URL=http://localhost:8080
VITE_GOOGLE_CLIENT_ID=TU_GOOGLE_CLIENT_ID
```

Ejecutar el proyecto:

```bash
npm run dev
```

Si todo está configurado correctamente, Vite mostrará una URL similar a:

```text
http://localhost:5173
```

---

## 4. Scripts disponibles

```bash
npm run dev      # inicia el servidor local
npm run build    # genera el build de producción
npm run lint     # ejecuta ESLint
npm run preview  # previsualiza el build generado
```

---

## 5. Variables de entorno

El frontend utiliza variables de entorno de Vite. Todas las variables que deban ser leídas por React deben comenzar con `VITE_`.

```env
VITE_API_URL=http://localhost:8080
VITE_GOOGLE_CLIENT_ID=TU_GOOGLE_CLIENT_ID
```

Descripción:

```text
VITE_API_URL
→ URL base del backend de MesaFlow.

VITE_GOOGLE_CLIENT_ID
→ Client ID de Google OAuth utilizado por el frontend Web.
```

---

## 6. Configuración local necesaria

Antes de ejecutar el frontend, verificar que el backend esté corriendo y que tenga permitido el origen local del frontend:

```properties
app.cors.allowed-origins=http://localhost:5173,http://localhost:3000
```

Para usar Google Login, el origen local también debe estar autorizado en Google Cloud Console:

```text
http://localhost:5173
```

El origen debe cargarse sin path y sin barra final.

Correcto:

```text
http://localhost:5173
```

Incorrecto:

```text
http://localhost:5173/
http://localhost:5173/login
```

---

## 7. Autenticación y sesión

El frontend permite iniciar sesión con email y contraseña o mediante Google Login.

La sesión del usuario se mantiene centralizada en el contexto de sesión del proyecto. La validación y persistencia de la autenticación queda a cargo del backend.

---

## 8. Hooks para requests

El proyecto utiliza hooks reutilizables para centralizar llamadas HTTP desde los componentes.

```text
useGet  → consultas de datos mediante GET
usePost → envío de datos mediante POST
```

La idea es evitar repetir lógica de carga, errores y respuestas en cada componente.

---

## 9. Organización del frontend

Estructura principal:

```text
src/
├── api/
│   ├── axiosConfig.js
│   ├── authService.js
│   └── handleApiResponse.js
├── components/
│   ├── associate/
│   ├── auth/
│   ├── benefits/
│   ├── contact/
│   ├── mobile/
│   ├── platform/
│   ├── services/
│   ├── session/
│   ├── BackLink.jsx
│   ├── DefaultButton.jsx
│   ├── Footer.jsx
│   ├── Header.jsx
│   ├── Logo.jsx
│   └── Navbar.jsx
├── constants/
├── context/
├── hooks/
├── layouts/
├── pages/
├── router.jsx
├── main.jsx
└── globals.css
```

Responsabilidad general:

```text
api        → configuración de Axios y services HTTP
components → componentes reutilizables
constants  → datos estáticos reutilizables
context    → estado global de sesión
hooks      → lógica reutilizable
layouts    → estructuras comunes de pantalla
pages      → vistas principales
```

---

## 10. Estilos

El proyecto utiliza **Tailwind CSS v4**.

La configuración principal de estilos se encuentra en:

```text
src/globals.css
```

Colores principales de MesaFlow:

```text
Fondo principal:  #03070F
Superficie:       #0B111C
Card:             #111827
Borde:            #1F2937
Texto principal:  #F8FAFC
Texto secundario: #94A3B8
Azul principal:   #056EF8
Azul oscuro:      #1E60DB
Celeste:          #099CF7 / #10C4FC
```

Fuentes principales:

```text
Manrope → interfaz general
Poppins → títulos y elementos destacados
```
