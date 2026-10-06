import {
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useParams } from 'react-router'
import { toast } from 'sonner'

/* MUI */
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'

/* Components */
import DefaultButton from '../../../../components/common/button/DefaultButton'
import MenuStockSummary from '../../../../components/dashboard/user/menuStock/MenuStockSummary'
import ProductsTable from '../../../../components/dashboard/user/menuStock/ProductsTable'
import ProductFormDialog from '../../../../components/dashboard/user/menuStock/ProductFormDialog'
import ProductImageDialog from '../../../../components/dashboard/user/menuStock/ProductImageDialog'
import StockMovementDialog from '../../../../components/dashboard/user/menuStock/StockMovementDialog'
import StockMovementsTable from '../../../../components/dashboard/user/menuStock/StockMovementsTable'

/* Hooks */
import useProductsQuery from '../../../../hooks/queries/useProductsQuery'
import useProductCategoriesQuery from '../../../../hooks/queries/useProductCategoriesQuery'
import useStockMovementsQuery from '../../../../hooks/queries/useStockMovementsQuery'
import useUpdateProductMutation from '../../../../hooks/mutations/useUpdateProductMutation'
import useDeleteProductMutation from '../../../../hooks/mutations/useDeleteProductMutation'

/* Utils */
import { getStockStatus } from '../../../../utils/productUtils'

/* Styles */
import {
  selectSlotProps,
  textFieldStyles,
} from '../../../../styles/formStyles'

const getErrorMessage = (
  error,
  fallback
) =>
  error?.response?.data?.message ||
  error?.message ||
  fallback

const MenuStock = () => {
  // Hooks
  const { idEstablecimiento } =
    useParams()

  const [summaryFilter, setSummaryFilter] =
    useState('todos')

  const [categoryFilter, setCategoryFilter] =
    useState('')

  const [productForm, setProductForm] =
    useState(null)

  const [imageProduct, setImageProduct] =
    useState(null)

  const [stockProduct, setStockProduct] =
    useState(null)

  const [
    stockMovementOpen,
    setStockMovementOpen,
  ] = useState(false)

  const [togglingId, setTogglingId] =
    useState(null)

  const {
    data: products = [],
    isLoading: productsLoading,
    error: productsError,
    refetch: refetchProducts,
  } = useProductsQuery(idEstablecimiento)

  const {
    data: categories = [],
    error: categoriesError,
    refetch: refetchCategories,
  } = useProductCategoriesQuery(
    idEstablecimiento
  )

  const {
    data: movements = [],
    isLoading: movementsLoading,
    error: movementsError,
    refetch: refetchMovements,
  } = useStockMovementsQuery(
    idEstablecimiento,
    products,
    !productsLoading
  )

  const updateMutation =
    useUpdateProductMutation(
      idEstablecimiento
    )

  const deleteMutation =
    useDeleteProductMutation(
      idEstablecimiento
    )

  // Constantes derivadas
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        !categoryFilter ||
        product.idCategoriaProducto ===
          Number(categoryFilter)

      const matchesSummary =
        summaryFilter === 'todos' ||
        (
          summaryFilter === 'menu' &&
          product.visibleMenu
        ) ||
        (
          summaryFilter === 'ocultos' &&
          !product.visibleMenu
        ) ||
        (
          summaryFilter === 'sin' &&
          getStockStatus(product) ===
            'SIN_STOCK'
        )

      return (
        matchesCategory &&
        matchesSummary
      )
    })
  }, [
    products,
    categoryFilter,
    summaryFilter,
  ])

  const isRefreshing =
    productsLoading ||
    movementsLoading

  // useEffect
  useEffect(() => {
    if (!productsError) {
      return
    }

    toast.error(
      getErrorMessage(
        productsError,
        'No se pudieron cargar los productos.'
      )
    )
  }, [productsError])

  useEffect(() => {
    if (!categoriesError) {
      return
    }

    toast.error(
      getErrorMessage(
        categoriesError,
        'No se pudieron cargar las categorías.'
      )
    )
  }, [categoriesError])

  useEffect(() => {
    if (!movementsError) {
      return
    }

    toast.error(
      getErrorMessage(
        movementsError,
        'No se pudieron cargar los movimientos de stock.'
      )
    )
  }, [movementsError])

  // Funciones
  const handleNewProduct = () => {
    setProductForm({
      product: null,
    })
  }

  const handleEditProduct = (
    product
  ) => {
    setProductForm({
      product,
    })
  }

  const handleCloseProductForm = () => {
    setProductForm(null)
  }

  const handleViewImage = (
    product
  ) => {
    setImageProduct(product)
  }

  const handleCloseImage = () => {
    setImageProduct(null)
  }

  const handleOpenStockMovement = (
    product = null
  ) => {
    setStockProduct(product)
    setStockMovementOpen(true)
  }

  const handleCloseStockMovement =
    () => {
      setStockMovementOpen(false)
      setStockProduct(null)
    }

  const handleToggleVisible = async (
    product
  ) => {
    if (
      togglingId ||
      (
        product.controlaStock &&
        !product.stockInicializado
      )
    ) {
      return
    }

    try {
      setTogglingId(
        product.idProducto
      )

      await updateMutation.mutateAsync({
        idEstablecimiento,
        idProducto:
          product.idProducto,
        productData: {
          idCategoriaProducto:
            product.idCategoriaProducto,
          nombre: product.nombre,
          descripcion:
            product.descripcion ?? '',
          precio: product.precio,
          controlaStock:
            product.controlaStock,
          visibleMenu:
            !product.visibleMenu,
        },
      })
    } catch (error) {
      toast.error(
        getErrorMessage(
          error,
          'No se pudo actualizar la visibilidad del producto.'
        )
      )
    } finally {
      setTogglingId(null)
    }
  }

  const handleDeleteProduct = (product) => {
    toast(`¿Querés eliminar "${product.nombre}"?`, {
      description: 'Esta acción dará de baja el producto.',
      action: {
        label: 'Eliminar',
        onClick: async () => {
          try {
            await deleteMutation.mutateAsync({
              idEstablecimiento,
              idProducto: product.idProducto,
            })

            toast.success(
              'Producto eliminado correctamente.'
            )
          } catch (error) {
            toast.error(
              getErrorMessage(
                error,
                'No se pudo eliminar el producto.'
              )
            )
          }
        },
      },
      cancel: {
        label: 'Cancelar',
      },
    })
  }

  const handleRefresh = async () => {
    await Promise.all([
      refetchProducts(),
      refetchCategories(),
      refetchMovements(),
    ])
  }

  // Renderizado
  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-mesa-cyan-light">
            Operación
          </p>

          <h1 className="font-display text-3xl font-bold text-mesa-text">
            Menú y stock
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-mesa-muted">
            Administrá los productos,
            su disponibilidad y los
            movimientos de stock del
            establecimiento.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <DefaultButton
            variant="secondary"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            Actualizar
          </DefaultButton>

          <DefaultButton
            variant="secondary"
            onClick={() =>
              handleOpenStockMovement()
            }
          >
            Registrar movimiento
          </DefaultButton>

          <DefaultButton
            onClick={handleNewProduct}
          >
            Nuevo producto
          </DefaultButton>
        </div>
      </section>

      <MenuStockSummary
        products={products}
        filter={summaryFilter}
        onFilterChange={
          setSummaryFilter
        }
      />

      <section className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-xl font-bold text-mesa-text">
              Productos
            </h2>

            <p className="mt-1 text-sm text-mesa-muted">
              Gestioná precio,
              categoría, visibilidad y
              stock.
            </p>
          </div>

          <div className="w-full sm:w-64">
            <TextField
              select
              label="Categoría"
              value={categoryFilter}
              onChange={(event) =>
                setCategoryFilter(
                  event.target.value
                )
              }
              fullWidth
              sx={textFieldStyles}
              slotProps={
                selectSlotProps
              }
            >
              <MenuItem value="">
                Todas las categorías
              </MenuItem>

              {categories.map(
                (category) => (
                  <MenuItem
                    key={
                      category.idCategoriaProducto
                    }
                    value={
                      category.idCategoriaProducto
                    }
                  >
                    {category.nombre}
                  </MenuItem>
                )
              )}
            </TextField>
          </div>
        </div>

        <ProductsTable
          products={
            filteredProducts
          }
          loading={
            productsLoading
          }
          togglingId={togglingId}
          onToggleVisible={
            handleToggleVisible
          }
          onAdjustStock={
            handleOpenStockMovement
          }
          onEditProduct={
            handleEditProduct
          }
          onDeleteProduct={
            handleDeleteProduct
          }
          onViewImage={
            handleViewImage
          }
        />
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="font-display text-xl font-bold text-mesa-text">
            Historial de stock
          </h2>

          <p className="mt-1 text-sm text-mesa-muted">
            Consultá los ingresos,
            egresos, ajustes, ventas y
            movimientos iniciales.
          </p>
        </div>

        <StockMovementsTable
          movements={movements}
          loading={
            movementsLoading
          }
        />
      </section>

      {productForm && (
        <ProductFormDialog
          open
          idEstablecimiento={
            idEstablecimiento
          }
          categories={categories}
          product={
            productForm.product
          }
          onClose={
            handleCloseProductForm
          }
        />
      )}

      {imageProduct && (
        <ProductImageDialog
          idEstablecimiento={
            idEstablecimiento
          }
          product={imageProduct}
          onClose={
            handleCloseImage
          }
        />
      )}

      {stockMovementOpen && (
        <StockMovementDialog
          open
          idEstablecimiento={
            idEstablecimiento
          }
          products={products}
          initialProduct={
            stockProduct
          }
          onClose={
            handleCloseStockMovement
          }
        />
      )}
    </div>
  )
}

export default MenuStock