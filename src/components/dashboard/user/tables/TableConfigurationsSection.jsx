
import { useContext, useState } from 'react'
import { toast } from 'sonner'

/* MUI */
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'

/* Components */
import DefaultButton from '../../../common/button/DefaultButton'
import DashboardPageHeader from '../../DashboardPageHeader'
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
}) => {
  // Context
  const { openActionDialog } = useContext(ActionDialogContext)

  // Estados
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [configurationName, setConfigurationName] = useState('')

  // Mutaciones
  const createMutation =
    useCreateTableConfigurationMutation(idEstablecimiento)

  const activateMutation =
    useActivateTableConfigurationMutation(idEstablecimiento)

  const deleteMutation =
    useDeleteTableConfigurationMutation(idEstablecimiento)

  // Constantes derivadas
  const hasConfigurations = configurations.length > 0
  const isSaving = createMutation.isPending

  // Abrir formulario
  const handleOpenCreateDialog = () => {
    setConfigurationName('')
    setCreateDialogOpen(true)
  }

  // Cerrar formulario
  const handleCloseCreateDialog = () => {
    if (isSaving) return

    setCreateDialogOpen(false)
    setConfigurationName('')
  }

  // Crear configuración
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

  // Activar configuración
  const handleActivateConfiguration = () => {
    if (
      !selectedConfiguration ||
      selectedConfiguration.activa ||
      activateMutation.isPending
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

  // Eliminar configuración
  const handleDeleteConfiguration = () => {
    if (
      !selectedConfiguration ||
      selectedConfiguration.activa ||
      deleteMutation.isPending
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

  return (
    <>
      <DashboardPageHeader
        eyebrow="Operación"
        title="Mesas"
        description="Administrá las configuraciones, sectores y mesas de tu establecimiento."
        action={
          <DefaultButton
            type="button"
            onClick={handleOpenCreateDialog}
          >
            Nueva configuración
          </DefaultButton>
        }
      />

      {isLoading ? (
        <div className="mt-8 rounded-3xl border border-mesa-border bg-mesa-surface p-6">
          <p className="text-sm text-mesa-muted">
            Cargando configuraciones...
          </p>
        </div>
      ) : isError ? (
        <div className="mt-8 rounded-3xl border border-mesa-border bg-mesa-surface p-6">
          <p className="mb-4 text-sm text-red-400">
            No se pudieron cargar las configuraciones.
          </p>

          <DefaultButton
            variant="secondary"
            onClick={onRetry}
          >
            Reintentar
          </DefaultButton>
        </div>
      ) : !hasConfigurations ? (
        <div className="mt-8 rounded-3xl border border-dashed border-mesa-border bg-mesa-surface p-8 text-center">
          <h2 className="font-display text-xl font-bold text-mesa-text">
            Todavía no hay configuraciones de mesas
          </h2>

          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-mesa-muted">
            Creá la primera configuración para comenzar
            a organizar los sectores y las mesas del establecimiento.
          </p>
        </div>
      ) : (
        <div className="mt-8 rounded-3xl border border-mesa-border bg-mesa-surface p-5 sm:p-6">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
            <div>
              <h2 className="font-display text-lg font-bold text-mesa-text">
                Configuración de mesas
              </h2>

              <p className="mt-2 text-sm text-mesa-muted">
                Seleccioná la distribución que querés consultar
                o editar.
              </p>
            </div>

            <div className="w-full lg:w-80">
              <TextField
                select
                label="Configuración"
                value={
                  selectedConfiguration?.idConfiguracionMesa ?? ''
                }
                onChange={(event) =>
                  onSelectConfiguration(
                    String(event.target.value)
                  )
                }
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
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span
              className={`rounded-full border px-3 py-1 text-xs font-bold ${
                selectedConfiguration?.activa
                  ? 'border-green-500/40 bg-green-500/10 text-green-400'
                  : 'border-yellow-500/40 bg-yellow-500/10 text-yellow-400'
              }`}
            >
              {selectedConfiguration?.activa
                ? 'Activa'
                : 'Inactiva'}
            </span>

            <span className="text-sm text-mesa-muted">
              Versión: {selectedConfiguration?.version ?? 0}
            </span>
          </div>

          {selectedConfiguration && !selectedConfiguration.activa && (
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <DefaultButton
                type="button"
                onClick={handleActivateConfiguration}
                disabled={activateMutation.isPending}
              >
                Activar configuración
              </DefaultButton>

              <DefaultButton
                type="button"
                variant="danger"
                onClick={handleDeleteConfiguration}
                disabled={deleteMutation.isPending}
              >
                Eliminar configuración
              </DefaultButton>
            </div>
          )}

          {selectedConfiguration && !selectedConfiguration.activa && (
            <p className="mt-4 text-sm text-mesa-muted">
              Estás consultando una configuración inactiva.
              La distribución operativa actual es{' '}
              <span className="font-semibold text-mesa-text">
                {activeConfiguration?.nombre ??
                  'Ninguna configuración activa'}
              </span>.
            </p>
          )}
        </div>
      )}

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
