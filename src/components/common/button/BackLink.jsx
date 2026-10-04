import { Link } from 'react-router'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

const BackLink = ({
  to = '/',
  children = 'Volver al inicio',
  onClick,
}) => {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="inline-flex items-center gap-2 text-sm font-semibold text-mesa-muted transition hover:text-mesa-cyan-light"
    >
      <ArrowBackIcon sx={{ fontSize: 18 }} />
      {children}
    </Link>
  )
}

export default BackLink