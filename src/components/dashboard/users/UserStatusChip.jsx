const UserStatusChip = ({ active }) => {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
        active
          ? 'bg-mesa-success/10 text-mesa-success'
          : 'bg-red-500/10 text-red-300'
      }`}
    >
      {active ? 'Activo' : 'Inactivo'}
    </span>
  )
}

export default UserStatusChip