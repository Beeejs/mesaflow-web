import { getStockStatus } from '../../../utils/productUtils'

const dotColors = {
  green: 'bg-green-500',
  orange: 'bg-orange-500',
  red: 'bg-red-500',
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

  const hiddenCount = products.filter(
    (product) => !product.visibleMenu
  ).length
  const outOfStockCount = products.filter(
    (product) => getStockStatus(product) === 'SIN_STOCK'
  ).length

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