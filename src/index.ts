import otel from './app/shared/infra/opel'
import startApi from './app/shared/infra/http/api'

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config()

otel.start()
startApi()
