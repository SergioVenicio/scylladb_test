import ProductController from '../../app/controllers/product'
import { InfraError } from '../../app/errors'
import { RabbitMQBroker } from '../../app/shared/infra/rabbitmq'
import pino from 'pino'
jest.mock('../../app/shared/infra/rabbitmq')

describe('product controller', () => {
  const logger = pino()
  const broker = new RabbitMQBroker('fake-exchange')
  const controller = new ProductController({ logger, broker })

  beforeEach(() => {
    jest.resetModules()
    process.env = {
      PRODUCT_CREATE_TOPIC: 'PRODUCT.CREATE',
      PRODUCT_CREATE_TOPIC_ROUTING_KEY: 'PRODUCT'
    }
  })

  test('should be able to request a product creation', async () => {
    await controller.requestProductCreation({
      sku: 'fake',
      description: 'fake',
      price: 10,
      stock: 1
    })
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(broker.send).toHaveBeenCalledWith('PRODUCT.CREATE', 'PRODUCT', { description: 'fake', price: 10, sku: 'fake', stock: 1 })
  })

  test('should throw a infra error', async () => {
    (broker.send as jest.Mock).mockImplementation(() => {
      throw new Error()
    })

    await expect(async () => {
      await controller.requestProductCreation({
        sku: 'fake',
        description: 'fake',
        price: 10,
        stock: 1
      })
    }).rejects.toThrow(InfraError)
  })
})
