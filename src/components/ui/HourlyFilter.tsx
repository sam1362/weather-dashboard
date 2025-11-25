// Filter for time for time-seksjonen
interface HourlyFilterProps {
  value: HourFilter;
  onChange: (value: HourFilter) => void;
  darkMode?: boolean;
}

export type HourFilter = 'all' | 'cold' | 'warm' | 'precip' | 'dry';

const baseBtn =
  'rounded-full px-3 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500';

export const HourlyFilter = ({ value, onChange, darkMode = true }: HourlyFilterProps) => {
  const styles = (active: boolean) =>
    active
      ? darkMode
        ? 'bg-white text-midnight shadow-glow'
        : 'bg-teal-600 text-white shadow-glow'
      : darkMode
        ? 'bg-white/5 text-slate-200 hover:bg-white/10'
        : 'bg-slate-100 text-slate-800 hover:bg-slate-200';

  return (
    <div className="flex flex-wrap items-center gap-2" aria-label="Filter time for time">
      <button type="button" className={`${baseBtn} ${styles(value === 'all')}`} onClick={() => onChange('all')}>
        Alle
      </button>
      <button type="button" className={`${baseBtn} ${styles(value === 'cold')}`} onClick={() => onChange('cold')}>
        Kalde (≤0°C)
      </button>
      <button type="button" className={`${baseBtn} ${styles(value === 'warm')}`} onClick={() => onChange('warm')}>
        Varme (≥15°C)
      </button>
      <button type="button" className={`${baseBtn} ${styles(value === 'precip')}`} onClick={() => onChange('precip')}>
        Med nedbør
      </button>
      <button type="button" className={`${baseBtn} ${styles(value === 'dry')}`} onClick={() => onChange('dry')}>
        Uten nedbør
      </button>
    </div>
  );
};
