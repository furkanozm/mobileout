interface StatusBarProps {
  isAuthScreen?: boolean
}

export function StatusBar({ isAuthScreen = false }: StatusBarProps) {
  return (
    <div className="relative bg-white">
      {/* Notch shape */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[30px] w-[167px] bg-black rounded-b-[20px]" />

      {/* Status bar content */}
      <div
        className={`relative z-10 px-5 pt-[0.7rem] pb-[0.3rem] flex justify-between items-center text-black ${isAuthScreen ? "bg-sky-50" : ""}`}
      >
        {/* Left side - Time */}
        <div className="text-[14px] font-semibold ml-2">9:41</div>

        {/* Right side - Status icons */}
        <div className="flex items-center gap-2 mr-0.5">
          {/* Cellular signal */}
          <svg viewBox="0 0 18 12" className="h-4 w-4" fill="currentColor">
            <path d="M16 0h-2v12h2V0zm-4 3h-2v9h2V3zm-4 3h-2v6h2V6zM4 9H2v3h2V9z" />
          </svg>
          {/* WiFi */}
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
            <path d="M12 21.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm4.5-6.5c0-.32-.05-.63-.14-.92-.1-.3-.24-.58-.43-.83a4.02 4.02 0 00-2.42-1.67 3.99 3.99 0 00-4.1.83 4.02 4.02 0 00-.91 1.67A4 4 0 008.36 15h2.12c.07-.31.21-.6.41-.84.21-.24.47-.43.77-.55.3-.13.62-.19.95-.19.33 0 .65.06.95.19.3.12.56.31.77.55.2.24.34.53.41.84h2.12c-.05-.32-.13-.63-.24-.92zM12 10c1.94 0 3.7.79 4.95 2.05l1.42-1.42A8.46 8.46 0 0012 8a8.46 8.46 0 00-6.37 2.63l1.42 1.42A6.46 6.46 0 0112 10zm0-4c3.07 0 5.85 1.24 7.85 3.26l1.42-1.42A12.32 12.32 0 0012 4c-3.39 0-6.45 1.37-8.69 3.58L4.73 9A10.32 10.32 0 0112 6z" />
          </svg>
          {/* Battery */}
          <div className="flex items-center">
            <svg viewBox="0 0 25 12" className="h-4 w-6" fill="currentColor">
              <rect x="0.5" y="0.5" width="21" height="11" rx="2.5" stroke="currentColor" fill="none" />
              <rect x="2" y="2" width="18" height="8" rx="1.5" />
              <rect x="23" y="4" width="2" height="4" rx="1" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}

