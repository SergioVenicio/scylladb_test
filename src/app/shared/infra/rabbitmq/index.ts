import amqplib from 'amqplib'
import dotenv from 'dotenv'
dotenv.config()

class RabbitMQ {
  private readonly server_url: string

  constructor () {
    this.server_url = String(process.env.RABBITMQ_URL)
  }

  async connect (): Promise<amqplib.Connection> {
    return await amqplib.connect(this.server_url)
  }

  async channel (): Promise<amqplib.Channel> {
    const conn = await this.connect()
    return await conn.createChannel()
  }
}

class RabbitMQBroker {
  private readonly client: RabbitMQ
  private readonly exchange: string
  constructor (exchange: string) {
    this.client = new RabbitMQ()
    this.exchange = exchange
  }

  async send (queue: string, routingKey: string, data: any): Promise<void> {
    const chan = await this.client.channel()
    await chan.assertExchange(this.exchange, 'topic', { durable: true })
    await chan.assertQueue(queue, {
      durable: true,
      exclusive: false
    })
    await chan.bindQueue(queue, this.exchange, routingKey)
    const msg = JSON.stringify({ ...data })
    chan.sendToQueue(queue, Buffer.from(msg))
  }
}

export { RabbitMQ, RabbitMQBroker }
