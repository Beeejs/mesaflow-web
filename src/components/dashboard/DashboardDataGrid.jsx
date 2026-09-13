import { DataGrid } from '@mui/x-data-grid'

/* Components */
import Loader from '../loader/Loader'

const DashboardDataGrid = ({
  rows = [],
  columns = [],
  getRowId,
  loading = false,
  emptyMessage = 'No hay datos para mostrar.',
  pageSize = 10,
  minHeight = 360,
}) => {
  return (
    <DataGrid
      rows={rows}
      columns={columns}
      getRowId={getRowId}
      loading={loading}
      disableRowSelectionOnClick
      showToolbar
      pageSizeOptions={[5, 10, 25]}
      initialState={{
        pagination: {
          paginationModel: {
            page: 0,
            pageSize,
          },
        },
      }}
      slots={{
        loadingOverlay: () => (
          <div className="flex h-full min-h-[240px] items-center justify-center bg-mesa-surface">
            <Loader size={120} />
          </div>
        ),
      }}
      localeText={{
        noRowsLabel: emptyMessage,
        noResultsOverlayLabel: 'No se encontraron resultados.',
        toolbarQuickFilterPlaceholder: 'Buscar...',
        toolbarColumns: 'Columnas',
        toolbarFilters: 'Filtros',
        toolbarDensity: 'Densidad',
        toolbarExport: 'Exportar',
        footerRowSelected: (count) =>
          count !== 1
            ? `${count.toLocaleString()} filas seleccionadas`
            : `${count.toLocaleString()} fila seleccionada`,
      }}
      sx={{
        minHeight,
        width: '100%',
        border: '1px solid #1F2937',
        borderRadius: '20px',
        overflow: 'hidden',
        color: '#F8FAFC',
        backgroundColor: '#0B111C',

        '& .MuiDataGrid-main': {
          borderRadius: '20px',
          overflow: 'hidden',
        },

        '& .MuiDataGrid-toolbar': {
          padding: '16px',
          borderBottom: '1px solid #1F2937',
          backgroundColor: '#111827',
        },

        '& .MuiDataGrid-toolbarContainer': {
          padding: '16px',
          borderBottom: '1px solid #1F2937',
          backgroundColor: '#111827',
        },

        '& .MuiDataGrid-toolbar .MuiButtonBase-root': {
          color: '#94A3B8',
        },

        '& .MuiDataGrid-toolbarContainer .MuiButtonBase-root': {
          color: '#94A3B8',
        },

        '& .MuiDataGrid-toolbar .MuiButtonBase-root:hover': {
          backgroundColor: 'rgba(5, 110, 248, 0.12)',
          color: '#10C4FC',
        },

        '& .MuiDataGrid-toolbarContainer .MuiButtonBase-root:hover': {
          backgroundColor: 'rgba(5, 110, 248, 0.12)',
          color: '#10C4FC',
        },

        '& .MuiDataGrid-toolbar .MuiSvgIcon-root': {
          color: '#94A3B8',
        },

        '& .MuiDataGrid-toolbarContainer .MuiSvgIcon-root': {
          color: '#94A3B8',
        },

        '& .MuiDataGrid-columnHeaders': {
          backgroundColor: '#111827',
          color: '#94A3B8',
          borderBottom: '1px solid #1F2937',
        },

        '& .MuiDataGrid-columnHeader': {
          backgroundColor: '#111827',
          color: '#94A3B8',
          borderRight: '1px solid #1F2937',
          outline: 'none',
        },

        '& .MuiDataGrid-columnHeader:last-of-type': {
          borderRight: 'none',
        },

        '& .MuiDataGrid-columnHeader:focus': {
          outline: 'none',
        },

        '& .MuiDataGrid-columnHeader:focus-within': {
          outline: 'none',
        },

        '& .MuiDataGrid-columnHeaderTitle': {
          color: '#94A3B8',
          fontSize: 12,
          fontWeight: 800,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
        },

        '& .MuiDataGrid-cell': {
          borderBottom: '1px solid #1F2937',
          color: '#F8FAFC',
          outline: 'none',
        },

        '& .MuiDataGrid-cell:focus': {
          outline: 'none',
        },

        '& .MuiDataGrid-cell:focus-within': {
          outline: 'none',
        },

        '& .MuiDataGrid-row': {
          backgroundColor: '#0B111C',
        },

        '& .MuiDataGrid-row:hover': {
          backgroundColor: 'rgba(17, 24, 39, 0.55)',
        },

        '& .MuiDataGrid-footerContainer': {
          borderTop: '1px solid #1F2937',
          color: '#94A3B8',
          backgroundColor: '#0B111C',
        },

        '& .MuiTablePagination-root': {
          color: '#94A3B8',
        },

        '& .MuiTablePagination-selectLabel': {
          color: '#94A3B8',
        },

        '& .MuiTablePagination-displayedRows': {
          color: '#94A3B8',
        },

        '& .MuiTablePagination-select': {
          color: '#F8FAFC',
        },

        '& .MuiSvgIcon-root': {
          color: '#94A3B8',
        },

        '& .MuiDataGrid-overlay': {
          backgroundColor: '#0B111C',
          color: '#94A3B8',
        },
      }}
    />
  )
}

export default DashboardDataGrid