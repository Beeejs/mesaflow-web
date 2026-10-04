/* MUI Icons */
import AddIcon from '@mui/icons-material/Add'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'

/* Utils */
import {
  formatPrice,
  getProductImage,
  getStockStatus,
} from '../../../utils/productUtils'

const actionStyles = {
  stock: 'bg-green-500/20 text-green-400 hover:bg-green-500/30',
  edit: 'bg-white/10 text-slate-400 hover:bg-white/20 hover:text-white',
  delete: 'bg-red-500/15 text-red-500 hover:bg-red-500/25',
}

const ActionButton = ({ tone, title, onClick, disabled, children }) => (
  <button
    type="button"
    title={title}
    aria-label={title}
    onClick={onClick}
    disabled={disabled}
    className={`flex h-9 w-11 cursor-pointer items-center justify-center rounded-lg transition disabled:cursor-not-allowed disabled:opacity-40 ${actionStyles[tone]}`}
  >
    {children}
  </button>
)

const MenuSwitch = ({
  checked,
  disabled,
  disabledReason,
  label,
  onChange,
}) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    title={disabledReason}
    disabled={disabled}
    onClick={onChange}
    className={`relative h-[26px] w-[46px] cursor-pointer rounded-full transition disabled:cursor-wait disabled:opacity-60 ${
      checked ? 'bg-green-500' : 'bg-slate-600'
    }`}
  >
    <span
      className={`absolute top-[3px] h-5 w-5 rounded-full bg-white transition-all ${
        checked ? 'left-[23px]' : 'left-[3px]'
      }`}
    />
  </button>
)

const chipBase =
  'inline-flex rounded-lg border px-3.5 py-1.5 text-[15px] font-semibold whitespace-nowrap'

const AvailabilityChip = ({ product }) => {
  if (!product.visibleMenu) {
    return (
      <span className={`${chipBase} border-red-500/60 bg-red-500/10 text-red-500`}>
        No disponible
      </span>
    )
  }

  const status = getStockStatus(product)

  if (status === 'SIN_STOCK') {
    return (
      <span className={`${chipBase} border-orange-500/60 bg-orange-500/10 text-orange-500`}>
        Sin stock
      </span>
    )
  }

  if (status === 'SIN_DATO') {
    return (
      <span className={`${chipBase} border-white/10 bg-white/5 text-slate-400`}>
        Stock sin inicializar
      </span>
    )
  }

  return (
    <span className={`${chipBase} border-green-500/60 bg-green-500/10 text-green-500`}>
      Disponible
    </span>
  )
}

const StockCell = ({ product, onClick }) => {
  const status = getStockStatus(product)
  const stockInitialized = Boolean(product.stockInicializado)

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onClick}
        title={
          stockInitialized
            ? 'Registrar movimiento'
            : 'Configurar el stock inicial'
        }
        className="cursor-pointer text-lg font-bold text-white hover:text-mesa-primary"
      >
        {typeof product.stockActual === 'number'
          ? product.stockActual
          : '-'}
      </button>

      {status === 'SIN_STOCK' && (
        <span className="rounded-md bg-orange-500/15 px-2 py-0.5 text-xs font-semibold text-orange-500">
          Sin stock
        </span>
      )}
      {status === 'SIN_DATO' && (
        <span className="rounded-md bg-white/5 px-2 py-0.5 text-xs font-semibold text-slate-400">
          Sin iniciar
        </span>
      )}
    </div>
  )
}

const headCell =
  'px-4 py-5 text-left text-sm font-bold uppercase tracking-wider text-slate-500'

const ProductsTable = ({
  products = [],
  loading = false,
  togglingId = null,
  onToggleVisible,
  onAdjustStock,
  onEditProduct,
  onDeleteProduct,
  onViewImage,
}) => {
  if (loading) {
    return <p className="p-8 text-center text-slate-500">Cargando productos...</p>
  }

  if (products.length === 0) {
    return (
      <p className="p-8 text-center text-slate-500">
        Todavía no hay productos cargados.
      </p>
    )
  }

  return (
    <div className="overflow-x-auto rounded-3xl border border-mesa-border bg-mesa-surface">
      <table className="w-full min-w-[960px] border-collapse">
        <thead>
          <tr className="border-b border-mesa-border">
            <th className={headCell}>Producto</th>
            <th className={headCell}>Descripción</th>
            <th className={headCell}>Categoría</th>
            <th className={headCell}>Precio</th>
            <th className={headCell}>Stock</th>
            <th className={headCell}>En menú</th>
            <th className={headCell}>Disponibilidad</th>
            <th className={`${headCell} text-center`}>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr
              key={product.idProducto}
              className="border-b border-mesa-border transition-colors last:border-b-0 hover:bg-white/5"
            >
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => onViewImage(product)}
                    title="Ver o cambiar imagen"
                    aria-label={`Ver imagen de ${product.nombre}`}
                    className="shrink-0 cursor-pointer rounded-xl transition hover:opacity-80 focus-visible:outline-2 focus-visible:outline-mesa-primary"
                  >
                    <img
                      src={getProductImage(product)}
                      alt={product.nombre}
                      className="h-[52px] w-[52px] rounded-xl object-cover"
                    />
                  </button>
                  <span className="text-lg font-medium text-white">
                    {product.nombre}
                  </span>
                </div>
              </td>

              <td className="max-w-[220px] px-4 py-3 text-base text-slate-500">
                <span className="line-clamp-2">{product.descripcion}</span>
              </td>

              <td className="px-4 py-3 text-base text-sky-300">
                {product.categoria}
              </td>

              <td className="px-4 py-3 text-lg font-bold text-white">
                {formatPrice(product.precio)}
              </td>

              <td className="px-4 py-4">
                {product.controlaStock ? (
                  <StockCell
                    product={product}
                    onClick={() =>
                      product.stockInicializado
                        ? onAdjustStock(product)
                        : onEditProduct(product)
                    }
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => onEditProduct(product)}
                    className="cursor-pointer text-sm font-semibold text-mesa-primary hover:text-mesa-cyan"
                  >
                    Activar stock
                  </button>
                )}
              </td>

              <td className="px-4 py-4">
                <MenuSwitch
                  checked={Boolean(product.visibleMenu)}
                  disabled={
                    togglingId === product.idProducto ||
                    (product.controlaStock && !product.stockInicializado)
                  }
                  disabledReason={
                    product.controlaStock && !product.stockInicializado
                      ? 'Inicializá el stock desde Editar producto'
                      : undefined
                  }
                  label={`Mostrar ${product.nombre} en el menú`}
                  onChange={() => onToggleVisible(product)}
                />
              </td>

              <td className="px-4 py-4">
                <AvailabilityChip product={product} />
              </td>

              <td className="px-4 py-4">
                <div className="flex items-center justify-center gap-2">
                  <ActionButton
                    tone="stock"
                    title={
                      product.stockInicializado
                        ? `Registrar movimiento de ${product.nombre}`
                        : `Configurar stock inicial de ${product.nombre}`
                    }
                    onClick={() =>
                      product.controlaStock && product.stockInicializado
                        ? onAdjustStock(product)
                        : onEditProduct(product)
                    }
                  >
                    <AddIcon sx={{ fontSize: 20 }} />
                  </ActionButton>

                  <ActionButton
                    tone="edit"
                    title={`Editar ${product.nombre}`}
                    onClick={() => onEditProduct(product)}
                  >
                    <EditOutlinedIcon sx={{ fontSize: 20 }} />
                  </ActionButton>

                  <ActionButton
                    tone="delete"
                    title={`Eliminar ${product.nombre}`}
                    onClick={() => onDeleteProduct(product)}
                  >
                    <DeleteOutlinedIcon sx={{ fontSize: 20 }} />
                  </ActionButton>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ProductsTable