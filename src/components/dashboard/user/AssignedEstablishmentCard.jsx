/* MUI Icons */
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined'

/* Components */
import DefaultButton from '../../common/button/DefaultButton'

const AssignedEstablishmentCard = ({
  establishment,
  onSelect,
  canWork
}) => {
  // Constantes derivadas
  const imageUrl = establishment.imagenUrl

  // Renderizado
  return (
    <article className="overflow-hidden rounded-3xl border border-mesa-border bg-mesa-surface shadow-xl shadow-black/10 transition hover:border-mesa-primary/50">
      <div className="h-40 bg-mesa-card">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={establishment.nombre}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-mesa-muted">
            <StorefrontOutlinedIcon
              sx={{
                fontSize: 48,
              }}
            />
          </div>
        )}
      </div>

      <div className="p-6">
        <h2 className="font-display text-xl font-bold text-mesa-text">
          {establishment.nombre}
        </h2>

        {establishment.direccion && (
          <div className="mt-3 flex items-center gap-2 text-sm text-mesa-muted">
            <LocationOnOutlinedIcon
              sx={{
                fontSize: 18,
              }}
            />

            <span>
              {establishment.direccion}
            </span>
          </div>
        )}

        {canWork && (
          <DefaultButton
            fullWidth
            onClick={() => onSelect(establishment)}
            sx={{
              mt: 3,
              cursor: 'pointer',
            }}
          >
            Trabajar aquí
          </DefaultButton>
        )}
      </div>
    </article>
  )
}

export default AssignedEstablishmentCard