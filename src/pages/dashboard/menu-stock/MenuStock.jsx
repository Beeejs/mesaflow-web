import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

/* MUI */
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'

/* MUI Icons */
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import SwapVertIcon from '@mui/icons-material/SwapVert'

/* Components */
import DashboardPageHeader from '../../../components/dashboard/DashboardPageHeader'
import DashboardRefreshButton from '../../../components/dashboard/DashboardRefreshButton'
import DefaultButton from '../../../components/common/button/DefaultButton'
import Loader from '../../../components/common/loader/Loader'
import MenuStockSummary from '../../../components/dashboard/menu-stock/MenuStockSummary'
import ProductsTable from '../../../components/dashboard/menu-stock/ProductsTable'
import ProductImageDialog from '../../../components/dashboard/menu-stock/ProductImageDialog'
import ProductFormDialog from '../../../components/dashboard/menu-stock/ProductFormDialog'
import StockMovementDialog from '../../../components/dashboard/menu-stock/StockMovementDialog'
import { getStockStatus } from '../../../utils/productUtils'
import StockMovementsTable from '../../../components/dashboard/menu-stock/StockMovementsTable'

/* Hooks */
import useAssignedEstablishmentsQuery from '../../../hooks/queries/useAssignedEstablishmentsQuery'
import useProductsQuery from '../../../hooks/queries/useProductsQuery'
import useProductCategoriesQuery from '../../../hooks/queries/useProductCategoriesQuery'
import useStockMovementsQuery from '../../../hooks/queries/useStockMovementsQuery'
import useUpdateProductMutation from '../../../hooks/mutations/useUpdateProductMutation'
import useDeleteProductMutation from '../../../hooks/mutations/useDeleteProductMutation'

/* Styles */
import {
  textFieldStyles,
  selectSlotProps,
} from '../../../styles/formStyles'

const tabs = [
  { key: 'productos', label: 'Productos' },
  { key: 'movimientos', label: 'Movimientos de stock' },
]

// Botones del encabezado con el tamaño y estilo del diseño aprobado
const headerButtonSx = {
  padding: '9px 18px',
  fontSize: '15px',
  fontWeight: 500,
  lineHeight: '22px',
  borderRadius: '10px',
  boxShadow: 'none',
}

const ghostButtonSx = {
  backgroundColor: 'transparent',
  color: '#94A3B8',
  border: '1px solid rgba(255, 255, 255, 0.06)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
}

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback

const MenuStock = () => {
  const [activeTab, setActiveTab] = useState('productos')
  const [selectedEstablishmentId, setSelectedEstablishmentId] =
    useState('')
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [summaryFilter, setSummaryFilter] = useState('todos')

  // Dialogs: { product } para editar o crear (product null)
  const [productDialog, setProductDialog] = useState(null)
  const [stockDialog, setStockDialog] = useState(null)
  const [imageDialog, setImageDialog] = useState(null)
  const [togglingId, setTogglingId] = useState(null)

  const {
    data: assignedEstablishments = [],
    isLoading: establishmentsLoading,
  } = useAssignedEstablishmentsQuery()

  // Solo se gestiona el menú de establecimientos aprobados
  const establishments = useMemo(
    () =>
      assignedEstablishments.filter(
        (establishment) =>
          establishment.estadoEstablecimiento?.toUpperCase() ===
          'APROBADO'
      ),
    [assignedEstablishments]
  )

  const idEstablecimiento = establishments.some(
    (establishment) =>
      establishment.idEstablecimiento ===
      Number(selectedEstablishmentId)
  )
    ? Number(selectedEstablishmentId)
    : establishments[0]?.idEstablecimiento

  const {
    data: products = [],
    isLoading: productsLoading,
    isFetching: productsFetching,
    error: productsError,
    refetch: refetchProducts,
  } = useProductsQuery(idEstablecimiento)

  const { data: categories = [] } =
    useProductCategoriesQuery(idEstablecimiento)

  const {
    data: movements = [],
    isLoading: movementsLoading,
    error: movementsError,
  } = useStockMovementsQuery(
    idEstablecimiento,
    products,
    !productsLoading
  )

  const updateMutation = useUpdateProductMutation(idEstablecimiento)
  const deleteMutation = useDeleteProductMutation(idEstablecimiento)

  useEffect(() => {
    if (productsError) {
      toast.error(
        getErrorMessage(productsError, 'No se pudieron cargar los productos.')
      )
    }
  }, [productsError])

  useEffect(() => {
    if (movementsError) {
      toast.error(
        getErrorMessage(
          movementsError,
          'No se pudieron cargar los movimientos de stock.'
        )
      )
    }
  }, [movementsError])

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase()

    return products.filter((product) => {
      const matchesSearch =
        !term ||
        product.nombre?.toLowerCase().includes(term) ||
        product.descripcion?.toLowerCase().includes(term)

      const matchesCategory =
        !categoryFilter ||
        product.idCategoriaProducto === Number(categoryFilter)

      const matchesSummary =
        summaryFilter === 'todos' ||
        (summaryFilter === 'menu' && product.visibleMenu) ||
        (summaryFilter === 'ocultos' && !product.visibleMenu) ||
        (summaryFilter === 'sin' &&
          getStockStatus(product) === 'SIN_STOCK')

      return matchesSearch && matchesCategory && matchesSummary
    })
  }, [products, search, categoryFilter, summaryFilter])

  const handleToggleVisible = async (product) => {
    if (togglingId) return

    try {
      setTogglingId(product.idProducto)

      await updateMutation.mutateAsync({
        idEstablecimiento,
        idProducto: product.idProducto,
        productData: {
          idCategoriaProducto: product.idCategoriaProducto,
          nombre: product.nombre,
          descripcion: product.descripcion ?? '',
          precio: product.precio,
          controlaStock: product.controlaStock,
          visibleMenu: !product.visibleMenu,
        },
      })

      toast.success(
        product.visibleMenu
          ? `${product.nombre} se ocultó del menú.`
          : `${product.nombre} ahora se muestra en el menú.`
      )
    } catch (error) {
      toast.error(
        getErrorMessage(error, 'No se pudo actualizar el producto.')
      )
    } finally {
      setTogglingId(null)
    }
  }

  const handleDeleteProduct = (product) => {
    if (deleteMutation.isPending) return

    toast(`¿Querés eliminar ${product.nombre}?`, {
      description: 'El producto dejará de mostrarse en el menú.',
      action: {
        label: 'Eliminar',
        onClick: async () => {
          try {
            await deleteMutation.mutateAsync({
              idEstablecimiento,
              idProducto: product.idProducto,
            })

            toast.success('Producto eliminado correctamente.')
          } catch (error) {
            toast.error(
              getErrorMessage(error, 'No se pudo eliminar el producto.')
            )
          }
        },
      },
      cancel: {
        label: 'Cancelar',
        onClick: () => {},
      },
    })
  }

  if (establishmentsLoading) {
    return <Loader size={160} />
  }

  if (!idEstablecimiento) {
    return (
      <section>
        <DashboardPageHeader
          eyebrow="Gestión"
          title="Menú y stock"
          description="Administrá los productos y el stock de tu establecimiento."
        />

        <div className="mt-8 rounded-3xl border border-mesa-border bg-mesa-surface p-8 text-center text-mesa-muted">
          No tenés un establecimiento aprobado para gestionar.
        </div>
      </section>
    )
  }

  return (
    <section>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <DashboardPageHeader
            eyebrow="Gestión"
            title="Menú y stock"
            description="Cada producto se carga una sola vez: su stock suma unidades y sus movimientos quedan registrados."
          />
        </div>

          <div className="flex flex-wrap items-center gap-3 lg:shrink-0">
            <DashboardRefreshButton
              onClick={() => refetchProducts()}
              loading={productsFetching}
              tooltip="Recargar productos"
            />

            <DefaultButton
              variant="secondary"
              onClick={() => setStockDialog({ product: null })}
              sx={{ ...headerButtonSx, ...ghostButtonSx }}
            >
              <span className="flex items-center gap-2">
                <SwapVertIcon sx={{ fontSize: 16 }} />
                Registrar movimiento
              </span>
            </DefaultButton>

            <DefaultButton
              onClick={() => setProductDialog({ product: null })}
              sx={headerButtonSx}
            >
              <span className="flex items-center gap-2">
                <AddIcon sx={{ fontSize: 16 }} />
                Nuevo producto
              </span>
            </DefaultButton>
          </div>
      </div>

      {establishments.length > 1 && (
        <div className="mt-6 max-w-sm">
          <TextField
            select
            label="Establecimiento"
            value={idEstablecimiento}
            onChange={(event) =>
              setSelectedEstablishmentId(event.target.value)
            }
            fullWidth
            sx={textFieldStyles}
            slotProps={selectSlotProps}
          >
            {establishments.map((establishment) => (
              <MenuItem
                key={establishment.idEstablecimiento}
                value={establishment.idEstablecimiento}
              >
                {establishment.nombre}
              </MenuItem>
            ))}
          </TextField>
        </div>
      )}

      <div className="mt-8">
        <MenuStockSummary
          products={products}
          filter={summaryFilter}
          onFilterChange={setSummaryFilter}
        />
      </div>

      <div
        role="tablist"
        aria-label="Vista de productos"
        className="mt-8 inline-flex gap-1 rounded-xl border border-mesa-border bg-mesa-surface p-1"
      >
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              activeTab === tab.key
                ? 'bg-mesa-primary/15 text-mesa-primary'
                : 'text-mesa-muted hover:text-mesa-text'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-6 min-w-0">
        {activeTab === 'productos' ? (
          <>
            <div className="mb-5 flex flex-wrap gap-4">
              <label className="flex min-w-[240px] flex-1 items-center gap-3 rounded-2xl border border-mesa-border bg-mesa-surface px-5 py-3 text-slate-500">
                <SearchIcon sx={{ fontSize: 22 }} />
                <input
                  type="text"
                  placeholder="Buscar"
                  aria-label="Buscar producto"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="w-full bg-transparent text-base text-white outline-none placeholder:text-slate-500"
                />
              </label>

              <select
                aria-label="Filtrar por categoría"
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
                className="cursor-pointer rounded-2xl border border-mesa-border bg-mesa-surface px-5 py-3 text-base text-white outline-none"
              >
                <option value="">Todas las categorías</option>

                {categories.map((category) => (
                  <option
                    key={category.idCategoriaProducto}
                    value={category.idCategoriaProducto}
                  >
                    {category.nombre}
                  </option>
                ))}
              </select>
            </div>

            <ProductsTable
              products={filteredProducts}
              loading={productsLoading}
              togglingId={togglingId}
              onToggleVisible={handleToggleVisible}
              onAdjustStock={(product) => setStockDialog({ product })}
              onEditProduct={(product) => setProductDialog({ product })}
              onDeleteProduct={handleDeleteProduct}
              onViewImage={(product) => setImageDialog({ product })}
            />
          </>
        ) : (
          <div className="rounded-3xl border border-mesa-border bg-mesa-surface p-3 sm:p-6">
            <StockMovementsTable
              movements={movements}
              loading={movementsLoading}
            />
          </div>
        )}
      </div>
      {productDialog && (
        <ProductFormDialog
          key={productDialog.product?.idProducto ?? 'new'}
          open
          idEstablecimiento={idEstablecimiento}
          product={productDialog.product}
          onClose={() => setProductDialog(null)}
        />
      )}

      {imageDialog && (
        <ProductImageDialog
          key={imageDialog.product.idProducto}
          idEstablecimiento={idEstablecimiento}
          product={imageDialog.product}
          onClose={() => setImageDialog(null)}
        />
      )}

      {stockDialog && (
        <StockMovementDialog
          key={stockDialog.product?.idProducto ?? 'new'}
          open
          idEstablecimiento={idEstablecimiento}
          products={products}
          initialProduct={stockDialog.product}
          onClose={() => setStockDialog(null)}
        />
      )}
    </section>
  )
}

export default MenuStock