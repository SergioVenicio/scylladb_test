import type pino from 'pino'
import type amqplib from 'amqplib'

import { type Product, type Repository } from '../../domain/interfaces'
import { type Consumer } from '../interfaces'

export default class CreateProductConsumer implements Consumer {
  private readonly logger: pino.BaseLogger
  private readonly repository: Repository

  constructor (
    logger: pino.BaseLogger,
    repository: Repository
  ) {
    this.repository = repository
    this.logger = logger
  }

  async consume (msg: amqplib.Message | null): Promise<void> {
    if (msg === null) {
      return
    }

    const product = JSON.parse(msg.content.toString())
    this.logger.info(`[products.create.consumer] received ${JSON.stringify(product)}`)
    await this.repository.save(product as Product)
  }
}
