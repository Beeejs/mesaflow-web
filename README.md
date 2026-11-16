# MesaFlow Web

## Pedidos del establecimiento

La opcion Pedidos del panel del establecimiento permite al ENCARGADO
listar y filtrar pedidos, consultar sus detalles, pasar de PENDIENTE a
EN_PREPARACION y de EN_PREPARACION a ENTREGADO. Los botones de estado muestran
cantidades sobre los resultados de la busqueda, sin depender del estado
seleccionado. La busqueda se aplica al escribir, por pedido, mesa,
cliente (ID), sesion, productos y observaciones, ignorando acentos y
mayusculas. Pedidos Activos consulta sesiones ABIERTAS e incluye sus pedidos
entregados y cancelados. Historial Pedidos consulta solo sesiones CERRADAS,
mantiene los filtros por estado y la busqueda y permite consultar detalles
y cuentas, pero no preparar, cancelar ni cerrar cuentas desde esa vista.
Los cancelados de cuentas abiertas permanecen en Activos.
Se consulta `sesionEstado` en REST,
sin inferir el cierre desde el estado del pedido ni desde la mesa actual.
Cambiar la busqueda, el estado o la solapa vuelve a la primera pagina.
Un clic en la fila (o Enter sobre una celda) abre el pedido. Desde su
detalle se puede abrir la cuenta de la mesa y desde esa cuenta abrir
cualquier pedido, sin apilar dialogos.
La columna Mesa muestra solo su codigo en un recuadro neutro, sin vincular
el historial de pedidos a las ocupaciones posteriores de esa mesa.
El mozo asignado tambien puede confirmar la entrega. La cancelacion
requiere motivo (hasta 255 caracteres) y se limita a PENDIENTE o
EN_PREPARACION. El backend valida permisos, transiciones y reposicion de stock.

La cuenta de sesion muestra todos sus pedidos y el total sin cancelados.
El cierre requiere pedidos entregados o cancelados y confirmacion del
cobro fuera del sistema; no procesa pagos. El backend cierra la sesion y
libera la mesa. Los cambios se reciben mediante SSE mientras la vista esta
activa; si se pierde la conexion, se actualizan cada 15 segundos hasta
recuperarla. Los avisos SSE se agrupan en ventanas de 250 ms y esperan
las consultas en curso, sin reiniciarlas por cada evento. Si llegan
mas cambios durante una recarga, se consulta nuevamente al terminar.
El evento CONECTADO sincroniza de inmediato al conectar o reconectar,
sin duplicar la recarga con onopen. Volver a una pestana visible o
recuperar la red tambien solicita sincronizacion REST mediante la misma
cola de recargas. Se mantiene una sola conexion por vista activa del
establecimiento; el ping no dispara consultas. Al salir se cancelan
las recargas pendientes y las consultas HTTP de pedidos, cuentas y mesas
que ya no tienen observadores. Esto no garantiza la cancelacion de SQL
que el backend ya haya empezado a ejecutar. Tambien se eliminan los
listeners de visibilidad y recuperacion de red.
Mesas tambien recibe estos avisos para actualizar su estado
operativo: la habilitacion es independiente de estar disponible u ocupada.
El primer pedido ocupa la mesa y el cierre de la cuenta la libera.
Inicio reutiliza las acciones y dialogos de Pedidos para el ENCARGADO,
pero consulta solo sesiones ABIERTAS y oculta los pedidos CANCELADOS.
Su tablero adapta la maqueta de la guia: saludo y fecha, indicadores
reales de cuentas abiertas, pedidos por preparar/entregar y mesas
ocupadas/habilitadas; tarjetas de pedidos y resumen del estado de mesas.
El indicador de ocupación usa una dona en la misma fila de tarjetas:
naranja para ocupadas y cian para el resto de mesas habilitadas, con
porcentaje y cantidades. "Restantes" no significa disponibles: puede
incluir reservadas o fuera de servicio. Sin mesas habilitadas se muestra
un anillo neutro, sin porcentaje. Reutiliza la tarjeta de resumen y
CircularProgress de MUI, sin bibliotecas nuevas ni consultas adicionales.
Las tarjetas se paginan y permiten abrir pedido, cuenta y acciones.
Los botones de resumen filtran solo ese listado: todas las cuentas
abiertas, pedidos por preparar, por entregar o de mesas ocupadas habilitadas.
Los indicadores, el bloque de reservas y el estado de mesas no cambian
por seleccionar un filtro; la paginacion vuelve a la primera pagina.
Ingresos muestra un cero provisional con control para ocultar/mostrar
el importe, sin mensaje adicional en la tarjeta. Reservas muestra
el texto fijo "Sin Reservas", tambien identificado como pendiente.
Ninguno representa datos reales de cobros o reservas todavia; no se
infieren pagos a partir de pedidos entregados o cuentas cerradas.
Los ENTREGADOS permanecen hasta cerrar la cuenta; el cierre actualiza
Inicio por SSE sin borrar el historial de Pedidos. Las consultas por
cuenta tienen caches separadas y se invalidan juntas ante cambios.
No se implementan
notificaciones push ni creacion de pedidos desde este panel.

Frontend web de **MesaFlow** desarrollado con **React + Vite**.

Menu y stock y Pedidos comparten `DashboardTabs`, con las solapas antes
de los indicadores/filtros y del listado. La seleccion funciona por clic
y teclado (flechas, Inicio y Fin), con el mismo estilo y comportamiento.

El componente compartido de tablas usa la traduccion espanola de MUI
DataGrid para filtros, operadores, menus y paginacion. Su tema oscuro
tambien se aplica a desplegables renderizados fuera de la tabla mediante
portales, reutilizando la paleta de los formularios.

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

---

## 11. Imagenes de productos

Los productos sin foto propia muestran un icono SVG local de
`src/assets/products`, importado por Vite, segun su categoria: Plato, Bebida, Entrada o
Acompanamiento. Otras categorias usan el icono de Plato.
Estos archivos no se envian al backend ni a ImageKit.

`imagenUrl` vacia, nula o con el texto `SIN IMAGEN` activa el icono local.
Una foto elegida por el usuario se envia como archivo al backend usando
el flujo de alta o edicion existente; el backend gestiona ImageKit y la
referencia persistida.

El boton **Eliminar imagen** permanece deshabilitado hasta conectar la
operacion de backend que borre el archivo en ImageKit y deje `SIN IMAGEN`
en la base de datos. No se simula una eliminacion local ni se expone la
clave privada de ImageKit en la web. Descartar una foto nueva no elimina
la foto guardada.

Las fotos de `https://ik.imagekit.io` se solicitan con transformaciones
de ancho, calidad 75 y formato automatico: 96 px en la tabla, 320 px en
el formulario y 1024 px en la vista ampliada. No se modifica el original
ni la URL persistida. Los iconos locales, las previsualizaciones de
archivos nuevos y las URLs de otros proveedores no se transforman.
Se conservan los parametros existentes; las URLs firmadas (`ik-s`)
no se alteran porque necesitan una nueva firma desde el backend.

## 12. Usuarios del establecimiento

La opcion Usuarios del panel del establecimiento permite al encargado
listar el personal, buscar una cuenta activa por email y asociarla con
el rol MOZO. El identificador del rol se obtiene del backend; no se fija
un ID en la web. Tambien permite desasociar mozos sin eliminar su cuenta
de MesaFlow. La pantalla administrativa conserva la seleccion de roles
y sus acciones existentes.

Este flujo usa la asociacion directa disponible en el backend: no envia
una invitacion ni requiere aceptacion del destinatario. La invitacion,
su aceptacion o rechazo y su presentacion en el perfil quedan pendientes
de acordar con el backend y mobile. Los permisos efectivos siguen
validandose en el backend.
