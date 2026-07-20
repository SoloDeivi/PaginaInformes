const MAX_DIMENSION = 1600
const JPEG_QUALITY = 0.8

export const compressImageToDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file)
    const image = new Image()

    image.onload = () => {
      const scale = Math.min(1, MAX_DIMENSION / Math.max(image.width, image.height))
      const width = Math.round(image.width * scale)
      const height = Math.round(image.height * scale)

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const context = canvas.getContext('2d')
      URL.revokeObjectURL(objectUrl)

      if (!context) {
        reject(new Error('No se pudo procesar la foto en este dispositivo.'))
        return
      }

      context.drawImage(image, 0, 0, width, height)
      resolve(canvas.toDataURL('image/jpeg', JPEG_QUALITY))
    }

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('No se pudo leer la foto. Intenta con otra imagen.'))
    }

    image.src = objectUrl
  })
