const TABLE_STATES = {
  DISPONIBLE: { label: 'Disponible', classes: 'border-emerald-500/60 bg-emerald-500/15 text-emerald-300' },
  OCUPADA: { label: 'Ocupada', classes: 'border-orange-500/70 bg-orange-500/20 text-orange-300' },
  RESERVADA: { label: 'Reservada', classes: 'border-blue-500/60 bg-blue-500/15 text-blue-300' },
  FUERA_SERVICIO: { label: 'Fuera de servicio', classes: 'border-red-500/60 bg-red-500/15 text-red-300' },
}

export const getTableState = (estado) => TABLE_STATES[estado] ?? {
  label: estado || 'Sin información',
  classes: 'border-slate-500/60 bg-slate-500/15 text-mesa-muted',
}
