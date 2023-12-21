import cassandra from 'cassandra-driver'
import dotenv from 'dotenv'
dotenv.config()
const { SCYLLA_DB_ADDR, SCYLLA_PRODUCT_KEYSPACE } = process.env

const client = new cassandra.Client({
  contactPoints: String(SCYLLA_DB_ADDR).split(','),
  credentials: { username: '', password: '' },
  localDataCenter: 'DC1',
  keyspace: SCYLLA_PRODUCT_KEYSPACE
})

export default client
