/* MUI Icons */
import AddIcon from '@mui/icons-material/Add'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'

/* Components */
import DashboardDataGrid from '../../DashboardDataGrid'
import DashboardTableActionButton from '../../DashboardTableActionButton'

/* Utils */
import {
  formatPrice,
  getProductImage,
  getStockStatus,
} from '../../../../utils/productUtils'

const MenuSwitch = ({
  checked,
  disabled,
  disabledReason,
  label,
  onChange,
}) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      title={disabledReason}
      disabled={disabled}
      onClick={onChange}
      className={`relative h-[26px] w-[46px] rounded-full transition ${
        checked
          ? 'bg-green-500'
          : 'bg-mesa-muted'
      } ${
        disabled
          ? 'cursor-not-allowed opacity-60'
          : 'cursor-pointer'
      }`}
    >
      <span
        className={`absolute top-[3px] h-5 w-5 rounded-full bg-mesa-text transition-all ${
          checked
            ? 'left-[23px]'
            : 'left-[3px]'
        }`}
      />
    </button>
  )
}

const AvailabilityChip = ({ product }) => {
  if (!product.visibleMenu) {
    return (
      <span className="inline-flex rounded-lg border border-red-500/50 bg-red-500/10 px-3 py-1 text-sm font-semibold text-red-400">
        No disponible
      </span>
    )
  }

  const status = getStockStatus(product)

  if (status === 'SIN_STOCK') {
    return (
      <span className="inline-flex rounded-lg border border-orange-500/50 bg-orange-500/10 px-3 py-1 text-sm font-semibold text-orange-400">
        Sin stock
      </span>
    )
  }

  if (status === 'SIN_DATO') {
    return (
      <span className="inline-flex rounded-lg border border-mesa-border bg-mesa-card px-3 py-1 text-sm font-semibold text-mesa-muted">
        Stock sin inicializar
      </span>
    )
  }

  return (
    <span className="inline-flex rounded-lg border border-green-500/50 bg-green-500/10 px-3 py-1 text-sm font-semibold text-green-400">
      Disponible
    </span>
  )
}

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
  // Constantes derivadas
  const columns = [
    {
      field: 'nombre',
      headerName: 'Producto',
      flex: 1.3,
      minWidth: 220,
      sortable: true,
      renderCell: (params) => {
        const product = params.row

        return (
          <div className="flex h-full items-center gap-3">
            <button
              type="button"
              onClick={() => onViewImage(product)}
              title="Ver o cambiar imagen"
              aria-label={`Ver imagen de ${product.nombre}`}
              className="shrink-0 cursor-pointer rounded-xl transition hover:opacity-80"
            >
              <img
                src={getProductImage(product, 96)}
                alt={product.nombre}
                className="h-12 w-12 rounded-xl object-cover"
              />
            </button>

            <span className="font-semibold text-mesa-text">
              {product.nombre}
            </span>
          </div>
        )
      },
    },
    {
      field: 'descripcion',
      headerName: 'Descripción',
      flex: 1.5,
      minWidth: 220,
      renderCell: (params) => (
        <div className="flex h-full items-center">
          <span className="line-clamp-2 text-sm text-mesa-muted">
            {params.row.descripcion || '-'}
          </span>
        </div>
      ),
    },
    {
      field: 'categoria',
      headerName: 'Categoría',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <span className="text-mesa-cyan-light">
          {params.row.categoria || '-'}
        </span>
      ),
    },
    {
      field: 'precio',
      headerName: 'Precio',
      minWidth: 140,
      renderCell: (params) => (
        <span className="font-bold text-mesa-text">
          {formatPrice(params.row.precio)}
        </span>
      ),
    },
    {
      field: 'stockActual',
      headerName: 'Stock',
      minWidth: 150,
      sortable: false,
      renderCell: (params) => {
        const product = params.row

        if (!product.controlaStock) {
          return (
            <button
              type="button"
              onClick={() => onEditProduct(product)}
              className="cursor-pointer text-sm font-semibold text-mesa-primary transition hover:text-mesa-cyan-light"
            >
              Activar stock
            </button>
          )
        }

        if (!product.stockInicializado) {
          return (
            <button
              type="button"
              onClick={() => onEditProduct(product)}
              className="cursor-pointer text-sm font-semibold text-mesa-muted transition hover:text-mesa-cyan-light"
            >
              Sin iniciar
            </button>
          )
        }

        return (
          <button
            type="button"
            onClick={() => onAdjustStock(product)}
            title="Registrar movimiento"
            className="cursor-pointer font-bold text-mesa-text transition hover:text-mesa-cyan-light"
          >
            {typeof product.stockActual === 'number'
              ? product.stockActual
              : '-'}
          </button>
        )
      },
    },
    {
      field: 'visibleMenu',
      headerName: 'En menú',
      minWidth: 110,
      sortable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => {
        const product = params.row

        const stockNotInitialized =
          product.controlaStock &&
          !product.stockInicializado

        return (
          <div className="flex h-full items-center justify-center">
            <MenuSwitch
              checked={Boolean(product.visibleMenu)}
              disabled={
                togglingId === product.idProducto ||
                stockNotInitialized
              }
              disabledReason={
                stockNotInitialized
                  ? 'Inicializá el stock desde Editar producto'
                  : undefined
              }
              label={`Mostrar ${product.nombre} en el menú`}
              onChange={() => onToggleVisible(product)}
            />
          </div>
        )
      },
    },
    {
      field: 'availability',
      headerName: 'Disponibilidad',
      minWidth: 180,
      sortable: false,
      renderCell: (params) => (
        <AvailabilityChip product={params.row} />
      ),
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      minWidth: 170,
      sortable: false,
      filterable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => {
        const product = params.row

        const canAdjustStock =
          product.controlaStock &&
          product.stockInicializado

        return (
          <div className="flex h-full items-center justify-center gap-1">
            <DashboardTableActionButton
              title={
                canAdjustStock
                  ? `Registrar movimiento de ${product.nombre}`
                  : `Configurar stock de ${product.nombre}`
              }
              onClick={() =>
                canAdjustStock
                  ? onAdjustStock(product)
                  : onEditProduct(product)
              }
              highlight={canAdjustStock}
            >
              <AddIcon sx={{ fontSize: 20 }} />
            </DashboardTableActionButton>

            <DashboardTableActionButton
              title={`Editar ${product.nombre}`}
              onClick={() => onEditProduct(product)}
            >
              <EditOutlinedIcon sx={{ fontSize: 20 }} />
            </DashboardTableActionButton>

            <DashboardTableActionButton
              title={`Eliminar ${product.nombre}`}
              onClick={() => onDeleteProduct(product)}
            >
              <DeleteOutlinedIcon sx={{ fontSize: 20 }} />
            </DashboardTableActionButton>
          </div>
        )
      },
    },
  ]

  // Renderizado
  return (
    <DashboardDataGrid
      rows={products}
      columns={columns}
      getRowId={(product) => product.idProducto}
      loading={loading}
      rowHeight={76}
      emptyMessage="Todavía no hay productos cargados."
    />
  )
}

export default ProductsTable