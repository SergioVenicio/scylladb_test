import express, { type Request, type Response } from 'express'
import pino from 'pino'

import ProductController from '../../../../controllers/product'
import { RabbitMQBroker } from '../../rabbitmq'

const logger = pino({
  name: 'api'
})

const router = express.Router()

const productCreateUpdateExchange = String(process.env.PRODUCT_CREATE_EXCHANGE)
const productBroker = new RabbitMQBroker(productCreateUpdateExchange)
const productController = new ProductController({ logger, broker: productBroker })

router.post('/', async (req: Request, res: Response) => {
  logger.info(`[api] received req:${JSON.stringify(req.body)}`)
  const { sku, description, price, stock } = req.body
  await productController.requestProductCreation({ sku, description, price, stock })
  res.status(201).json({})
})

router.put('/', async (req: Request, res: Response) => {
  logger.info(`[api] received req:${JSON.stringify(req.body)}`)
  const { sku, description, price, stock } = req.body
  await productController.requestProductCreation({ sku, description, price, stock })
  res.status(200).json({})
})
export default router
