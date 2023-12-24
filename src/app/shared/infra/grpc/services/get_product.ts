import pino from 'pino'
import ProductReporitory from '../../../../repositories/product'
import { DomainError } from '../../../../errors'

const logger = pino({
  name: 'GrpcGetProduct'
})
const reporitory = new ProductReporitory({ logger })

const getProduct = (call: any, callback: any): void => {
  const sku = call?.request?.sku as string
  if (sku === '') {
    throw new DomainError('sku param is required!')
  }

  reporitory.get(sku).then(product => {
    if (product === null) {
      throw new DomainError('sku not found!')
    } else {
      callback(null, {
        sku: product.sku,
        description: product.description,
        price: Number(product.price),
        stock: Number(product.stock)
      })
    }
  }).catch(e => {
    callback(e, null)
  })
}

export default getProduct
