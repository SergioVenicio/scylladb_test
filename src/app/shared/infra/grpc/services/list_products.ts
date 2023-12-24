import pino from 'pino'
import ProductReporitory from '../../../../repositories/product'

const logger = pino({
  name: 'GrpcListProducts'
})
const reporitory = new ProductReporitory({ logger })

const listProducts = (call: any, callback: any): void => {
  const { limit = 100 } = call.request
  reporitory.list({ limit: limit as number }).then(products => {
    const response = {
      products: products.map(product => ({
        sku: product.sku,
        description: product.description,
        price: Number(product.price),
        stock: Number(product.stock)
      }))
    }
    callback(null, response)
  }).catch(e => {
    callback(e, null)
  })
}

export default listProducts
