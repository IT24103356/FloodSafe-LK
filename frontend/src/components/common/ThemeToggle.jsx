import { Laptop, Moon, Sun } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext.jsx'

const options = [
  { value: 'light', label: 'Light', Icon: Sun },
  { value: 'dark', label: 'Dark', Icon: Moon },
  { value: 'system', label: 'System', Icon: Laptop },
]

export default function ThemeToggle({ compact = false }) {
  const { theme, setTheme } = useTheme()

  if (compact) {
    const currentIndex = options.findIndex((option) => option.value === theme)
    const next = options[(currentIndex + 1) % options.length]
    const CurrentIcon = options[currentIndex]?.Icon || Laptop
    return (
      <button
        type="button"
        className="theme-toggle-compact"
        onClick={() => setTheme(next.value)}
        aria-label={`Theme: ${theme}. Switch to ${next.label}.`}
        title={`Theme: ${theme}`}
      >
        <CurrentIcon size={18} aria-hidden="true" />
      </button>
    )
  }

  return (
    <div className="theme-switcher" role="group" aria-label="Color theme">
      {options.map(({ value, label, Icon }) => (
        <button
          key={value}
          type="button"
          className={theme === value ? 'active' : ''}
          onClick={() => setTheme(value)}
          aria-pressed={theme === value}
          title={`${label} theme`}
        >
          <Icon size={15} aria-hidden="true" />
          <span>{label}</span>
        </button>
      ))}
    </div>
  )
}
