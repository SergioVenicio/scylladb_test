import type pino from 'pino'
import { type Product } from '../../domain/interfaces'
import ProductModel from '../../domain/models/product'
import { type RabbitMQBroker } from '../../shared/infra/rabbitmq'
import { InfraError } from '../../errors'

interface Params {
  broker: RabbitMQBroker
  logger: pino.BaseLogger
}

export default class ProductController {
  private readonly broker: RabbitMQBroker
  private readonly logger: pino.BaseLogger

  constructor (params: Params) {
    this.logger = params.logger
    this.broker = params.broker
  }

  async requestProductCreation (product: Product): Promise<void> {
    this.logger.debug(`[product] creating ${JSON.stringify(product)}`)
    const newProduct = new ProductModel(product)
    await this.sendRequest(newProduct)
  }

  private async sendRequest (product: Product): Promise<void> {
    const topic = String(process.env.PRODUCT_CREATE_TOPIC)
    const routingKey = String(process.env.PRODUCT_CREATE_TOPIC_ROUTING_KEY)
    try {
      await this.broker.send(topic, routingKey, product)
    } catch (e: Error | unknown) {
      this.logger.error((e as Error).message)
      throw new InfraError((e as Error).message)
    }
  }
}
