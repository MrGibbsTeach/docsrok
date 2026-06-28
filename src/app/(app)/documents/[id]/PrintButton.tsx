'use client'

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 bg-orange-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-orange-700 transition-colors"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
        <path fillRule="evenodd" d="M5 2.75C5 1.784 5.784 1 6.75 1h6.5c.966 0 1.75.784 1.75 1.75v3.552c.377.046.752.097 1.126.153A2.25 2.25 0 0 1 18 8.7v4.55a2.25 2.25 0 0 1-2.25 2.25h-.5a.75.75 0 0 1-.75-.75v-2.5a.75.75 0 0 0-.75-.75h-7.5a.75.75 0 0 0-.75.75v2.5a.75.75 0 0 1-.75.75h-.5A2.25 2.25 0 0 1 2 13.25V8.7a2.25 2.25 0 0 1 1.874-2.215c.374-.056.749-.107 1.126-.153V2.75Zm4.75 5.75a.75.75 0 0 0 0 1.5h.5a.75.75 0 0 0 0-1.5h-.5ZM6.75 2.5a.25.25 0 0 0-.25.25v3.401l7-.001V2.75a.25.25 0 0 0-.25-.25h-6.5ZM7 15.25v2.25h6v-2.25a.25.25 0 0 0-.25-.25h-5.5a.25.25 0 0 0-.25.25Z" clipRule="evenodd" />
      </svg>
      Print / Save as PDF
    </button>
  )
}
