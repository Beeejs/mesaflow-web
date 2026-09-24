
import { useEffect } from 'react'
import { toast } from 'sonner'

/* MUI */
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

/* MUI Icons */
import RefreshIcon from '@mui/icons-material/Refresh'

/* Hooks */
import useEstablishmentsQuery from '../../../hooks/queries/useEstablishmentsQuery'

/* Components */
import EstablishmentsTable from '../../../components/dashboard/establishments/EstablishmentsTable'

const AdminEstablishments = () => {
  const {
    data: establishments = [],
    isLoading,
    isFetching,
    error,
    refetch,
  } = useEstablishmentsQuery()

  useEffect(() => {
    if (error) {
      toast.error('No se pudieron cargar los establecimientos.')
    }
  }, [error])

  return (
    <section>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-mesa-cyan">
            Establecimientos
          </p>

          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-mesa-text sm:text-4xl">
            Administración de establecimientos
          </h2>

          <p className="mt-4 max-w-2xl text-base leading-7 text-mesa-muted">
            Consultá los establecimientos registrados y gestioná sus solicitudes.
          </p>
        </div>

        <Tooltip title="Recargar establecimientos">
          <IconButton
            onClick={() => refetch()}
            disabled={isFetching}
            sx={{
              width: 44,
              height: 44,
              border: '1px solid #1F2937',
              borderRadius: '14px',
              backgroundColor: '#0B111C',
              color: '#94A3B8',
              '&:hover': {
                backgroundColor: '#111827',
                color: '#F8FAFC',
              },
            }}
          >
            <RefreshIcon
              sx={{
                animation: isFetching
                  ? 'spin 0.8s linear infinite'
                  : 'none',
                '@keyframes spin': {
                  from: { transform: 'rotate(0deg)' },
                  to: { transform: 'rotate(360deg)' },
                },
              }}
            />
          </IconButton>
        </Tooltip>
      </div>

      <div className="mt-8 min-w-0 rounded-3xl border border-mesa-border bg-mesa-surface p-3 sm:p-6">
        <EstablishmentsTable
          establishments={establishments}
          loading={isLoading}
        />
      </div>
    </section>
  )
}

export default AdminEstablishments