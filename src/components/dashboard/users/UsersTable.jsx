/* MUI */
import EditIcon from '@mui/icons-material/Edit'

/* Components */
import DashboardTable from '../../../components/dashboard/DashboardTable'
import UserStatusChip from './UserStatusChip'

const formatDate = (date) => {
  if (!date) {
    return '-'
  }

  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date))
}

const UsersTable = ({ users = [], onEditUser }) => {
  const columns = [
    {
      key: 'usuario',
      label: 'Usuario',
      render: (user) => (
        <p className="text-sm font-semibold text-mesa-text">
          {user.nombre} {user.apellido}
        </p>
      ),
    },
    {
      key: 'email',
      label: 'Email',
      render: (user) => (
        <p className="text-sm text-mesa-muted">
          {user.email}
        </p>
      ),
    },
    {
      key: 'rol',
      label: 'Rol',
      render: (user) => (
        <span className="rounded-full border border-mesa-border px-3 py-1 text-xs font-bold text-mesa-cyan-light">
          {user.rol}
        </span>
      ),
    },
    {
      key: 'activo',
      label: 'Estado',
      render: (user) => (
        <UserStatusChip active={user.activo} />
      ),
    },
    {
      key: 'fechaCreacion',
      label: 'Fecha',
      render: (user) => (
        <p className="text-sm text-mesa-muted">
          {formatDate(user.fechaCreacion)}
        </p>
      ),
    },
    {
      key: 'acciones',
      label: 'Acciones',
      align: 'right',
      render: (user) => (
        <button
          type="button"
          onClick={() => onEditUser(user)}
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-mesa-border px-4 py-2 text-sm font-semibold text-mesa-muted transition hover:border-mesa-primary/60 hover:text-mesa-text"
        >
          <EditIcon sx={{ fontSize: 18 }} />
          Editar
        </button>
      ),
    },
  ]

  return (
    <DashboardTable
      columns={columns}
      rows={users}
      getRowId={(user) => user.idUsuario}
      emptyMessage="No hay usuarios para mostrar."
    />
  )
}

export default UsersTable