export function formatAge(mins: number): string {
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins} min ago`
  const h = Math.floor(mins / 60)
  return h === 1 ? '1 hr ago' : `${h} hrs ago`
}
