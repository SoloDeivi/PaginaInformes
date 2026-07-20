import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import cors from 'cors'
import express from 'express'
import './db.ts'
import { clientesRouter } from './routes/clientes.ts'
import { informesRouter } from './routes/informes.ts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distPath = path.join(__dirname, '..', 'dist')

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/clientes', clientesRouter)
app.use('/api/informes', informesRouter)

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath))
  app.get('/{*splat}', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'))
  })
}

const port = Number(process.env.PORT) || 4000
app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor escuchando en http://0.0.0.0:${port}`)
})
