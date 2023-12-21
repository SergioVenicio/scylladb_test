import amqplib from "amqplib"

export interface Consumer {
    consume(msg: amqplib.Message|null): Promise<any>
}