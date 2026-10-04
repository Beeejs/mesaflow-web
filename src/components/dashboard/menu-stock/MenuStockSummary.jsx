import { getStockStatus } from '../../../utils/productUtils'

const dotColors = {
  green: 'bg-green-500',
  yellow: 'bg-yellow-500',
  orange: 'bg-orange-500',
}

const SummaryCard = ({ label, value, dot, active = false, onClick }) => {
  const Tag = onClick ? 'button' : 'article'

  return (
    <Tag
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      aria-pressed={onClick ? active : undefined}
      className={`rounded-2xl border px-6 py-5 text-left transition ${
        active
          ? 'border-mesa-primary bg-gradient-to-b from-mesa-primary/15 to-mesa-primary/5'
          : 'border-mesa-border bg-mesa-surface'
      } ${onClick ? 'cursor-pointer hover:border-white/20' : ''}`}
    >
      <p className="flex items-center gap-2 text-base text-slate-300">
        {dot && (
          <span className={`h-2 w-2 rounded-full ${dotColors[dot]}`} />
        )}
        {label}
      </p>

      <p className="mt-2 font-display text-3xl font-bold text-white">
        {value}
      </p>
    </Tag>
  )
}

const MenuStockSummary = ({
  products = [],
  filter = 'todos',
  onFilterChange,
}) => {
  const visibleCount = products.filter(
    (product) => product.visibleMenu
  ).length

  // Sin cantidades informadas por el backend no se puede calcular
  const hasStockData = products.some(
    (product) => getStockStatus(product) !== 'SIN_DATO' &&
      getStockStatus(product) !== 'SIN_CONTROL'
  )
  const countByStatus = (status) =>
    hasStockData
      ? products.filter((product) => getStockStatus(product) === status).length
      : '-'
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
        label="Stock bajo"
        value={countByStatus('BAJO')}
        dot="yellow"
        active={filter === 'bajo'}
        onClick={() => onFilterChange('bajo')}
      />

      <SummaryCard
        label="Sin stock"
        value={countByStatus('SIN_STOCK')}
        dot="orange"
        active={filter === 'sin'}
        onClick={() => onFilterChange('sin')}
      />
    </div>
  )
}

export default MenuStockSummary