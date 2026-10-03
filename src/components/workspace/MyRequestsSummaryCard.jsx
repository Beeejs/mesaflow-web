/* MUI Icons */
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

const MyRequestsSummaryCard = ({
  pendingCount,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        flex w-full cursor-pointer items-center
        justify-between gap-4
        rounded-3xl border border-mesa-border
        bg-mesa-surface/70 p-5 text-left
        transition hover:border-mesa-primary
        hover:bg-mesa-card
      "
    >
      <div className="flex min-w-0 items-center gap-4">
        <div
          className="
            flex h-12 w-12 shrink-0 items-center
            justify-center rounded-2xl
            bg-mesa-card text-mesa-cyan
          "
        >
          <AssignmentOutlinedIcon />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="font-poppins font-bold">
              Mis solicitudes
            </h2>

            {pendingCount > 0 && (
              <span
                className="
                  flex h-6 min-w-6 items-center
                  justify-center rounded-full
                  bg-amber-500/15 px-1.5
                  text-xs font-bold text-amber-400
                "
              >
                {pendingCount}
              </span>
            )}
          </div>

          <p className="mt-1 text-sm text-mesa-muted">
            Consultá el estado de los establecimientos que solicitaste.
          </p>
        </div>
      </div>

      <ArrowForwardIcon className="shrink-0 text-mesa-muted" />
    </button>
  )
}

export default MyRequestsSummaryCard