import { QueryClient } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 2,
    },
  },
})


// Query keys | Para identificar las queries y poder invalidarlas o refetcharlas
export const queryKeys = {
  users: ['users'],
  roles: ['roles'],
  establishments: ['establishments'],
  myEstablishments: ['my-establishments'],
  establishmentStates: ['establishment-states'],
  provinces: ['provinces'],
  districts: (provinceId) => ['districts', provinceId],
  establishmentUsers: (idEstablecimiento) => [
    'establishments',
    idEstablecimiento,
    'users',
  ],
  establishmentRoles: ['establishment-roles'],
  assignedEstablishments: ['assigned-establishments'],
  products: (idEstablecimiento) => [
    'establishments',
    idEstablecimiento,
    'products',
  ],
  productCategories: (idEstablecimiento) => [
    'establishments',
    idEstablecimiento,
    'product-categories',
  ],
  stockMovements: (
    idEstablecimiento,
    productIds = []
  ) => [
    'establishments',
    idEstablecimiento,
    'stock-movements',
    productIds,
  ],

  stockMovementsPrefix: (idEstablecimiento) => [
    'establishments',
    idEstablecimiento,
    'stock-movements',
  ],

  stockMovementReasons: (
    idEstablecimiento,
    tipoMovimiento
  ) => [
    'establishments',
    idEstablecimiento,
    'stock-movement-reasons',
    tipoMovimiento,
  ],

  // Configuraciones de mesas
  tableConfigurations: (idEstablecimiento) => [
    'establishments',
    idEstablecimiento,
    'table-configurations',
  ],

  // Distribución de una configuración
  tableDistribution: (
    idEstablecimiento,
    idConfiguracionMesa
  ) => [
    'establishments',
    idEstablecimiento,
    'table-configurations',
    idConfiguracionMesa,
    'distribution',
  ],

  // Prefijo para invalidar las distribuciones
  tableDistributionsPrefix: (idEstablecimiento) => [
    'establishments',
    idEstablecimiento,
    'table-configurations',
  ],

  // Sectores del establecimiento
  sectors: (idEstablecimiento) => [
    'establishments',
    idEstablecimiento,
    'sectors',
  ],
}

export default queryClient