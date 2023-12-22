import express, { type Request, type Response } from 'express'
import pino from 'pino'

import ProductController from '../../../../controllers/product'
import { RabbitMQBroker } from '../../rabbitmq'
import ProductReporitory from '../../../../repositories/product'
import { DomainError } from '../../../../errors'

const logger = pino({
  name: 'api'
})

const router = express.Router()

const productCreateUpdateExchange = String(process.env.PRODUCT_CREATE_EXCHANGE)
const productBroker = new RabbitMQBroker(productCreateUpdateExchange)
const productController = new ProductController({ logger, broker: productBroker })
const productRepository = new ProductReporitory({ logger })

router.get('/', async (req: Request, res: Response) => {
  const { limit = 100 } = req?.query
  const products = await productRepository.list({
    limit: Number(limit)
  })
  res.status(200).json({
    products
  })
})

router.get('/:sku', async (req: Request, res: Response) => {
  const { sku } = req?.params
  if (String(sku) === '') {
    throw new DomainError('sku param is required!')
  }
  const product = await productRepository.get(sku)
  if (product === null) {
    res.status(404).json()
    return
  }

  res.status(200).json({
    product
  })
})

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
