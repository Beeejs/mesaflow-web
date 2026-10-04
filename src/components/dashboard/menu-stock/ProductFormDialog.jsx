import { useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'

/* MUI */
import MenuItem from '@mui/material/MenuItem'
import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'

/* MUI Icons */
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'

/* Utils */
import { getProductImage } from '../../../utils/productUtils'

/* Components */
import DashboardFormDialog from '../DashboardFormDialog'
import DefaultButton from '../../common/button/DefaultButton'

/* Hooks */
import useProductCategoriesQuery from '../../../hooks/queries/useProductCategoriesQuery'
import useCreateProductMutation from '../../../hooks/mutations/useCreateProductMutation'
import useUpdateProductMutation from '../../../hooks/mutations/useUpdateProductMutation'
import useCreateProductCategoryMutation from '../../../hooks/mutations/useCreateProductCategoryMutation'

/* Utils */
/* Styles */
import {
  textFieldStyles,
  selectSlotProps,
} from '../../../styles/formStyles'

const switchStyles = {
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: '#FFFFFF',
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: '#22C55E',
    opacity: 1,
  },
}

const MAX_IMAGE_SIZE = 2 * 1024 * 1024
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

const getErrorMessage = (error, fallback) =>
  error.response?.data?.message || error.message || fallback

const ProductFormDialog = ({
  open,
  idEstablecimiento,
  product = null,
  onClose,
}) => {
  const isEditing = Boolean(product)

  const [formData, setFormData] = useState({
    idCategoriaProducto: product?.idCategoriaProducto ?? '',
    nombre: product?.nombre ?? '',
    descripcion: product?.descripcion ?? '',
    precio: product?.precio ?? '',
    controlaStock: product?.controlaStock ?? false,
    visibleMenu: product?.visibleMenu ?? true,
  })

  // Los campos de stock se muestran pero aún no se envían al backend
  const [stockData, setStockData] = useState({
    stockInicial: '0',
    stockMinimo: '5',
  })
  const [imageFile, setImageFile] = useState(null)
  const imageInputRef = useRef(null)

  const imagePreview = useMemo(
    () => (imageFile ? URL.createObjectURL(imageFile) : null),
    [imageFile]
  )

  useEffect(
    () => () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview)
    },
    [imagePreview]
  )

  const [newCategoryName, setNewCategoryName] = useState('')
  const [isCreatingCategory, setIsCreatingCategory] = useState(false)

  const {
    data: categories = [],
    isLoading: categoriesLoading,
  } = useProductCategoriesQuery(idEstablecimiento)

  const createMutation = useCreateProductMutation(idEstablecimiento)
  const updateMutation = useUpdateProductMutation(idEstablecimiento)
  const createCategoryMutation =
    useCreateProductCategoryMutation(idEstablecimiento)

  const isSaving =
    createMutation.isPending || updateMutation.isPending

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleStockChange = (event) => {
    const { name, value } = event.target

    setStockData((current) => ({ ...current, [name]: value }))
  }

  const handleImageChange = (event) => {
    const selected = event.target.files?.[0]

    event.target.value = ''

    if (!selected) return

    if (!ACCEPTED_TYPES.includes(selected.type)) {
      toast.error('Elegí una imagen JPG, PNG o WEBP.')
      return
    }

    if (selected.size > MAX_IMAGE_SIZE) {
      toast.error('La imagen no puede superar los 2 MB.')
      return
    }

    setImageFile(selected)
  }

  const handleSwitchChange = (event) => {
    const { name, checked } = event.target

    setFormData((current) => ({ ...current, [name]: checked }))
  }

  // Evitamos valores fuera de rango mientras cargan las categorías
  const selectedCategory = categories.some(
    (category) =>
      category.idCategoriaProducto ===
      Number(formData.idCategoriaProducto)
  )
    ? formData.idCategoriaProducto
    : ''

  const selectedCategoryName = categories.find(
    (category) =>
      category.idCategoriaProducto === Number(selectedCategory)
  )?.nombre ?? product?.categoria

  const handleCreateCategory = async () => {
    const nombre = newCategoryName.trim()

    if (!nombre || createCategoryMutation.isPending) return

    try {
      const category = await createCategoryMutation.mutateAsync({
        idEstablecimiento,
        categoryData: { nombre },
      })

      setFormData((current) => ({
        ...current,
        idCategoriaProducto: category.idCategoriaProducto,
      }))
      setNewCategoryName('')
      setIsCreatingCategory(false)
      toast.success('Categoría creada correctamente.')
    } catch (error) {
      toast.error(
        getErrorMessage(error, 'No se pudo crear la categoría.')
      )
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (isSaving) return

    const price = Number(formData.precio)

    if (
      !formData.nombre.trim() ||
      !selectedCategory ||
      formData.precio === '' ||
      Number.isNaN(price) ||
      price < 0
    ) {
      toast.error('Completá los campos obligatorios.')
      return
    }

    const productData = {
      idCategoriaProducto: Number(selectedCategory),
      nombre: formData.nombre.trim(),
      descripcion: formData.descripcion.trim(),
      precio: price,
      controlaStock: formData.controlaStock,
      visibleMenu: formData.visibleMenu,
    }

    try {
      if (isEditing) {
        await updateMutation.mutateAsync({
          idEstablecimiento,
          idProducto: product.idProducto,
          productData,
          image: imageFile,
        })
        toast.success('Producto actualizado correctamente.')
      } else {
        await createMutation.mutateAsync({
          idEstablecimiento,
          productData,
          image: imageFile,
        })
        toast.success('Producto creado correctamente.')
      }

      onClose()
    } catch (error) {
      toast.error(
        getErrorMessage(error, 'No se pudo guardar el producto.')
      )
    }
  }

  return (
    <DashboardFormDialog
      open={open}
      title={isEditing ? 'Editar producto' : 'Nuevo producto'}
      description="Completá los datos del producto que se muestra en el menú."
      onClose={onClose}
      onSubmit={handleSubmit}
      isBusy={isSaving}
      submitDisabled={categoriesLoading}
      submitLabel={isEditing ? 'Guardar cambios' : 'Crear producto'}
    >
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div
          style={{
            width: 160,
            height: 160,
            border: '3px solid #056EF8',
          }}
          className="flex shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-mesa-bg text-slate-500"
        >
          <img
            src={
              imagePreview ??
              getProductImage({
                imagenUrl: product?.imagenUrl,
                categoria: selectedCategoryName,
              })
            }
            alt="Imagen del producto"
            className="h-full w-full object-cover"
          />
        </div>

        <div>
          <div className="flex flex-wrap gap-3">
            <DefaultButton
              variant="secondary"
              onClick={() => imageInputRef.current?.click()}
              disabled={isSaving}
            >
              <span className="flex items-center gap-2">
                <ImageOutlinedIcon sx={{ fontSize: 20 }} />
                Subir foto
              </span>
            </DefaultButton>

            {imageFile && (
              <DefaultButton
                variant="secondary"
                onClick={() => setImageFile(null)}
                disabled={isSaving}
              >
                Quitar
              </DefaultButton>
            )}
          </div>

          <p className="mt-3 text-xs text-slate-500">
            JPG, PNG o WEBP de hasta 2 MB. Si no subís una, se usa una genérica.
          </p>

          <input
            ref={imageInputRef}
            type="file"
            accept={ACCEPTED_TYPES.join(',')}
            onChange={handleImageChange}
            className="hidden"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <TextField
            label="Nombre"
            name="nombre"
            placeholder="Ej: Hamburguesa doble"
            value={formData.nombre}
            onChange={handleChange}
            disabled={isSaving}
            fullWidth
            required
            sx={textFieldStyles}
          />
        </div>

        <div>
          <TextField
            select
            label="Categoría"
            name="idCategoriaProducto"
            value={selectedCategory}
            onChange={handleChange}
            disabled={categoriesLoading || isSaving}
            fullWidth
            required
            sx={textFieldStyles}
            slotProps={selectSlotProps}
            helperText={
              !categoriesLoading && categories.length === 0
                ? 'Todavía no hay categorías. Creá la primera.'
                : undefined
            }
          >
            {categories.map((category) => (
              <MenuItem
                key={category.idCategoriaProducto}
                value={category.idCategoriaProducto}
              >
                {category.nombre}
              </MenuItem>
            ))}
          </TextField>

          {isCreatingCategory ? (
            <div className="mt-3 flex gap-2">
              <TextField
                label="Nueva categoría"
                value={newCategoryName}
                onChange={(event) =>
                  setNewCategoryName(event.target.value)
                }
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault()
                    handleCreateCategory()
                  }
                }}
                disabled={createCategoryMutation.isPending}
                fullWidth
                size="small"
                sx={textFieldStyles}
              />

              <DefaultButton
                variant="secondary"
                onClick={handleCreateCategory}
                disabled={
                  !newCategoryName.trim() ||
                  createCategoryMutation.isPending
                }
                sx={{ whiteSpace: 'nowrap' }}
              >
                Crear
              </DefaultButton>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsCreatingCategory(true)}
              disabled={isSaving}
              className="mt-3 cursor-pointer text-sm font-semibold text-mesa-cyan hover:text-mesa-cyan-light"
            >
              + Nueva categoría
            </button>
          )}
        </div>

        <TextField
          label="Precio ($)"
          name="precio"
          type="number"
          placeholder="0"
          value={formData.precio}
          onChange={handleChange}
          disabled={isSaving}
          fullWidth
          required
          sx={textFieldStyles}
          slotProps={{ htmlInput: { min: 0, step: '0.01' } }}
        />

        <div className="sm:col-span-2">
          <TextField
            label="Descripción"
            name="descripcion"
            placeholder="Ingredientes o presentación"
            value={formData.descripcion}
            onChange={handleChange}
            disabled={isSaving}
            fullWidth
            multiline
            minRows={3}
            sx={textFieldStyles}
          />
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4 border-t border-mesa-border pt-5">
        <div>
          <p className="font-semibold text-white">Controlar stock</p>
          <p className="mt-1 text-sm text-slate-500">
            Llevá la cantidad disponible y el historial de movimientos.
          </p>
        </div>

        <Switch
          name="controlaStock"
          checked={formData.controlaStock}
          onChange={handleSwitchChange}
          disabled={isSaving}
          sx={switchStyles}
          inputProps={{ 'aria-label': 'Controlar stock' }}
        />
      </div>

      {formData.controlaStock && (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <TextField
            label="Stock inicial"
            name="stockInicial"
            type="number"
            value={stockData.stockInicial}
            onChange={handleStockChange}
            disabled={isSaving || isEditing}
            fullWidth
            sx={textFieldStyles}
            slotProps={{ htmlInput: { min: 0, step: 1 } }}
          />

          <TextField
            label="Avisar con stock bajo en"
            name="stockMinimo"
            type="number"
            value={stockData.stockMinimo}
            onChange={handleStockChange}
            disabled={isSaving}
            fullWidth
            sx={textFieldStyles}
            slotProps={{ htmlInput: { min: 0, step: 1 } }}
          />
        </div>
      )}

      <div className="mt-6 flex items-center justify-between gap-4 border-t border-mesa-border pt-5">
        <div>
          <p className="font-semibold text-white">Visible en el menú</p>
          <p className="mt-1 text-sm text-slate-500">
            Las mesas lo ven al escanear el QR. Si no hay stock, figura como agotado.
          </p>
        </div>

        <Switch
          name="visibleMenu"
          checked={formData.visibleMenu}
          onChange={handleSwitchChange}
          disabled={isSaving}
          sx={switchStyles}
          inputProps={{ 'aria-label': 'Visible en el menú' }}
        />
      </div>    </DashboardFormDialog>
  )
}

export default ProductFormDialog