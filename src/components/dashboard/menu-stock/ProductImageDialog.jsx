import { useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'

/* MUI */
import Dialog from '@mui/material/Dialog'
import CloseIcon from '@mui/icons-material/Close'

/* Components */
import DefaultButton from '../../common/button/DefaultButton'

/* Hooks */
import useUpdateProductMutation from '../../../hooks/mutations/useUpdateProductMutation'

/* Utils */
import { getProductImage } from '../../../utils/productUtils'

const MAX_IMAGE_SIZE = 2 * 1024 * 1024
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

const ProductImageDialog = ({ idEstablecimiento, product, onClose }) => {
  const inputRef = useRef(null)
  const [file, setFile] = useState(null)

  const updateMutation = useUpdateProductMutation(idEstablecimiento)
  const isSaving = updateMutation.isPending

  const preview = useMemo(
    () => (file ? URL.createObjectURL(file) : null),
    [file]
  )

  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview)
    },
    [preview]
  )

  const handleFileChange = (event) => {
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

    setFile(selected)
  }

  const handleSave = async () => {
    if (!file || isSaving) return

    try {
      await updateMutation.mutateAsync({
        idEstablecimiento,
        idProducto: product.idProducto,
        productData: {
          idCategoriaProducto: product.idCategoriaProducto,
          nombre: product.nombre,
          descripcion: product.descripcion ?? '',
          precio: product.precio,
          controlaStock: product.controlaStock,
          visibleMenu: product.visibleMenu,
        },
        image: file,
      })

      toast.success('Imagen actualizada correctamente.')
      onClose()
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          'No se pudo actualizar la imagen.'
      )
    }
  }

  const handleClose = () => {
    if (!isSaving) onClose()
  }

  return (
    <Dialog
      open
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      slotProps={{
        paper: {
          sx: {
            borderRadius: '24px',
            border: '1px solid #1F2937',
            backgroundColor: '#0B111C',
            color: '#F8FAFC',
            overflow: 'hidden',
          },
        },
        backdrop: {
          sx: {
            backgroundColor: 'rgba(3, 7, 15, 0.78)',
            backdropFilter: 'blur(3px)',
          },
        },
      }}
    >
      <div className="flex items-center justify-between px-6 pt-5">
        <h2 className="font-display text-lg font-bold">{product.nombre}</h2>

        <button
          type="button"
          onClick={handleClose}
          aria-label="Cerrar"
          className="cursor-pointer rounded-lg p-1 text-slate-400 hover:text-white"
        >
          <CloseIcon />
        </button>
      </div>

      <div className="p-6">
        <img
          src={preview ?? getProductImage(product)}
          alt={product.nombre}
          className="aspect-[4/3] w-full rounded-2xl object-cover"
        />

        {file && (
          <p className="mt-3 text-sm text-slate-400">
            Nueva imagen: {file.name}
          </p>
        )}

        <p className="mt-3 text-xs text-slate-500">
          JPG, PNG o WEBP, hasta 2 MB. Recomendado en formato 4:3.
        </p>

        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(',')}
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="mt-5 flex justify-end gap-3">
          <DefaultButton
            variant="secondary"
            onClick={() => inputRef.current?.click()}
            disabled={isSaving}
          >
            {file ? 'Elegir otra' : 'Cambiar imagen'}
          </DefaultButton>

          {file && (
            <DefaultButton onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Guardando...' : 'Guardar imagen'}
            </DefaultButton>
          )}
        </div>
      </div>
    </Dialog>
  )
}

export default ProductImageDialog