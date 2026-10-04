import { useState } from 'react'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'

/* MUI */
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'

/* Components */
import DashboardFormDialog from '../DashboardFormDialog'

/* API */
import {
  createStockMovement,
  STOCK_NOT_AVAILABLE_MESSAGE,
} from '../../../api/stockService'

/* API */
import { queryKeys } from '../../../api/queryClient'

/* Styles */
import {
  textFieldStyles,
  selectSlotProps,
} from '../../../styles/formStyles'

// INICIAL y VENTA los genera el sistema, por eso no se ofrecen acá
const movementTypes = [
  { value: 'INGRESO', label: 'Reingreso' },
  { value: 'EGRESO', label: 'Egreso' },
  { value: 'AJUSTE', label: 'Ajuste' },
]

// Motivos provisorios hasta que el backend publique los suyos
const defaultReasons = {
  INGRESO: ['Compra a proveedor', 'Devolución', 'Otro'],
  EGRESO: ['Merma', 'Consumo interno', 'Otro'],
  AJUSTE: ['Inventario', 'Corrección de carga', 'Otro'],
}

const StockMovementDialog = ({
  open,
  idEstablecimiento,
  products = [],
  initialProduct = null,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    idProducto: initialProduct?.idProducto ?? '',
    tipo: 'INGRESO',
    cantidad: '',
    motivo: defaultReasons.INGRESO[0],
    observacion: '',
  })

  const [isSaving, setIsSaving] = useState(false)
  const queryClient = useQueryClient()

  const stockProducts = products.filter(
    (product) => product.controlaStock
  )

  const selectedProduct = stockProducts.find(
    (product) => product.idProducto === Number(formData.idProducto)
  )

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleTypeChange = (tipo) => {
    setFormData((current) => ({
      ...current,
      tipo,
      motivo: defaultReasons[tipo][0],
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (isSaving) return

    if (
      !formData.idProducto ||
      !formData.cantidad ||
      Number(formData.cantidad) <= 0
    ) {
      toast.error('Completá los campos obligatorios.')
      return
    }

    try {
      setIsSaving(true)

      await createStockMovement({
        idEstablecimiento,
        idProducto: Number(formData.idProducto),
        tipo: formData.tipo,
        cantidad: Number(formData.cantidad),
        motivo: formData.motivo,
        observacion: formData.observacion.trim(),
      })

      queryClient.invalidateQueries({
        queryKey: queryKeys.products(idEstablecimiento),
      })
      queryClient.invalidateQueries({
        queryKey: queryKeys.stockMovements(idEstablecimiento),
      })
      toast.success('Movimiento registrado correctamente.')
      onClose()
    } catch (error) {
      toast.info(error.message || STOCK_NOT_AVAILABLE_MESSAGE)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <DashboardFormDialog
      open={open}
      title="Registrar movimiento"
      description="Cada movimiento queda en el historial con fecha, usuario y saldo."
      onClose={onClose}
      onSubmit={handleSubmit}
      isBusy={isSaving}
      submitLabel="Registrar"
      busyLabel="Registrando..."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <TextField
            select
            label="Producto"
            name="idProducto"
            value={formData.idProducto}
            onChange={handleChange}
            disabled={isSaving}
            fullWidth
            required
            sx={textFieldStyles}
            slotProps={selectSlotProps}
            helperText={
              stockProducts.length === 0
                ? 'No hay productos con control de stock.'
                : undefined
            }
          >
            {stockProducts.map((product) => (
              <MenuItem
                key={product.idProducto}
                value={product.idProducto}
              >
                {product.nombre}
                {typeof product.cantidadActual === 'number' &&
                  ` · ${product.cantidadActual} u.`}
              </MenuItem>
            ))}
          </TextField>
        </div>

        <div className="sm:col-span-2">
          <p className="mb-2 text-sm font-semibold text-slate-400">
            Tipo de movimiento
          </p>

          <div
            role="radiogroup"
            aria-label="Tipo de movimiento"
            className="grid grid-cols-3 gap-1 rounded-xl border border-mesa-border bg-mesa-bg p-1"
          >
            {movementTypes.map((type) => (
              <button
                key={type.value}
                type="button"
                role="radio"
                aria-checked={formData.tipo === type.value}
                disabled={isSaving}
                onClick={() => handleTypeChange(type.value)}
                className={`cursor-pointer rounded-lg py-2.5 text-sm font-semibold transition ${
                  formData.tipo === type.value
                    ? 'bg-mesa-primary/15 text-mesa-primary'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        <TextField
          label="Cantidad (u.)"
          name="cantidad"
          type="number"
          value={formData.cantidad}
          onChange={handleChange}
          disabled={isSaving}
          fullWidth
          required
          sx={textFieldStyles}
          slotProps={{ htmlInput: { min: 1, step: 1 } }}
        />

        <TextField
          select
          label="Motivo"
          name="motivo"
          value={formData.motivo}
          onChange={handleChange}
          disabled={isSaving}
          fullWidth
          sx={textFieldStyles}
          slotProps={selectSlotProps}
        >
          {defaultReasons[formData.tipo].map((reason) => (
            <MenuItem key={reason} value={reason}>
              {reason}
            </MenuItem>
          ))}
        </TextField>

        <div className="sm:col-span-2">
          <TextField
            label="Detalle (opcional)"
            name="observacion"
            placeholder="Ej: proveedor, número de remito"
            value={formData.observacion}
            onChange={handleChange}
            disabled={isSaving}
            fullWidth
            sx={textFieldStyles}
          />
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-mesa-border bg-mesa-card px-4 py-3 text-sm text-slate-400 sm:col-span-2">
          Stock actual
          <strong className="text-white">
            {typeof selectedProduct?.cantidadActual === 'number'
              ? selectedProduct.cantidadActual
              : '-'}
          </strong>
        </div>
      </div>
    </DashboardFormDialog>
  )
}

export default StockMovementDialog