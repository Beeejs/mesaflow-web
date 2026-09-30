
export const hasFormChanges = (original, current, fields) => {
  return fields.some((field) => {
    const originalValue = String(original[field] ?? '').trim()
    const currentValue = String(current[field] ?? '').trim()

    return originalValue !== currentValue
  })
}