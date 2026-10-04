import { useState } from 'react'
import { toast } from 'sonner'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

/* MUI */
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'

/* Components */
import DashboardFormDialog from '../DashboardFormDialog'

/* API */
import {
  createStockMovement,
  listStockMovementReasons,
} from '../../../api/stockService'
import { queryKeys } from '../../../api/queryClient'

/* Styles */
import {
  textFieldStyles,
  selectSlotProps,
} from '../../../styles/formStyles'

const movementTypes = [
  { value: 'INGRESO', label: 'Reingreso' },
  { value: 'EGRESO', label: 'Egreso' },
  { value: 'AJUSTE', label: 'Ajuste' },
]

const getErrorMessage = (error) =>
  error.response?.data?.message ||
  error.message ||
  'No se pudo completar la operación.'

const StockMovementDialog = ({
  open,
  idEstablecimiento,
  products = [],
  initialProduct = null,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    idProducto: initialProduct?.idProducto ?? '',
    tipoMovimiento: 'INGRESO',
    cantidad: '',
    idMotivoMovimiento: '',
    detalle: '',
  })

  const queryClient = useQueryClient()
  const stockProducts = products.filter(
    (product) => product.controlaStock && product.stockInicializado
  )
  const currentProduct = products.find(
    (product) => product.idProducto === Number(formData.idProducto)
  )
  const selectedProduct = initialProduct ?? currentProduct
  const selectableProducts =
    initialProduct &&
    !stockProducts.some(
      (product) => product.idProducto === initialProduct.idProducto
    )
      ? [...stockProducts, initialProduct]
      : stockProducts

  const {
    data: reasons = [],
    isLoading: reasonsLoading,
    error: reasonsError,
  } = useQuery({
    queryKey: queryKeys.stockMovementReasons(
      idEstablecimiento,
      formData.tipoMovimiento
    ),
    queryFn: () =>
      listStockMovementReasons(
        idEstablecimiento,
        formData.tipoMovimiento
      ),
    enabled: Boolean(idEstablecimiento && formData.tipoMovimiento),
  })

  const movementMutation = useMutation({
    mutationFn: createStockMovement,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.products(idEstablecimiento),
      })
      queryClient.invalidateQueries({
        queryKey: queryKeys.stockMovementsPrefix(idEstablecimiento),
      })
    },
  })

  const selectedReasonId = reasons.some(
    (reason) =>
      reason.idMotivoMovimiento === Number(formData.idMotivoMovimiento)
  )
    ? formData.idMotivoMovimiento
    : reasons[0]?.idMotivoMovimiento ?? ''

  const isAdjustment = formData.tipoMovimiento === 'AJUSTE'
  const isCurrentProductInitialized =
    Boolean(selectedProduct?.controlaStock) &&
    Boolean(selectedProduct?.stockInicializado)

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleTypeChange = (tipoMovimiento) => {
    setFormData((current) => ({
      ...current,
      tipoMovimiento,
      idMotivoMovimiento: '',
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const quantity = Number(formData.cantidad)

    if (!selectedProduct || !isCurrentProductInitialized) {
      toast.error('Este producto todavía no tiene el stock inicializado.')
      return
    }

    if (
      !Number.isInteger(quantity) ||
      quantity < 0 ||
      (!isAdjustment && quantity === 0)
    ) {
      toast.error(
        isAdjustment
          ? 'Ingresá un stock contado válido (cero o mayor).'
          : 'La cantidad debe ser un número entero mayor a cero.'
      )
      return
    }

    if (!selectedReasonId) {
      toast.error('Seleccioná un motivo para el movimiento.')
      return
    }

    try {
      await movementMutation.mutateAsync({
        idEstablecimiento,
        idProducto: selectedProduct.idProducto,
        tipoMovimiento: formData.tipoMovimiento,
        idMotivoMovimiento: Number(selectedReasonId),
        cantidad: quantity,
        detalle: formData.detalle.trim(),
      })

      toast.success('Movimiento registrado correctamente.')
      onClose()
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <DashboardFormDialog
      open={open}
      title="Registrar movimiento"
      description="Cada movimiento queda en el historial con fecha, usuario y saldo."
      onClose={onClose}
      onSubmit={handleSubmit}
      isBusy={movementMutation.isPending}
      submitDisabled={
        !selectedProduct ||
        !isCurrentProductInitialized ||
        reasonsLoading ||
        reasons.length === 0
      }
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
            disabled={movementMutation.isPending || Boolean(initialProduct)}
            fullWidth
            required
            sx={textFieldStyles}
            slotProps={selectSlotProps}
            helperText={
              initialProduct && !initialProduct.stockInicializado
                ? 'Inicializá el stock desde “Editar producto” antes de registrar movimientos.'
                : stockProducts.length === 0
                  ? 'No hay productos con stock inicializado.'
                  : undefined
            }
          >
            {selectableProducts.map((product) => (
              <MenuItem
                key={product.idProducto}
                value={product.idProducto}
              >
                {product.nombre}
                {typeof product.stockActual === 'number' &&
                  ` · ${product.stockActual} u.`}
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
                aria-checked={formData.tipoMovimiento === type.value}
                disabled={movementMutation.isPending}
                onClick={() => handleTypeChange(type.value)}
                className={`cursor-pointer rounded-lg py-2.5 text-sm font-semibold transition ${
                  formData.tipoMovimiento === type.value
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
          label={isAdjustment ? 'Stock contado (u.)' : 'Cantidad (u.)'}
          name="cantidad"
          type="number"
          value={formData.cantidad}
          onChange={handleChange}
          disabled={movementMutation.isPending}
          fullWidth
          required
          sx={textFieldStyles}
          slotProps={{ htmlInput: { min: isAdjustment ? 0 : 1, step: 1 } }}
        />

        <TextField
          select
          label="Motivo"
          name="idMotivoMovimiento"
          value={selectedReasonId}
          onChange={handleChange}
          disabled={
            movementMutation.isPending ||
            reasonsLoading ||
            reasons.length === 0
          }
          fullWidth
          required
          sx={textFieldStyles}
          slotProps={selectSlotProps}
          helperText={
            reasonsError
              ? getErrorMessage(reasonsError)
              : reasons.length === 0 && !reasonsLoading
                ? 'El backend no devolvió motivos activos para este tipo.'
                : undefined
          }
        >
          {reasons.map((reason) => (
            <MenuItem
              key={reason.idMotivoMovimiento}
              value={reason.idMotivoMovimiento}
            >
              {reason.descripcion}
            </MenuItem>
          ))}
        </TextField>

        <div className="sm:col-span-2">
          <TextField
            label="Detalle (opcional)"
            name="detalle"
            placeholder="Ej: proveedor, número de remito"
            value={formData.detalle}
            onChange={handleChange}
            disabled={movementMutation.isPending}
            fullWidth
            sx={textFieldStyles}
          />
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-mesa-border bg-mesa-card px-4 py-3 text-sm text-slate-400 sm:col-span-2">
          Stock actual
          <strong className="text-white">
            {typeof selectedProduct?.stockActual === 'number'
              ? selectedProduct.stockActual
              : '-'}
          </strong>
        </div>
      </div>
    </DashboardFormDialog>
  )
}

export default StockMovementDialog
