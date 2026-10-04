import { useMemo, useState } from 'react'

/* MUI Icons */
import SearchIcon from '@mui/icons-material/Search'

const typeConfig = {
  INICIAL: { label: 'Stock inicial', style: 'border-blue-500/50 bg-blue-500/10 text-blue-400' },
  INGRESO: { label: 'Reingreso', style: 'border-green-500/50 bg-green-500/10 text-green-500' },
  VENTA: { label: 'Venta', style: 'border-slate-500/50 bg-slate-500/10 text-slate-400' },
  EGRESO: { label: 'Egreso', style: 'border-red-500/50 bg-red-500/10 text-red-500' },
  AJUSTE: { label: 'Ajuste', style: 'border-yellow-500/50 bg-yellow-500/10 text-yellow-500' },
}

const headCell =
  'px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500'

const formatDay = (value) =>
  value ? new Date(value).toLocaleDateString('es-AR') : '-'

const formatHour = (value) =>
  value
    ? new Date(value).toLocaleTimeString('es-AR', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '-'

const isOutgoing = (movement) => Number(movement.cantidad) < 0

const StockMovementsTable = ({ movements = [], loading = false }) => {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()

    return movements.filter((movement) => {
      const matchesType =
        !typeFilter || movement.tipoMovimiento === typeFilter
      const matchesSearch =
        !term ||
        [
          movement.producto,
          movement.usuario,
          movement.motivo,
          movement.detalle,
        ]
          .join(' ')
          .toLowerCase()
          .includes(term)

      return matchesType && matchesSearch
    })
  }, [movements, search, typeFilter])

  if (loading) {
    return <p className="p-8 text-center text-slate-500">Cargando movimientos...</p>
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-4">
        <label className="flex min-w-[240px] flex-1 items-center gap-3 rounded-2xl border border-mesa-border bg-mesa-surface px-5 py-3 text-slate-500">
          <SearchIcon sx={{ fontSize: 22 }} />
          <input
            type="text"
            placeholder="Buscar"
            aria-label="Buscar movimiento"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full bg-transparent text-base text-white outline-none placeholder:text-slate-500"
          />
        </label>

        <select
          aria-label="Filtrar por tipo"
          value={typeFilter}
          onChange={(event) => setTypeFilter(event.target.value)}
          className="cursor-pointer rounded-2xl border border-mesa-border bg-mesa-surface px-5 py-3 text-base text-white outline-none"
        >
          <option value="">Todos los tipos</option>

          {Object.entries(typeConfig).map(([value, config]) => (
            <option key={value} value={value}>
              {config.label}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-3xl border border-mesa-border bg-mesa-surface p-8 text-center text-slate-500">
          Todavía no hay movimientos de stock para mostrar.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-mesa-border bg-mesa-surface">
          <table className="w-full min-w-[900px] border-collapse">
            <thead>
              <tr className="border-b border-mesa-border">
                <th className={headCell}>Fecha</th>
                <th className={headCell}>Hora</th>
                <th className={headCell}>Producto</th>
                <th className={headCell}>Tipo</th>
                <th className={headCell}>Cantidad</th>
                <th className={headCell}>Saldo</th>
                <th className={headCell}>Usuario</th>
                <th className={headCell}>Detalle</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((movement) => {
                const config = typeConfig[movement.tipoMovimiento]
                const quantity = Math.abs(Number(movement.cantidad))

                return (
                  <tr
                    key={movement.idMovimientoStock}
                    className="border-b border-mesa-border last:border-b-0"
                  >
                    <td className="px-4 py-3 text-sm text-slate-300">
                      {formatDay(movement.fecha)}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-300">
                      {formatHour(movement.fecha)}
                    </td>
                    <td className="px-4 py-3 text-base font-medium text-white">
                      {movement.producto}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-lg border px-3 py-1 text-sm font-medium ${
                          config?.style ??
                          'border-white/10 bg-white/5 text-slate-400'
                        }`}
                      >
                        {config?.label ?? movement.tipoMovimiento}
                      </span>
                    </td>
                    <td
                      className={`px-4 py-3 text-base font-bold ${
                        isOutgoing(movement) ? 'text-red-500' : 'text-green-500'
                      }`}
                    >
                      {isOutgoing(movement) ? '−' : '+'}
                      {quantity}
                    </td>
                    <td className="px-4 py-3 text-base font-bold text-white">
                      {movement.saldoResultante ?? '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-300">
                      {movement.usuario}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-500">
                      {[movement.motivo, movement.detalle]
                        .filter(Boolean)
                        .join(' · ')}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default StockMovementsTable