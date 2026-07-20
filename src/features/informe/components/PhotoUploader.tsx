import { useRef } from 'react'
import { MAX_PHOTOS } from '@/features/informe/constants'
import type { ReportPhoto } from '@/features/informe/types'

interface PhotoUploaderProps {
  fotos: ReportPhoto[]
  onAddPhoto: (file: File) => void
  onRemovePhoto: (id: string) => void
  isProcessing?: boolean
  error?: string | null
}

export const PhotoUploader = ({ fotos, onAddPhoto, onRemovePhoto, isProcessing, error }: PhotoUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canAddMore = fotos.length < MAX_PHOTOS && !isProcessing

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0]
    if (file) onAddPhoto(file)
    event.target.value = ''
  }

  return (
    <div className="flex flex-col gap-3">
      <span className="text-sm font-medium text-slate-700">
        Fotografías del equipo ({fotos.length}/{MAX_PHOTOS})
      </span>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {fotos.map((photo) => (
          <div key={photo.id} className="relative overflow-hidden rounded-md border border-slate-200">
            <img src={photo.dataUrl} alt={photo.name} className="h-48 w-full object-cover" />
            <button
              type="button"
              onClick={() => onRemovePhoto(photo.id)}
              className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-1 text-xs font-medium text-white hover:bg-black/80"
            >
              Quitar
            </button>
          </div>
        ))}

        {canAddMore ? (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex h-48 flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-slate-300 text-slate-500 transition hover:border-sky-400 hover:text-sky-600"
          >
            <span className="text-2xl">+</span>
            <span className="text-sm">Subir o capturar foto</span>
          </button>
        ) : null}

        {isProcessing ? (
          <div className="flex h-48 flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-slate-200 text-slate-400">
            <span className="text-sm">Optimizando foto...</span>
          </div>
        ) : null}
      </div>

      {error ? <p className="text-sm text-red-500">{error}</p> : null}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  )
}
