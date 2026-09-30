/* MUI Icons */
import DashboardIcon from '@mui/icons-material/Dashboard'
import GroupIcon from '@mui/icons-material/Group'
import StorefrontIcon from '@mui/icons-material/Storefront'
import EventSeatIcon from '@mui/icons-material/EventSeat'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'

export const navbarList = [
  {
    label: 'Inicio',
    href: '#inicio'
  },
  {
    label: 'Servicios',
    href: '#servicios',
  },
  {
    label: 'Beneficios',
    href: '#beneficios',
  },
  {
    label: 'Plataforma',
    href: '#plataforma',
  },
  {
    label: 'Contacto',
    href: '#contacto',
  },
]


export const servicesList = [
  {
    number: '01',
    title: 'Reservas online',
    image: '/img/reservas.png',
    description:
      'Permití que tus clientes reserven mesas de forma simple y gestioná la disponibilidad desde la plataforma.',
  },
  {
    number: '02',
    title: 'Menú digital QR',
    image: '/img/menu-digital-qr.png',
    description:
      'Mostrá productos, categorías, precios e imágenes desde un menú digital accesible con código QR.',
  },
  {
    number: '03',
    title: 'Pedidos desde la mesa',
    image: '/img/pedidos-mesa.png',
    description:
      'Reducí tiempos de espera permitiendo que el cliente realice pedidos directamente desde su celular.',
  },
  {
    number: '04',
    title: 'Gestión del restaurante',
    image: '/img/gestion-restaurante.png',
    description:
      'Administrá mesas, usuarios, pedidos, reservas y pagos desde una única plataforma centralizada.',
  },
]

export const benefitsList = [
  {
    title: 'Menos errores operativos',
    description:
      'Centralizar reservas, pedidos y mesas reduce confusiones entre el salón, la cocina y la administración.',
    icon: '/icons/menos-errores.svg',
  },
  {
    title: 'Mayor control del negocio',
    description:
      'El restaurante puede visualizar mejor lo que ocurre en tiempo real y tomar decisiones con más información.',
    icon: '/icons/control-negocio.svg',
  },
  {
    title: 'Mejor experiencia para el cliente',
    description:
      'El cliente puede interactuar con el establecimiento de forma más ágil, desde consultar el menú hasta solicitar la cuenta.',
    icon: '/icons/experiencia-cliente.svg',
  },
  {
    title: 'Optimización en horarios pico',
    description:
      'MesaFlow ayuda a ordenar la operación cuando el local tiene mayor demanda y el equipo necesita trabajar con más coordinación.',
    icon: '/icons/horarios-pico.svg',
  },
]

export const platformList = [
  {
    tag: 'Cliente',
    title: 'Menú digital QR',
    icon: '/icons/menu-qr.svg',
    description:
      'El cliente puede consultar productos, precios, imágenes y categorías desde su celular.',
  },
  {
    tag: 'Cliente',
    title: 'Pedidos desde la mesa',
    icon: '/icons/pedidos-mesa.svg',
    description:
      'Permite realizar pedidos sin depender completamente de la atención manual del mozo.',
  },
  {
    tag: 'Gestión',
    title: 'Reservas y disponibilidad',
    icon: '/icons/reservas-disponibilidad.svg',
    description:
      'El establecimiento puede administrar reservas, horarios, mesas disponibles y capacidad.',
  },
  {
    tag: 'Gestión',
    title: 'Administración de mesas',
    icon: '/icons/administracion-mesas.svg',
    description:
      'Permite visualizar y organizar las mesas del salón según su estado y disponibilidad.',
  },
  {
    tag: 'Equipo',
    title: 'Usuarios y roles',
    icon: '/icons/usuarios-roles.svg',
    description:
      'MesaFlow permite organizar usuarios del establecimiento según sus responsabilidades.',
  },
  {
    tag: 'Negocio',
    title: 'Pagos y reportes',
    icon: '/icons/pagos-reportes.svg',
    description:
      'Centraliza información útil para analizar el funcionamiento del restaurante y tomar mejores decisiones.',
  },
]

export const metricsList = [
  {
    label: 'Módulos integrados',
    value: '5+',
    description: 'Reservas, pedidos, mesas, menú y usuarios',
    color: 'text-mesa-cyan-light',
  },
  {
    label: 'Gestión centralizada',
    value: '100%',
    description: 'Todo desde una única plataforma',
    color: 'text-mesa-success',
  },
  {
    label: 'Escalabilidad',
    value: '+50',
    description: 'Locales preparados para operar con MesaFlow',
    color: 'text-mesa-warning',
  },
]


export const dashboardNavigation = [
  {
    label: 'Panel',
    to: '/dashboard',
    icon: DashboardIcon,
    end: true,
  },
  {
    label: 'Usuarios',
    to: '/dashboard/usuarios',
    icon: GroupIcon,
  },
  {
    label: 'Establecimientos',
    to: '/dashboard/establecimientos',
    icon: StorefrontIcon,
  },
]


export const dashboardCards = [
  {
    title: 'Usuarios',
    description: 'Administrá los usuarios globales de MesaFlow.',
    to: '/dashboard/usuarios',
    icon: GroupIcon,
    available: true,
  },
  {
    title: 'Establecimientos',
    description: 'Consultá y gestioná los establecimientos registrados.',
    to: '/dashboard/establecimientos',
    icon: StorefrontIcon,
    available: true,
  },
  {
    title: 'Reservas',
    description: 'Módulo pendiente de implementación.',
    to: '#',
    icon: EventSeatIcon,
    available: false,
  },
  {
    title: 'Pedidos',
    description: 'Módulo pendiente de implementación.',
    to: '#',
    icon: ReceiptLongIcon,
    available: false,
  },
]


// ----- Constantes para los formularios de registro y edición -----

// Establecimientos
export const establishmentFields = [
  'nombre',
  'razonSocial',
  'cuit',
  'direccion',
  'idPartido',
  'codigoPostal',
  'telefono',
  'email',
  'idEstadoEstablecimiento',
]

// Usuarios
export const userFields = [
  'nombre',
  'apellido',
  'rol',
  'activo',
]