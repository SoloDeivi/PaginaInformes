import type { ReactNode } from 'react'

interface FieldProps {
  label: string
  htmlFor?: string
  required?: boolean
  children: ReactNode
}

export const Field = ({ label, htmlFor, required, children }: FieldProps) => {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-slate-700">
        {label}
        {required ? <span className="text-red-500"> *</span> : null}
      </label>
      {children}
    </div>
  )
}
