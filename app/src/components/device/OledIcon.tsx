"use client"

type IconName =
  | "key"
  | "note"
  | "gear"
  | "info"
  | "lock"
  | "lock-closed"
  | "shield-key"
  | "cloud"
  | "trash"
  | "check"
  | "alert"

interface OledIconProps {
  name: IconName
  size?: number
  className?: string
  strokeWidth?: number
}

const PATHS: Record<IconName, (sw: number) => React.ReactElement> = {
  key: (sw) => (
    <g fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="14" r="3.5" />
      <path d="M11.2 12.6 L20 4" />
      <path d="M16.5 7.5 L19 10" />
      <path d="M14 10 L16 12" />
    </g>
  ),
  note: (sw) => (
    <g fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 4 H17 L19 6 V20 H5 Z" />
      <path d="M8 9 H16" />
      <path d="M8 13 H16" />
      <path d="M8 17 H13" />
    </g>
  ),
  gear: (sw) => (
    <g fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2.5 V5 M12 19 V21.5 M2.5 12 H5 M19 12 H21.5 M5.2 5.2 L7 7 M17 17 L18.8 18.8 M5.2 18.8 L7 17 M17 7 L18.8 5.2" />
    </g>
  ),
  info: (sw) => (
    <g fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11 V16.5" />
      <circle cx="12" cy="8" r="0.8" fill="currentColor" stroke="none" />
    </g>
  ),
  lock: (sw) => (
    <g fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="11" width="14" height="10" rx="1.5" />
      <path d="M8 11 V7.5 a4 4 0 0 1 8 0 V11" />
      <circle cx="12" cy="16" r="1.2" fill="currentColor" stroke="none" />
    </g>
  ),
  "lock-closed": (sw) => (
    <g fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="11" width="14" height="10" rx="1.5" />
      <path d="M8 11 V7.5 a4 4 0 0 1 8 0 V11" />
      <path d="M12 15 V17.5" />
    </g>
  ),
  "shield-key": (sw) => (
    <g fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3 L4 6 V12 c0 5 3.4 8.4 8 9 4.6-0.6 8-4 8-9 V6 Z" />
      <circle cx="10" cy="13" r="1.8" />
      <path d="M11.4 12.4 L15 9" />
      <path d="M13.5 10.5 L14.5 11.5" />
    </g>
  ),
  cloud: (sw) => (
    <g fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 17 a4 4 0 0 1 0.6-7.95 A5.5 5.5 0 0 1 18 11 a3.5 3.5 0 0 1 -0.5 6.97 Z" />
    </g>
  ),
  trash: (sw) => (
    <g fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 7 H19.5" />
      <path d="M9 7 V5 a1 1 0 0 1 1-1 H14 a1 1 0 0 1 1 1 V7" />
      <path d="M6 7 L7 20 a1 1 0 0 0 1 1 H16 a1 1 0 0 0 1-1 L18 7" />
      <path d="M10 11 V17 M14 11 V17" />
    </g>
  ),
  check: (sw) => (
    <g fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12.5 L10 17.5 L19 7" />
    </g>
  ),
  alert: (sw) => (
    <g fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3 L21.5 20 H2.5 Z" />
      <path d="M12 10 V14.5" />
      <circle cx="12" cy="17.5" r="0.9" fill="currentColor" stroke="none" />
    </g>
  ),
}

export function OledIcon({ name, size = 14, className, strokeWidth = 1.6 }: OledIconProps) {
  const render = PATHS[name]
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      style={{ display: "inline-block", flexShrink: 0 }}
      aria-hidden="true"
    >
      {render(strokeWidth)}
    </svg>
  )
}
