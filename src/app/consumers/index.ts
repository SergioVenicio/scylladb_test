import dotenv from 'dotenv'

import pino from 'pino'
import { program } from 'commander'
import { RabbitMQ } from '../shared/infra/rabbitmq'
import ProductRepository from '../repositories/product'
import CreateProductConsumer from './product/create'
import { type Consumer } from './interfaces'
import type amqplib from 'amqplib'
dotenv.config()

function productCreateOrUpdate (): Consumer {
  const logger = pino({
    name: 'products.create.consumer'
  })
  const repository = new ProductRepository({ logger })
  return new CreateProductConsumer(logger, repository)
}
async function run (exchange: string, queue: string, consumer: Consumer): Promise<void> {
  const rabbitmq = new RabbitMQ()
  const chan = await rabbitmq.channel()
  await chan.assertExchange(exchange, 'topic', { durable: true })
  await chan.assertQueue(queue, {
    durable: true,
    exclusive: false
  })
  await chan.bindQueue(queue, exchange, 'CREATE')
  try {
    await chan.consume(queue, async (msg) => {
      await consumer.consume(msg)
      chan.ack(msg as amqplib.Message)
    }, { noAck: false })
  } catch (e) {
    pino({
      name: 'consumers'
    }).error(e)
  }
}

interface configData {
  exchange: string
  queue: string
  consumer: Consumer
}
const consumersConfig: Record<string, configData> = {
  product_create_update: {
    exchange: String(process.env.PRODUCT_CREATE_EXCHANGE),
    queue: String(process.env.PRODUCT_CREATE_TOPIC),
    consumer: productCreateOrUpdate()
  }
}

program.command('consume')
  .argument('<name>', 'consumer name')
  .action(async (name) => {
    if (consumersConfig[name] === undefined) {
      throw new Error('invalid consumer name')
    }

    const config = consumersConfig[name]
    await run(config.exchange, config.queue, config.consumer)
  })
program.parse()
