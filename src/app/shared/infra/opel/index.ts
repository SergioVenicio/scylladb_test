import { NodeSDK } from '@opentelemetry/sdk-node'
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http'
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express'
import { AmqplibInstrumentation } from '@opentelemetry/instrumentation-amqplib'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto'
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus'

const otel = new NodeSDK({
  traceExporter: new OTLPTraceExporter(),
  metricReader: new PrometheusExporter(),
  instrumentations: [
    getNodeAutoInstrumentations(),
    new HttpInstrumentation(),
    new ExpressInstrumentation(),
    new AmqplibInstrumentation()
  ],
  serviceName: 'product_api'
})

export default otel
