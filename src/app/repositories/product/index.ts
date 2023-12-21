import type pino from 'pino'
import { type Product, type Repository } from '../../domain/interfaces'
import type cassandra from 'cassandra-driver'
import client from '../../shared/infra/database/scylla'
interface Params {
  logger: pino.BaseLogger
}

export default class ProductReporitory implements Repository {
  private readonly logger: pino.BaseLogger
  private readonly scylla: cassandra.Client

  constructor (params: Params) {
    this.logger = params.logger
    this.scylla = client
  }

  async save (product: Product): Promise<void> {
    this.logger.info(JSON.stringify(product))
    await this.scylla.execute(
            `INSERT INTO products (sku, description, price, stock)
            VALUES('${product.sku}', '${product.description}', ${product.price}, ${product.stock});`
    )
  }
}
