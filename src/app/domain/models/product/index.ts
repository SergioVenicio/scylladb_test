import Ajv, { type JSONSchemaType } from 'ajv'

import { type Product } from '../../interfaces'
import { DomainError } from '../../../errors'
import { error } from 'ajv/dist/vocabularies/applicator/dependencies'

const ajv = new Ajv()

const schema: JSONSchemaType<Product> = {
  type: 'object',
  properties: {
    sku: { type: 'string' },
    description: { type: 'string' },
    price: { type: 'number' },
    stock: { type: 'number' }
  },
  required: ['sku', 'description', 'price', 'stock']
}
const validate = ajv.compile(schema)
const parseError = (error: any) => {
  const field = error?.instancePath.replace('/', '')
  return `${field}: ${error.message}`
}

export default class ProductModel {
  sku: string
  description: string
  price: number
  stock: number

  constructor (data: Product) {
    if (!validate(data)) {
      const msg = (validate.errors != null) ? parseError(validate.errors[0]) : ''
      throw new DomainError(msg)
    }
    this.sku = data.sku
    this.description = data.description
    this.price = data.price
    this.stock = data.stock
  }
}
