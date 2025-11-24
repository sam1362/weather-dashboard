import { cn } from '../../lib/utils'

interface NavLinkProps {
  label: string
  active?: boolean
  onClick?: () => void
  ariaLabel?: string
  darkMode?: boolean
  disabled?: boolean
}

export const NavLink = ({ label, active, onClick, ariaLabel, darkMode = true, disabled }: NavLinkProps) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={ariaLabel ?? label}
    aria-pressed={active}
    disabled={disabled}
    className={cn(
      'rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 disabled:opacity-50',
      active
        ? darkMode
          ? 'bg-white text-midnight shadow-glow'
          : 'bg-teal-600 text-white shadow-glow'
        : darkMode
          ? 'bg-white/5 text-slate-200 hover:bg-white/10'
          : 'bg-slate-100 text-slate-800 hover:bg-slate-200',
    )}
  >
    {label}
  </button>
)
