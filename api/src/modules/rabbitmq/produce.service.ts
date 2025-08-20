import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { Channel } from 'amqplib';

@Injectable()
export class ProducerService {
  private channelWrapper: ChannelWrapper;
  private readonly logger = new Logger(ProducerService.name);

  constructor() {
    const rabbitmqUrl = `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`;

    this.logger.log(
      ` Producer conectando em: ${rabbitmqUrl.replace(/:([^@]+)@/, ':****@')}`,
    );

    const connection = amqp.connect([rabbitmqUrl]);

    this.channelWrapper = connection.createChannel({
      setup: async (channel: Channel) => {
        await Promise.all([
          channel.assertQueue('fila.notificacao.entrada.kaua', {
            durable: true,
          }),
          channel.assertQueue('fila.notificacao.status.kaua', {
            durable: true,
          }),
        ]);
        this.logger.log(' Filas do Producer verificadas');
      },
    });
  }


  async addToQueue<T>(queue: string, data: T) {
    try {
      await this.channelWrapper.sendToQueue(
        queue,
        Buffer.from(JSON.stringify(data)),
        { persistent: true },
      );
      this.logger.log(`Mensagem enviada para a fila: ${queue}`);
    } catch (error) {
      this.logger.error(`Erro ao enviar mensagem: ${error.message}`);
      throw new HttpException(
        'Error adding message to queue',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async consumeFromQueue(queue: string, onMessage: (msg: any) => void) {
    if (!this.channelWrapper) {
      const mensagemErro = 'Canal do RabbitMQ não foi inicializado.';
      this.logger.error(mensagemErro);
      throw new Error(mensagemErro);
    }

    try {
      await this.channelWrapper.consume(queue, async (msg) => {
        if (!msg) return;

        try {
          const conteudo = JSON.parse(msg.content.toString());
          await onMessage(conteudo);
          this.channelWrapper.ack(msg);
          this.logger.log(
            `Mensagem processada com sucesso da fila "${queue}".`,
          );
        } catch (erroProcessamento) {
          this.logger.error(
            `Erro ao processar mensagem da fila "${queue}":`,
            erroProcessamento.message,
          );
          this.channelWrapper.nack(msg, false, false);
        }
      });
    } catch (erroConsumo) {
      this.logger.error(
        `Erro ao iniciar consumo da fila "${queue}":`,
        erroConsumo.message,
      );
      throw new Error(`Erro ao iniciar o consumo da fila "${queue}".`);
    }
  }
}
