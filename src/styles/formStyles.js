
/**
 * Estilos compartidos para los campos de los formularios
 * administrativos de MesaFlow.
 */
export const textFieldStyles = {
  '& .MuiOutlinedInput-root': {
    color: '#F8FAFC',
    backgroundColor: '#03070F',
    borderRadius: '14px',

    '& fieldset': {
      borderColor: '#1F2937',
    },

    '&:hover fieldset': {
      borderColor: 'rgba(5, 110, 248, 0.6)',
    },

    '&.Mui-focused fieldset': {
      borderColor: '#10C4FC',
    },

    '&.Mui-disabled': {
      backgroundColor: '#111827',
    },

    '&.Mui-disabled fieldset': {
      borderColor: '#1F2937',
    },
  },

  '& .MuiInputBase-input.Mui-disabled': {
    WebkitTextFillColor: '#94A3B8',
    opacity: 1,
  },

  '& .MuiSelect-select.Mui-disabled': {
    WebkitTextFillColor: '#94A3B8',
    opacity: 1,
  },

  '& .MuiInputLabel-root': {
    color: '#94A3B8',
  },

  '& .MuiInputLabel-root.Mui-focused': {
    color: '#10C4FC',
  },

  '& .MuiInputLabel-root.Mui-disabled': {
    color: '#64748B',
  },

  '& .MuiFormHelperText-root': {
    color: '#94A3B8',
  },

  '& .MuiSvgIcon-root': {
    color: '#94A3B8',
  },

  '& .MuiSvgIcon-root.Mui-disabled': {
    color: '#64748B',
  },
}

/**
 * Estilos del menú desplegable de los Select de MUI.
 */
export const selectSlotProps = {
  select: {
    MenuProps: {
      slotProps: {
        paper: {
          sx: {
            backgroundColor: '#0B111C',
            color: '#F8FAFC',
            border: '1px solid #1F2937',
            borderRadius: '16px',

            '& .MuiMenuItem-root:hover': {
              backgroundColor: '#111827',
            },

            '& .MuiMenuItem-root.Mui-selected': {
              backgroundColor: 'rgba(5, 110, 248, 0.18)',
            },

            '& .MuiMenuItem-root.Mui-selected:hover': {
              backgroundColor: 'rgba(5, 110, 248, 0.25)',
            },
          },
        },
      },
    },
  },
}
