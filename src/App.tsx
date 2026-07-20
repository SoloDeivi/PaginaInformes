import { useState } from 'react'
import { InformesList } from '@/features/informes/components/InformesList'
import { ReportForm } from '@/features/informe/components/ReportForm'

type View = 'nuevo' | 'informes'

export const App = () => {
  const [view, setView] = useState<View>('nuevo')

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="flex justify-center gap-2 border-b border-slate-200 bg-white px-4 py-3">
        <button
          type="button"
          onClick={() => setView('nuevo')}
          className={`rounded-md px-4 py-2 text-sm font-medium transition ${
            view === 'nuevo' ? 'bg-sky-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Nuevo informe
        </button>
        <button
          type="button"
          onClick={() => setView('informes')}
          className={`rounded-md px-4 py-2 text-sm font-medium transition ${
            view === 'informes' ? 'bg-sky-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Informes
        </button>
      </nav>
      {view === 'nuevo' ? <ReportForm /> : <InformesList />}
    </div>
  )
}
