import {
  useMemo,
  useRef,
  useState,
  useEffect
} from 'react'
import { toast } from 'sonner'

/* MUI */
import FormControlLabel from '@mui/material/FormControlLabel'
import MenuItem from '@mui/material/MenuItem'
import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'

/* MUI Icons */
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'

/* Components */
import DashboardFormDialog from '../../DashboardFormDialog'
import DefaultButton from '../../../common/button/DefaultButton'

/* Hooks */
import useCreateProductMutation from '../../../../hooks/mutations/useCreateProductMutation'
import useUpdateProductMutation from '../../../../hooks/mutations/useUpdateProductMutation'
import useCreateProductCategoryMutation from '../../../../hooks/mutations/useCreateProductCategoryMutation'

/* Styles */
import {
  selectSlotProps,
  textFieldStyles,
} from '../../../../styles/formStyles'

const MAX_IMAGE_SIZE = 2 * 1024 * 1024

const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
]

const ProductFormDialog = ({
  open,
  idEstablecimiento,
  categories = [],
  product = null,
  onClose,
}) => {
  // Hooks
  const imageInputRef = useRef(null)

  const [formData, setFormData] = useState({
    nombre: product?.nombre ?? '',
    descripcion: product?.descripcion ?? '',
    precio: product?.precio ?? '',
    idCategoriaProducto:
      product?.idCategoriaProducto ?? '',
    controlaStock: product?.controlaStock ?? false,
    visibleMenu: product?.visibleMenu ?? true,
  })

  const [stockData, setStockData] = useState({
    stockInicial: '0',
  })

  const [imageFile, setImageFile] = useState(null)
  const [newCategoryName, setNewCategoryName] = useState('')

  const createMutation =
    useCreateProductMutation(idEstablecimiento)

  const updateMutation =
    useUpdateProductMutation(idEstablecimiento)

  const createCategoryMutation =
    useCreateProductCategoryMutation(idEstablecimiento)

  // Constantes derivadas
  const isEditing = Boolean(product)

  const isSaving =
    createMutation.isPending ||
    updateMutation.isPending

  const imagePreview = useMemo(
    () =>
      imageFile
        ? URL.createObjectURL(imageFile)
        : null,
    [imageFile]
  )

  const needsInitialStock =
    formData.controlaStock &&
    !product?.stockInicializado

  // useEffect
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview)
      }
    }
  }, [imagePreview])


  // Funciones
  const handleChange = (event) => {
    const {
      name,
      value,
      checked,
      type,
    } = event.target

    setFormData((current) => ({
      ...current,
      [name]:
        type === 'checkbox'
          ? checked
          : value,
    }))
  }

  const handleStockChange = (event) => {
    const { name, value } = event.target

    setStockData((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleImageChange = (event) => {
    const selectedFile = event.target.files?.[0]

    event.target.value = ''

    if (!selectedFile) {
      return
    }

    if (
      !ACCEPTED_IMAGE_TYPES.includes(
        selectedFile.type
      )
    ) {
      toast.error(
        'Elegí una imagen JPG, PNG o WEBP.'
      )
      return
    }

    if (selectedFile.size > MAX_IMAGE_SIZE) {
      toast.error(
        'La imagen no puede superar los 2 MB.'
      )
      return
    }

    setImageFile(selectedFile)
  }

  const handleCreateCategory = async () => {
    const nombre = newCategoryName.trim()

    if (!nombre) {
      toast.error(
        'Ingresá un nombre para la categoría.'
      )
      return
    }

    try {
      const createdCategory =
        await createCategoryMutation.mutateAsync({
          idEstablecimiento,
          categoryData: {
            nombre,
          },
        })

      if (createdCategory?.idCategoriaProducto) {
        setFormData((current) => ({
          ...current,
          idCategoriaProducto:
            createdCategory.idCategoriaProducto,
        }))
      }

      setNewCategoryName('')

      toast.success(
        'Categoría creada correctamente.'
      )
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          'No se pudo crear la categoría.'
      )
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const name = formData.nombre.trim()
    const price = Number(formData.precio)

    if (
      !name ||
      !formData.idCategoriaProducto ||
      !formData.precio
    ) {
      toast.error(
        'Completá los campos obligatorios.'
      )
      return
    }

    if (
      Number.isNaN(price) ||
      price <= 0
    ) {
      toast.error(
        'El precio debe ser mayor a cero.'
      )
      return
    }

    const initialStock = Number(
      stockData.stockInicial
    )

    if (
      needsInitialStock &&
      (
        !Number.isInteger(initialStock) ||
        initialStock < 0
      )
    ) {
      toast.error(
        'El stock inicial debe ser un número entero igual o mayor a cero.'
      )
      return
    }

    const productData = {
      idCategoriaProducto: Number(
        formData.idCategoriaProducto
      ),
      nombre: name,
      descripcion:
        formData.descripcion.trim(),
      precio: price,
      controlaStock:
        formData.controlaStock,
      visibleMenu:
        formData.visibleMenu,
      ...(needsInitialStock && {
        stockInicial: initialStock,
      }),
    }

    try {
      if (isEditing) {
        await updateMutation.mutateAsync({
          idEstablecimiento,
          idProducto: product.idProducto,
          productData,
          image: imageFile,
        })

        toast.success(
          'Producto actualizado correctamente.'
        )
      } else {
        await createMutation.mutateAsync({
          idEstablecimiento,
          productData,
          image: imageFile,
        })

        toast.success(
          'Producto creado correctamente.'
        )
      }

      onClose()
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          'No se pudo guardar el producto.'
      )
    }
  }

  // Renderizado
  return (
    <DashboardFormDialog
      open={open}
      title={
        isEditing
          ? 'Editar producto'
          : 'Nuevo producto'
      }
      description={
        isEditing
          ? 'Modificá la información del producto.'
          : 'Cargá un nuevo producto al menú del establecimiento.'
      }
      onClose={onClose}
      onSubmit={handleSubmit}
      isBusy={isSaving}
      submitLabel={
        isEditing
          ? 'Guardar cambios'
          : 'Crear producto'
      }
      busyLabel="Guardando..."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex h-32 w-full shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-mesa-card text-mesa-muted sm:w-40">
              {imagePreview || product?.imagenUrl ? (
                <img
                  src={
                    imagePreview ??
                    product.imagenUrl
                  }
                  alt="Imagen del producto"
                  className="h-full w-full object-cover"
                />
              ) : (
                <ImageOutlinedIcon
                  sx={{
                    fontSize: 48,
                  }}
                />
              )}
            </div>

            <div className="flex flex-1 flex-col justify-center">
              <div className="flex flex-wrap gap-3">
                <DefaultButton
                  variant="secondary"
                  onClick={() =>
                    imageInputRef.current?.click()
                  }
                  disabled={isSaving}
                >
                  {imageFile
                    ? 'Elegir otra imagen'
                    : 'Elegir imagen'}
                </DefaultButton>

                {imageFile && (
                  <DefaultButton
                    variant="secondary"
                    onClick={() =>
                      setImageFile(null)
                    }
                    disabled={isSaving}
                  >
                    Descartar foto nueva
                  </DefaultButton>
                )}
              </div>

              <p className="mt-3 text-xs text-mesa-muted">
                JPG, PNG o WEBP de hasta 2 MB.
                {product?.imagenUrl &&
                !imageFile
                  ? ' Podés reemplazar la foto actual.'
                  : ' Si no subís una, el producto queda sin foto propia.'}
              </p>

              <input
                ref={imageInputRef}
                type="file"
                accept={ACCEPTED_IMAGE_TYPES.join(
                  ','
                )}
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>
        </div>

        <TextField
          label="Nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          disabled={isSaving}
          fullWidth
          required
          sx={textFieldStyles}
        />

        <TextField
          label="Precio"
          name="precio"
          type="number"
          value={formData.precio}
          onChange={handleChange}
          disabled={isSaving}
          fullWidth
          required
          sx={textFieldStyles}
          slotProps={{
            htmlInput: {
              min: 0,
              step: 0.01,
            },
          }}
        />

        <div className="sm:col-span-2">
          <TextField
            label="Descripción"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            disabled={isSaving}
            fullWidth
            multiline
            minRows={3}
            sx={textFieldStyles}
          />
        </div>

        <TextField
          select
          label="Categoría"
          name="idCategoriaProducto"
          value={
            formData.idCategoriaProducto
          }
          onChange={handleChange}
          disabled={isSaving}
          fullWidth
          required
          sx={textFieldStyles}
          slotProps={selectSlotProps}
        >
          {categories.map((category) => (
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
          ))}
        </TextField>

        <div className="flex gap-2">
          <TextField
            label="Nueva categoría"
            value={newCategoryName}
            onChange={(event) =>
              setNewCategoryName(
                event.target.value
              )
            }
            disabled={
              isSaving ||
              createCategoryMutation.isPending
            }
            fullWidth
            sx={textFieldStyles}
          />

          <DefaultButton
            variant="secondary"
            onClick={handleCreateCategory}
            disabled={
              isSaving ||
              createCategoryMutation.isPending
            }
          >
            Agregar
          </DefaultButton>
        </div>

        <div className="sm:col-span-2">
          <div className="flex flex-wrap gap-x-8 gap-y-2">
            <FormControlLabel
              control={
                <Switch
                  name="controlaStock"
                  checked={
                    formData.controlaStock
                  }
                  onChange={handleChange}
                  disabled={isSaving}
                />
              }
              label="Controlar stock"
              sx={{
                color: '#F8FAFC',
              }}
            />

            <FormControlLabel
              control={
                <Switch
                  name="visibleMenu"
                  checked={
                    formData.visibleMenu
                  }
                  onChange={handleChange}
                  disabled={
                    isSaving ||
                    (
                      formData.controlaStock &&
                      !product?.stockInicializado &&
                      isEditing
                    )
                  }
                />
              }
              label="Visible en el menú"
              sx={{
                color: '#F8FAFC',
              }}
            />
          </div>
        </div>
      </div>

      {needsInitialStock && (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <TextField
            label="Stock inicial"
            name="stockInicial"
            type="number"
            value={
              stockData.stockInicial
            }
            onChange={handleStockChange}
            disabled={isSaving}
            fullWidth
            sx={textFieldStyles}
            slotProps={{
              htmlInput: {
                min: 0,
                step: 1,
              },
            }}
          />
        </div>
      )}
    </DashboardFormDialog>
  )
}

export default ProductFormDialog