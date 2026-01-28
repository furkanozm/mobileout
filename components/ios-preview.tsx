import type React from "react"

interface IOSPreviewProps {
  children: React.ReactNode
  showStatusBar?: boolean
  showHomeIndicator?: boolean
  showNotch?: boolean
  backgroundColor?: string
}

export function IOSPreview({
  children,
  showStatusBar = true,
  showHomeIndicator = true,
  showNotch = true,
  backgroundColor = "white",
}: IOSPreviewProps) {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="relative w-[375px] h-[812px] bg-white rounded-[40px] shadow-xl overflow-hidden border-4 border-gray-800">
        {/* Notch */}
        {showNotch && (
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[150px] h-[30px] bg-black rounded-b-[14px] z-10"></div>
        )}

        {/* Status Bar */}
        {showStatusBar && (
          <div className="absolute top-0 left-0 right-0 h-[44px] px-6 flex justify-between items-center z-[5]">
            <div className="text-sm font-medium">9:41</div>
            <div className="flex items-center space-x-1">
              <div className="w-4 h-4">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div className="w-4 h-4">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div className="w-6 h-3 bg-black rounded-sm"></div>
            </div>
          </div>
        )}

        {/* Content */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ backgroundColor, paddingTop: showStatusBar ? "44px" : "0" }}
        >
          {children}
        </div>

        {/* Home Indicator */}
        {showHomeIndicator && (
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-[134px] h-[5px] bg-black rounded-full"></div>
        )}
      </div>
    </div>
  )
}

