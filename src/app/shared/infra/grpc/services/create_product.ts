import dotenv from 'dotenv'
import pino from 'pino'
import { RabbitMQBroker } from '../../rabbitmq'
import ProductController from '../../../../controllers/product'
import { DomainError } from '../../../../errors'
import { type Product } from '../../../../domain/interfaces'

const productCreateUpdateExchange = String(process.env.PRODUCT_CREATE_EXCHANGE)
const productBroker = new RabbitMQBroker(productCreateUpdateExchange)

dotenv.config()

const logger = pino({
  name: 'GrpcListProducts'
})
const controller = new ProductController({ logger, broker: productBroker })

const validRequiredFields = (data: Product): boolean => {
  const requiredField = [
    'sku', 'description', 'stock', 'price'
  ]
  for (const field of requiredField) {
    const hasField = Object.prototype.hasOwnProperty.call(Object(data), field)
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!hasField || !(Object(data)[field])) {
      throw new DomainError(`field is required: ${field}`)
    }
  }

  return true
}

const createProduct = (call: any, callback: any): void => {
  validRequiredFields(call?.request as Product)
  let { sku = '', description = '', stock = 0, price = 0 } = call?.request
  sku = String(sku)
  description = String(description)
  stock = Number(stock)
  price = Number(price)
  controller.requestProductCreation({ sku, description, stock, price }).then(() => {
    callback(null, { created: true })
  }).catch(e => {
    if (e instanceof DomainError) {
      callback(e, {})
    } else {
      logger.warn(e)
      callback(new Error('internal server error'), {})
    }
  })
}

export default createProduct
