import ProductReporitory from '../../app/repositories/product'
import client from '../../app/shared/infra/database/scylla'
import pino from 'pino'
jest.mock('../../app/shared/infra/database/scylla')

describe('product repository', () => {
  const logger = pino()
  const repository = new ProductReporitory({ logger })

  beforeEach(() => {
    jest.resetModules()
  })

  test('shold be able to save a product', async () => {
    await repository.save({
      sku: 'test',
      description: 'test',
      price: 10,
      stock: 1
    })
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(client.execute).toHaveBeenCalledWith(
        `INSERT INTO products (sku, description, price, stock)
            VALUES('test', 'test', 10, 1);`
    )
  })

  test('shold be able to list products', async () => {
    const expected = {
      sku: 'test',
      description: 'test',
      price: 10,
      stock: 1
    }
    const mockedClient = jest.spyOn(client, 'execute')
    mockedClient.mockImplementation(() => {
      return { rows: [expected] }
    })
    const products = await repository.list({ limit: 100 })
    expect(products.length).toBe(1)
    expect(products[0]).toEqual(expected)
  })

  test('shold be able to get a product by sku', async () => {
    const expected = {
      sku: 'test',
      description: 'test',
      price: 10,
      stock: 1
    }
    const mockedClient = jest.spyOn(client, 'execute')
    mockedClient.mockImplementationOnce(() => {
      return { rows: [expected] }
    })
    const product = await repository.get('test')
    expect(product).toEqual(expected)
  })

  test('should return null if sku does not exists', async () => {
    const mockedClient = jest.spyOn(client, 'execute')
    mockedClient.mockImplementationOnce(() => {
      return { rows: [] }
    })
    const productNotFound = await repository.get('test-123')
    expect(productNotFound).toBeNull()
  })
})
