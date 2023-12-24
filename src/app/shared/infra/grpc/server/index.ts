import path from 'path'
import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import getProduct from '../services/get_product'
import listProducts from '../services/list_products'
import createProduct from '../services/create_product'

const PROTO_PATH = path.join(__dirname, '..', 'protos', 'product.proto')
const packageDefinition = protoLoader.loadSync(
  PROTO_PATH,
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  }
)
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition)
const proto = protoDescriptor.protos
const server = new grpc.Server()

server.addService(proto.ProductService.service, {
  getProduct,
  listProducts,
  createProduct
})
server.bindAsync('0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
  server.start()
})
