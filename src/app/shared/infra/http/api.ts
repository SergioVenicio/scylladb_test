import dotenv from 'dotenv'

import express from 'express'
import pino from 'pino'

import router from './routes'
import errorHandler from './errorHandler'
import pinoExpress from 'express-pino-logger'
dotenv.config()

require('express-async-errors')

const api = express()
api.use(express.json())
api.use(router)
api.use(pinoExpress)
api.use(errorHandler)

const port = (process.env.PORT != null) || 5000

const logger = pino({
  name: 'api'
})

const startApi = (): void => {
  api.listen(port, () => {
    logger.info(`[api] running on :${port}`)
  })
}

export default startApi
