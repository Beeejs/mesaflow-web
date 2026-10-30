import { useState, useContext } from 'react'
import { useParams } from 'react-router'
import { toast } from 'sonner'

/* MUI */
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'

/* Components */
import DefaultButton from '../../../../components/common/button/DefaultButton'
import DashboardPageHeader from '../../../../components/dashboard/DashboardPageHeader'
import DashboardFormDialog from '../../../../components/dashboard/DashboardFormDialog'

/* Hooks */
import useTableConfigurationsQuery from '../../../../hooks/queries/useTableConfigurationsQuery'
import useTableDistributionQuery from '../../../../hooks/queries/useTableDistributionQuery'
import useCreateTableConfigurationMutation from '../../../../hooks/mutations/useCreateTableConfigurationMutation'
import useActivateTableConfigurationMutation from '../../../../hooks/mutations/useActivateTableConfigurationMutation'
import useDeleteTableConfigurationMutation from '../../../../hooks/mutations/useDeleteTableConfigurationMutation'
import useSectorsQuery from '../../../../hooks/queries/useSectorsQuery'
import useCreateSectorMutation from '../../../../hooks/mutations/useCreateSectorMutation'
import useUpdateSectorMutation from '../../../../hooks/mutations/useUpdateSectorMutation'
import useDeleteSectorMutation from '../../../../hooks/mutations/useDeleteSectorMutation'

/* Context */
import { ActionDialogContext } from '../../../../context/ActionDialogContext'

/* Styles */
import {
  textFieldStyles,
  selectSlotProps,
} from '../../../../styles/formStyles'

const Tables = () => {
  // Hooks
  const { idEstablecimiento } = useParams()

  // Estados de configuración
  const [selectedId, setSelectedId] = useState('')
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [configurationName, setConfigurationName] = useState('')

  // Estados de sectores
  const [sectorDialogOpen, setSectorDialogOpen] = useState(false)
  const [sectorName, setSectorName] = useState('')
  const [editingSector, setEditingSector] = useState(null)

  // Context
  const { openActionDialog } = useContext(ActionDialogContext)

  const {
    data: configurations = [],
    isLoading,
    isError,
    refetch,
  } = useTableConfigurationsQuery(idEstablecimiento)


  // Consulta de sectores
  const {
    data: sectors = [],
    isLoading: sectorsLoading,
    isError: sectorsError,
    refetch: refetchSectors,
  } = useSectorsQuery(idEstablecimiento)

  // Mutaciones de sectores
  const createSectorMutation =
    useCreateSectorMutation(idEstablecimiento)

  const updateSectorMutation =
    useUpdateSectorMutation(idEstablecimiento)

  const deleteSectorMutation =
    useDeleteSectorMutation(idEstablecimiento)

  // Crear configuración de mesa
  const createMutation =
  useCreateTableConfigurationMutation(idEstablecimiento)
  
  // Activar configuración de mesa
  const activateMutation =
    useActivateTableConfigurationMutation(idEstablecimiento)
  // Eliminar configuración de mesa
  const deleteMutation =
    useDeleteTableConfigurationMutation(idEstablecimiento)

  // Constantes derivadas
  const activeConfiguration = configurations.find(
    (configuration) => configuration.activa
  )

  const selectedConfiguration =
    configurations.find(
      (configuration) =>
        configuration.idConfiguracionMesa === Number(selectedId)
    ) ??
    activeConfiguration ??
    configurations[0]

  const selectedConfigurationId =
    selectedConfiguration?.idConfiguracionMesa

  const isSectorSaving =
    createSectorMutation.isPending ||
    updateSectorMutation.isPending

  const isSectorDeleting = deleteSectorMutation.isPending

  const {
    data: distribution,
    isLoading: distributionLoading,
    isError: distributionError,
  } = useTableDistributionQuery(
    idEstablecimiento,
    selectedConfigurationId
  )

  const hasConfigurations = configurations.length > 0
  const isSaving = createMutation.isPending

  // Funciones
  const handleOpenCreateDialog = () => {
    setConfigurationName('')
    setCreateDialogOpen(true)
  }

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

      if (createdConfiguration?.idConfiguracionMesa) {
        setSelectedId(
          String(createdConfiguration.idConfiguracionMesa)
        )
      }

      toast.success('Configuración creada correctamente.')

      setCreateDialogOpen(false)
      setConfigurationName('')
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'No se pudo crear la configuración.'
      )
    }
  }

  // Activar configuración
  const handleActivateConfiguration = () => {
    if (!selectedConfiguration || selectedConfiguration.activa) return

    const idConfiguracion = selectedConfiguration.idConfiguracionMesa
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

          setSelectedId(String(idConfiguracion))

          toast.success('Configuración activada correctamente.')
        } catch (error) {
          toast.error(
            error.response?.data?.message ||
              error.message ||
              'No se pudo activar la configuración.'
          )

          throw error
        }
      },
    })
  }

  // Eliminar configuración
  const handleDeleteConfiguration = () => {
    if (!selectedConfiguration || selectedConfiguration.activa) return

    const idConfiguracion = selectedConfiguration.idConfiguracionMesa
    const nombre = selectedConfiguration.nombre

    console.log(`Intentando eliminar configuración con ID ${idConfiguracion} y nombre "${nombre}"`)

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

          setSelectedId('')

          toast.success('Configuración eliminada correctamente.')
        } catch (error) {
          toast.error(
            error.response?.data?.message ||
              error.message ||
              'No se pudo eliminar la configuración.'
          )

          throw error
        }
      },
    })
  }

  
// Abrir formulario para crear un sector
const handleOpenCreateSector = () => {
  setEditingSector(null)
  setSectorName('')
  setSectorDialogOpen(true)
}

// Abrir formulario para modificar un sector
const handleOpenEditSector = (sector) => {
  setEditingSector(sector)
  setSectorName(sector.nombre)
  setSectorDialogOpen(true)
}

  // Cerrar formulario
  const handleCloseSectorDialog = () => {
    if (isSectorSaving) return

    setSectorDialogOpen(false)
    setEditingSector(null)
    setSectorName('')
  }

  // Crear o modificar un sector
  const handleSaveSector = async (event) => {
    event.preventDefault()

    const nombre = sectorName.trim()

    if (!nombre || isSectorSaving) return

    try {
      if (editingSector) {
        await updateSectorMutation.mutateAsync({
          idSector: editingSector.idSector,
          nombre,
        })

        toast.success('Sector modificado correctamente.')
      } else {
        await createSectorMutation.mutateAsync(nombre)

        toast.success('Sector creado correctamente.')
      }

      setSectorDialogOpen(false)
      setEditingSector(null)
      setSectorName('')
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          'No se pudo guardar el sector.'
      )
    }
  }

  // Eliminar un sector
  const handleDeleteSector = (sector) => {
    if (isSectorDeleting) return

    openActionDialog({
      title: 'Eliminar sector',
      description: `¿Querés eliminar el sector "${sector.nombre}"? El backend verificará si la operación está permitida.`,
      actionLabel: 'Eliminar',
      cancelLabel: 'Cancelar',
      variant: 'danger',
      icon: 'delete',

      onAction: async () => {
        try {
          await deleteSectorMutation.mutateAsync(sector.idSector)

          toast.success('Sector eliminado correctamente.')
        } catch (error) {
          toast.error(
            error.response?.data?.message ||
              error.message ||
              'No se pudo eliminar el sector.'
          )

          throw error
        }
      },
    })
  }


  // Renderizado
  return (
    <section className="min-w-0">
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
            onClick={() => refetch()}
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
            a organizar los sectores y las mesas del
            establecimiento.
          </p>

          <div className="mt-6 flex justify-center">
            <DefaultButton
              onClick={handleOpenCreateDialog}
            >
              Crear primera configuración
            </DefaultButton>
          </div>
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          <div className="rounded-3xl border border-mesa-border bg-mesa-surface p-5 sm:p-6">
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
                  value={selectedConfigurationId ?? ''}
                  onChange={(event) =>
                    setSelectedId(String(event.target.value))
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
                >
                  Activar configuración
                </DefaultButton>

                <DefaultButton
                  type="button"
                  variant="danger"
                  onClick={handleDeleteConfiguration}
                >
                  Eliminar configuración
                </DefaultButton>
              </div>
            )}

            {!selectedConfiguration?.activa && (
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

          <div className="rounded-3xl border border-mesa-border bg-mesa-surface p-6">
            <h2 className="font-display text-xl font-bold text-mesa-text">
              Distribución
            </h2>

            {distributionLoading ? (
              <p className="mt-4 text-sm text-mesa-muted">
                Cargando distribución...
              </p>
            ) : distributionError ? (
              <p className="mt-4 text-sm text-red-400">
                No se pudo cargar la distribución seleccionada.
              </p>
            ) : distribution ? (
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-mesa-border bg-mesa-card p-5">
                  <p className="text-sm text-mesa-muted">
                    Mesas
                  </p>
                  <p className="mt-2 text-3xl font-bold text-mesa-text">
                    {distribution.mesas?.length ?? 0}
                  </p>
                </div>

                <div className="rounded-xl border border-mesa-border bg-mesa-card p-5">
                  <p className="text-sm text-mesa-muted">
                    Grupos
                  </p>
                  <p className="mt-2 text-3xl font-bold text-mesa-text">
                    {distribution.grupos?.length ?? 0}
                  </p>
                </div>

                <div className="rounded-xl border border-mesa-border bg-mesa-card p-5">
                  <p className="text-sm text-mesa-muted">
                    Mozos por sector
                  </p>
                  <p className="mt-2 text-3xl font-bold text-mesa-text">
                    {distribution.mozosSectores?.length ?? 0}
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      
      {/* Administración de sectores */}
      <div className="mt-6 rounded-3xl border border-mesa-border bg-mesa-surface p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-bold text-mesa-text">
              Sectores
            </h2>

            <p className="mt-2 text-sm text-mesa-muted">
              Administrá los sectores físicos de tu establecimiento.
            </p>
          </div>

          <DefaultButton
            type="button"
            onClick={handleOpenCreateSector}
          >
            Nuevo sector
          </DefaultButton>
        </div>

        {sectorsLoading ? (
          <p className="mt-6 text-sm text-mesa-muted">
            Cargando sectores...
          </p>
        ) : sectorsError ? (
          <div className="mt-6 space-y-3">
            <p className="text-sm text-red-400">
              No se pudieron cargar los sectores.
            </p>

            <DefaultButton
              variant="secondary"
              onClick={() => refetchSectors()}
            >
              Reintentar
            </DefaultButton>
          </div>
        ) : sectors.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-mesa-border p-6 text-center">
            <p className="text-sm text-mesa-muted">
              Todavía no hay sectores registrados.
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {sectors.map((sector) => (
              <div
                key={sector.idSector}
                className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-mesa-border bg-mesa-card p-4"
              >
                <div>
                  <p className="font-semibold text-mesa-text">
                    {sector.nombre}
                  </p>

                  <p className="mt-1 text-xs text-mesa-muted">
                    Sector #{sector.idSector}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <DefaultButton
                    type="button"
                    variant="secondary"
                    onClick={() => handleOpenEditSector(sector)}
                  >
                    Editar
                  </DefaultButton>

                  <DefaultButton
                    type="button"
                    variant="danger"
                    onClick={() => handleDeleteSector(sector)}
                  >
                    Eliminar
                  </DefaultButton>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>


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

            
      {/* Formulario para crear o modificar sectores */}
      {sectorDialogOpen && (
        <DashboardFormDialog
          open
          title={editingSector ? 'Editar sector' : 'Nuevo sector'}
          description={
            editingSector
              ? 'Modificá el nombre del sector.'
              : 'Creá un nuevo sector para organizar las mesas del establecimiento.'
          }
          onClose={handleCloseSectorDialog}
          onSubmit={handleSaveSector}
          isBusy={isSectorSaving}
          submitDisabled={!sectorName.trim()}
          submitLabel={
            editingSector ? 'Guardar cambios' : 'Crear sector'
          }
        >
          <TextField
            label="Nombre del sector"
            value={sectorName}
            onChange={(event) => setSectorName(event.target.value)}
            placeholder="Ej: Salón principal"
            fullWidth
            required
            disabled={isSectorSaving}
            sx={textFieldStyles}
          />
        </DashboardFormDialog>
      )}

    </section>
  )
}

export default Tables