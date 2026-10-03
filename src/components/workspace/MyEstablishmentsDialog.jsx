import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Chip from '@mui/material/Chip'

/* Utils */
import { formatDate } from '../../utils/dateUtils'

const MyEstablishmentsDialog = ({
  open,
  establishments,
  isLoading,
  isError,
  onClose,
}) => {
  const getStatusChipProps = (status) => {
    switch (status) {
      case 'APROBADO':
        return {
          label: 'Aprobado',
          sx: {
            backgroundColor: 'rgba(22, 163, 74, 0.15)',
            color: '#16A34A',
          },
        }

      case 'RECHAZADO':
        return {
          label: 'Rechazado',
          sx: {
            backgroundColor: 'rgba(220, 38, 38, 0.15)',
            color: '#EF4444',
          },
        }

      case 'PENDIENTE':
      default:
        return {
          label: 'Pendiente',
          sx: {
            backgroundColor: 'rgba(245, 158, 11, 0.15)',
            color: '#F59E0B',
          },
        }
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      slotProps={{
        paper: {
          sx: {
            borderRadius: '24px',
            border: '1px solid #1F2937',
            backgroundColor: '#0B111C',
            color: '#F8FAFC',
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
      <DialogTitle
        sx={{
          px: { xs: 3, sm: 4 },
          pt: 4,
          fontFamily: 'Poppins, sans-serif',
          fontWeight: 800,
        }}
      >
        Mis solicitudes
      </DialogTitle>

      <DialogContent
        sx={{
          px: { xs: 3, sm: 4 },
          pb: 4,
        }}
      >
        {isLoading && (
          <p className="text-sm text-mesa-muted">
            Cargando solicitudes...
          </p>
        )}

        {isError && (
          <p className="text-sm text-red-400">
            No se pudieron cargar tus solicitudes.
          </p>
        )}

        {!isLoading &&
          !isError &&
          establishments.length === 0 && (
            <div className="rounded-2xl border border-mesa-border bg-mesa-bg p-5">
              <p className="font-semibold">
                Todavía no tenés solicitudes.
              </p>

              <p className="mt-2 text-sm text-mesa-muted">
                Cuando solicites asociar un establecimiento, vas a poder ver su
                estado acá.
              </p>
            </div>
          )}

        {!isLoading &&
          !isError &&
          establishments.length > 0 && (
            <div className="grid gap-4">
              {establishments.map((establishment) => {
                const statusChip = getStatusChipProps(
                  establishment.estadoEstablecimiento
                )

                return (
                  <article
                    key={establishment.idEstablecimiento}
                    className="rounded-2xl border border-mesa-border bg-mesa-bg p-5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="font-poppins font-bold">
                          {establishment.nombre}
                        </h3>

                        <p className="mt-1 text-sm text-mesa-muted">
                          {establishment.direccion}
                        </p>
                      </div>

                      <Chip
                        label={statusChip.label}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          ...statusChip.sx,
                        }}
                      />
                    </div>

                    {establishment.fechaSolicitud && (
                      <p className="mt-4 text-xs text-mesa-muted">
                        Solicitado el{' '}
                        {formatDate(establishment.fechaSolicitud)}
                      </p>
                    )}
                  </article>
                )
              })}
            </div>
          )}
      </DialogContent>
    </Dialog>
  )
}

export default MyEstablishmentsDialog