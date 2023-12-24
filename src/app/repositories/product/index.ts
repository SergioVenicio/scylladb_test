import type pino from 'pino'
import { type Product, type Repository } from '../../domain/interfaces'
import type cassandra from 'cassandra-driver'
import client from '../../shared/infra/database/scylla'

interface Params {
  logger: pino.BaseLogger
}
interface ListParams {
  limit: number
}

export default class ProductReporitory implements Repository {
  private readonly logger: pino.BaseLogger
  private readonly scylla: cassandra.Client

  constructor (params: Params) {
    this.logger = params.logger
    this.scylla = client
  }

  async save (product: Product): Promise<void> {
    this.logger.info(`[productRepository] saving:${JSON.stringify(product)}`)
    await this.scylla.execute(
            `INSERT INTO products (sku, description, price, stock)
            VALUES('${product.sku}', '${product.description}', ${product.price}, ${product.stock});`
    )
  }

  async get (sku: string): Promise<Product | null> {
    const data = await this.scylla.execute(
      'SELECT sku, description, price, stock FROM products WHERE sku = ?',
      [sku],
      {
        prepare: true
      }
    )
    return data.rows.length > 0
      ? {
          sku: data.rows[0]?.sku,
          description: data.rows[0]?.description,
          price: data.rows[0]?.price,
          stock: data.rows[0]?.stock
        }
      : null
  }

  async list (params: ListParams): Promise<Product[]> {
    let { limit } = params
    if (limit <= 0) {
      limit = 100
    }
    const data = await this.scylla.execute(
      'SELECT sku, description, price, stock FROM products LIMIT ?',
      [limit],
      {
        prepare: true
      }
    )
    return data.rows.map(row => ({
      sku: row.sku,
      description: row.description,
      price: row.price,
      stock: row.stock
    }))
  }
}
