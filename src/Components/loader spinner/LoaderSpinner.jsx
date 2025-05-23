import React from 'react'

export default function LoaderSpinner({ child }) {
  return (
    <div>
        <div className="flex items-center gap-2 text-main">
    <svg className="animate-spin h-5 w-5 text-main" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
    </svg>
    <p>{child}</p>
  </div>
    </div>
  )
}
