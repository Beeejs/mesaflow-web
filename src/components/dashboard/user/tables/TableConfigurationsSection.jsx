
import { useContext, useState } from 'react'
import { toast } from 'sonner'

/* MUI */
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'

/* Components */
import DefaultButton from '../../../common/button/DefaultButton'
import DashboardFormDialog from '../../DashboardFormDialog'

/* Context */
import { ActionDialogContext } from '../../../../context/ActionDialogContext'

/* Hooks */
import useCreateTableConfigurationMutation from '../../../../hooks/mutations/useCreateTableConfigurationMutation'
import useActivateTableConfigurationMutation from '../../../../hooks/mutations/useActivateTableConfigurationMutation'
import useDeleteTableConfigurationMutation from '../../../../hooks/mutations/useDeleteTableConfigurationMutation'

/* Styles */
import {
  textFieldStyles,
  selectSlotProps,
} from '../../../../styles/formStyles'

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message ||
  error?.message ||
  fallback

const TableConfigurationsSection = ({
  idEstablecimiento,
  configurations,
  selectedConfiguration,
  activeConfiguration,
  onSelectConfiguration,
  isLoading,
  isError,
  onRetry,

  // Estado del editor de distribución
  distributionVersion,
  isDirty = false,
  isDistributionSaving = false,
}) => {
  // =========================================
  // CONTEXTO Y ESTADOS
  // =========================================

  const { openActionDialog } = useContext(ActionDialogContext)

  const [createDialogOpen, setCreateDialogOpen] =
    useState(false)

  const [configurationName, setConfigurationName] =
    useState('')

  // =========================================
  // MUTACIONES
  // =========================================

  const createMutation =
    useCreateTableConfigurationMutation(idEstablecimiento)

  const activateMutation =
    useActivateTableConfigurationMutation(idEstablecimiento)

  const deleteMutation =
    useDeleteTableConfigurationMutation(idEstablecimiento)

  // =========================================
  // DATOS DERIVADOS
  // =========================================

  const hasConfigurations = configurations.length > 0

  const isSaving = createMutation.isPending

  const actionsDisabled =
    isDistributionSaving || isDirty

  // =========================================
  // CREAR CONFIGURACIÓN
  // =========================================

  const handleOpenCreateDialog = () => {
    if (actionsDisabled) return

    setConfigurationName('')
    setCreateDialogOpen(true)
  }

  const handleCloseCreateDialog = () => {
    if (isSaving) return

    setCreateDialogOpen(false)
    setConfigurationName('')
  }

  const handleCreateConfiguration = async (event) => {
    event.preventDefault()

    const nombre = configurationName.trim()

    if (!nombre || isSaving) return

    try {
      const createdConfiguration =
        await createMutation.mutateAsync(nombre)

      if (createdConfiguration?.idConfiguracionMesa != null) {
        onSelectConfiguration(
          String(createdConfiguration.idConfiguracionMesa)
        )
      }

      toast.success('Configuración creada correctamente.')

      setCreateDialogOpen(false)
      setConfigurationName('')
    } catch (error) {
      toast.error(
        getErrorMessage(
          error,
          'No se pudo crear la configuración.'
        )
      )
    }
  }

  // =========================================
  // ACTIVAR CONFIGURACIÓN
  // =========================================

  const handleActivateConfiguration = () => {
    if (
      !selectedConfiguration ||
      selectedConfiguration.activa ||
      activateMutation.isPending ||
      actionsDisabled
    ) {
      return
    }

    const idConfiguracion =
      selectedConfiguration.idConfiguracionMesa

    const nombre = selectedConfiguration.nombre

    openActionDialog({
      title: 'Activar configuración',
      description: `¿Querés activar la configuración "${nombre}"? Esta pasará a ser la distribución operativa del establecimiento.`,
      actionLabel: 'Activar',
      cancelLabel: 'Cancelar',
      variant: 'primary',
      icon: 'confirm',

      onAction: async () => {
        try {
          await activateMutation.mutateAsync(idConfiguracion)

          onSelectConfiguration(String(idConfiguracion))

          toast.success('Configuración activada correctamente.')
        } catch (error) {
          toast.error(
            getErrorMessage(
              error,
              'No se pudo activar la configuración.'
            )
          )

          throw error
        }
      },
    })
  }

  // =========================================
  // ELIMINAR CONFIGURACIÓN
  // =========================================

  const handleDeleteConfiguration = () => {
    if (
      !selectedConfiguration ||
      selectedConfiguration.activa ||
      deleteMutation.isPending ||
      actionsDisabled
    ) {
      return
    }

    const idConfiguracion =
      selectedConfiguration.idConfiguracionMesa

    const nombre = selectedConfiguration.nombre

    openActionDialog({
      title: 'Eliminar configuración',
      description: `¿Estás seguro de que querés eliminar la configuración "${nombre}"? Esta acción no se puede deshacer desde la interfaz.`,
      actionLabel: 'Eliminar',
      cancelLabel: 'Cancelar',
      variant: 'danger',
      icon: 'delete',

      onAction: async () => {
        try {
          await deleteMutation.mutateAsync(idConfiguracion)

          onSelectConfiguration('')

          toast.success('Configuración eliminada correctamente.')
        } catch (error) {
          toast.error(
            getErrorMessage(
              error,
              'No se pudo eliminar la configuración.'
            )
          )

          throw error
        }
      },
    })
  }

  // =========================================
  // RENDERIZADO
  // =========================================

  return (
    <>
      {/* ===================================== */}
      {/* CONFIGURACIONES COMPACTAS             */}
      {/* ===================================== */}

      {isLoading ? (
        <div className="mt-5 rounded-2xl border border-mesa-border bg-mesa-surface p-4">
          <p className="text-sm text-mesa-muted">
            Cargando configuraciones...
          </p>
        </div>
      ) : isError ? (
        <div className="mt-5 rounded-2xl border border-mesa-border bg-mesa-surface p-4">
          <p className="mb-3 text-sm text-red-400">
            No se pudieron cargar las configuraciones.
          </p>

          <DefaultButton
            type="button"
            variant="secondary"
            onClick={onRetry}
          >
            Reintentar
          </DefaultButton>
        </div>
      ) : !hasConfigurations ? (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-dashed border-mesa-border bg-mesa-surface p-5">
          <div>
            <p className="font-semibold text-mesa-text">
              Todavía no hay configuraciones
            </p>

            <p className="mt-1 text-sm text-mesa-muted">
              Creá la primera para empezar a distribuir las mesas.
            </p>
          </div>

          <DefaultButton
            type="button"
            onClick={handleOpenCreateDialog}
            disabled={actionsDisabled}
          >
            Nueva configuración
          </DefaultButton>
        </div>
      ) : (
        <div className="mt-5 rounded-2xl border border-mesa-border bg-mesa-surface px-4 py-3 sm:px-5">
          {/* ===================================== */}
          {/* SELECTOR Y ACCIÓN PRINCIPAL           */}
          {/* ===================================== */}

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Selector, estado y versión */}

            <div className="flex min-w-0 flex-wrap items-center gap-3">
              <div className="w-full sm:w-64">
                <TextField
                  select
                  label="Configuración"
                  size="small"
                  value={
                    selectedConfiguration?.idConfiguracionMesa ?? ''
                  }
                  onChange={(event) =>
                    onSelectConfiguration(
                      String(event.target.value)
                    )
                  }
                  disabled={isDistributionSaving}
                  fullWidth
                  sx={textFieldStyles}
                  slotProps={selectSlotProps}
                >
                  {configurations.map((configuration) => (
                    <MenuItem
                      key={configuration.idConfiguracionMesa}
                      value={configuration.idConfiguracionMesa}
                    >
                      {configuration.nombre}
                      {configuration.activa ? ' (Activa)' : ''}
                    </MenuItem>
                  ))}
                </TextField>
              </div>

              {/* Estado de la configuración */}

              <span
                className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${
                  selectedConfiguration?.activa
                    ? 'border-green-500/40 bg-green-500/10 text-green-400'
                    : 'border-yellow-500/40 bg-yellow-500/10 text-yellow-400'
                }`}
              >
                {selectedConfiguration?.activa
                  ? 'Activa'
                  : 'Inactiva'}
              </span>

              <span className="text-xs text-mesa-muted">
                v{distributionVersion ??
                  selectedConfiguration?.version ??
                  0}
              </span>

              {/* Acciones de configuraciones inactivas */}

              {selectedConfiguration &&
                !selectedConfiguration.activa && (
                  <div className="flex flex-wrap items-center gap-2">
                    <DefaultButton
                      type="button"
                      variant="secondary"
                      onClick={handleActivateConfiguration}
                      disabled={
                        activateMutation.isPending ||
                        actionsDisabled
                      }
                    >
                      Activar
                    </DefaultButton>

                    <DefaultButton
                      type="button"
                      variant="danger"
                      onClick={handleDeleteConfiguration}
                      disabled={
                        deleteMutation.isPending ||
                        actionsDisabled
                      }
                    >
                      Eliminar
                    </DefaultButton>
                  </div>
                )}
            </div>

            {/* Nueva configuración: extremo derecho */}

            <div className="flex shrink-0 justify-end">
              <DefaultButton
                type="button"
                onClick={handleOpenCreateDialog}
                disabled={actionsDisabled}
              >
                Nueva configuración
              </DefaultButton>
            </div>
          </div>

          {/* ===================================== */}
          {/* CONFIGURACIÓN OPERATIVA ACTUAL       */}
          {/* ===================================== */}

          {selectedConfiguration &&
            !selectedConfiguration.activa && (
              <p className="mt-3 text-xs text-mesa-muted">
                En uso:{' '}
                {activeConfiguration?.nombre ??
                  'ninguna configuración activa'}
              </p>
            )}
        </div>
      )}

      {/* ===================================== */}
      {/* FORMULARIO: NUEVA CONFIGURACIÓN       */}
      {/* ===================================== */}

      {createDialogOpen && (
        <DashboardFormDialog
          open
          title="Nueva configuración"
          description="Creá una distribución de mesas para tu establecimiento."
          onClose={handleCloseCreateDialog}
          onSubmit={handleCreateConfiguration}
          isBusy={isSaving}
          submitDisabled={!configurationName.trim()}
          submitLabel="Crear configuración"
        >
          <TextField
            label="Nombre de la configuración"
            value={configurationName}
            onChange={(event) =>
              setConfigurationName(event.target.value)
            }
            placeholder="Ej: Distribución fin de semana"
            fullWidth
            required
            disabled={isSaving}
            sx={textFieldStyles}
          />
        </DashboardFormDialog>
      )}
    </>
  )
}

export default TableConfigurationsSection
