import CreateProductConsumer from '../../app/consumers/product/create'
import pino from 'pino'
import { type Message } from 'amqplib'
import ProductReporitory from '../../app/repositories/product'

jest.mock('../../app/shared/infra/rabbitmq')
jest.mock('../../app/shared/infra/database/scylla')
jest.mock('../../app/repositories/product')

describe('product create and update consumer', () => {
  const logger = pino()
  const repository = new ProductReporitory({
    logger
  })
  const consumer = new CreateProductConsumer(logger, repository)

  beforeEach(() => {
    jest.resetModules()
    process.env = {
      PRODUCT_CREATE_TOPIC: 'PRODUCT.CREATE',
      PRODUCT_CREATE_TOPIC_ROUTING_KEY: 'PRODUCT'
    }
  })

  test('should discart a empty message', async () => {
    await consumer.consume(null)
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(repository.save).toHaveBeenCalledTimes(0)
  })

  test('should be able to consumer a message', async () => {
    const message = {
      content: Buffer.from(JSON.stringify({
        content: {
          sku: 'fake',
          description: 'fake',
          price: 10,
          stock: 1
        },
        fields: {},
        properties: {}
      }))
    }
    await consumer.consume(message as Message)
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(repository.save).toHaveBeenCalledTimes(1)
  })
})
