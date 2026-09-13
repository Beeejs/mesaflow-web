/* MUI */
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'

const tableCellStyles = {
  color: '#F8FAFC',
  borderBottom: '1px solid #1F2937',
}

const tableHeadCellStyles = {
  ...tableCellStyles,
  color: '#94A3B8',
  backgroundColor: 'rgba(17, 24, 39, 0.6)',
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
}

const DashboardTable = ({
  columns = [],
  rows = [],
  getRowId,
  emptyMessage = 'No hay datos para mostrar.',
}) => {
  if (rows.length === 0) {
    return (
      <div className="rounded-3xl border border-mesa-border bg-mesa-surface p-6">
        <p className="text-sm text-mesa-muted">
          {emptyMessage}
        </p>
      </div>
    )
  }

  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: '24px',
        border: '1px solid #1F2937',
        backgroundColor: '#0B111C',
        backgroundImage: 'none',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
        overflow: 'hidden',
      }}
    >
      <Table sx={{ minWidth: 900 }}>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.key}
                align={column.align || 'left'}
                sx={tableHeadCellStyles}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={getRowId(row)}
              sx={{
                transition: 'background-color 0.2s ease',
                '&:hover': {
                  backgroundColor: 'rgba(17, 24, 39, 0.55)',
                },
              }}
            >
              {columns.map((column) => (
                <TableCell
                  key={column.key}
                  align={column.align || 'left'}
                  sx={tableCellStyles}
                >
                  {column.render
                    ? column.render(row)
                    : row[column.key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default DashboardTable