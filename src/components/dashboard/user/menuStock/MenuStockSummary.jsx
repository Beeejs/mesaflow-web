/* Utils */
import {
  getStockStatus,
  MOVEMENT_FILTER_TYPES,
} from '../../../../utils/productUtils'

import SummaryCard from '../../DashboardSummaryCard'

const MenuStockSummary = ({
  products = [],
  movements = [],
  mode = 'productos',
  filter = 'todos',
  onFilterChange,
}) => {
  if (mode === 'historial') {
    const countByFilter = (key) =>
      movements.filter((movement) =>
        MOVEMENT_FILTER_TYPES[key].includes(
          movement.tipoMovimiento
        )
      ).length

    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Movimientos"
          value={movements.length}
          active={filter === 'todos'}
          onClick={() => onFilterChange('todos')}
        />

        <SummaryCard
          label="Ingresos"
          value={countByFilter('ingresos')}
          dot="green"
          active={filter === 'ingresos'}
          onClick={() => onFilterChange('ingresos')}
        />

        <SummaryCard
          label="Egresos y ventas"
          value={countByFilter('egresos')}
          dot="red"
          active={filter === 'egresos'}
          onClick={() => onFilterChange('egresos')}
        />

        <SummaryCard
          label="Ajustes"
          value={countByFilter('ajustes')}
          dot="orange"
          active={filter === 'ajustes'}
          onClick={() => onFilterChange('ajustes')}
        />
      </div>
    )
  }

  // Constantes derivadas
  const visibleCount = products.filter(
    (product) => product.visibleMenu
  ).length

  const hiddenCount = products.filter(
    (product) => !product.visibleMenu
  ).length

  const outOfStockCount = products.filter(
    (product) => getStockStatus(product) === 'SIN_STOCK'
  ).length

  // Renderizado
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <SummaryCard
        label="Productos"
        value={products.length}
        active={filter === 'todos'}
        onClick={() => onFilterChange('todos')}
      />

      <SummaryCard
        label="Visibles en el menú"
        value={visibleCount}
        dot="green"
        active={filter === 'menu'}
        onClick={() => onFilterChange('menu')}
      />

      <SummaryCard
        label="Ocultos del menú"
        value={hiddenCount}
        dot="orange"
        active={filter === 'ocultos'}
        onClick={() => onFilterChange('ocultos')}
      />

      <SummaryCard
        label="Sin stock"
        value={outOfStockCount}
        dot="red"
        active={filter === 'sin'}
        onClick={() => onFilterChange('sin')}
      />
    </div>
  )
}

export default MenuStockSummary