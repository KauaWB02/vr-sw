import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { StorageService } from 'src/shared/storage/service.storage';
import { NotificationInterface } from './interface/notification.interface';
import { ProducerService } from '../rabbitmq/produce.service';

@Injectable()
export class NotificationsService implements OnModuleInit {
  private readonly logger = new Logger(NotificationsService.name);
  constructor(
    private readonly storageService: StorageService,
    private readonly producerService: ProducerService,
  ) {}

  async onModuleInit() {
    try {
      await this.initConsumer();
    } catch (error) {
      this.logger.error(
        'Erro ao inicializar módulo NotificationService',
        error,
      );
    }
  }

  async getAllNotifications(): Promise<NotificationInterface[]> {
    return this.storageService.getAll();
  }

  async createNotification(body: {
    mensagemId: string;
    conteudoMensagem: string;
  }): Promise<{
    message: string;
    mensagem: NotificationInterface | undefined;
  }> {
    const { mensagemId, conteudoMensagem } = body;

    this.storageService.set(mensagemId, {
      mensagemId: mensagemId,
      conteudoMensagem,
      status: 'PROCESSANDO',
    });

    await this.producerService.addToQueue<NotificationInterface>(
      'fila.notificacao.entrada.kaua',
      {
        mensagemId,
        conteudoMensagem,
        status: 'PROCESSANDO',
      },
    );

    return {
      message: 'Notification created successfully',
      mensagem: this.storageService.get(mensagemId),
    };
  }

  private async initConsumer() {
    try {
      await this.producerService.consumeFromQueue(
        'fila.notificacao.entrada.kaua',
        async (msg) => {
          try {
            await new Promise((r) =>
              setTimeout(r, 1000 + Math.random() * 1000),
            );

            const status =
              Math.random() <= 0.2
                ? 'FALHA_PROCESSAMENTO'
                : 'PROCESSADO_SUCESSO';

            this.storageService.set(msg.mensagemId, {
              mensagemId: msg.mensagemId,
              conteudoMensagem: msg.conteudoMensagem,
              status,
            });

            this.producerService.addToQueue('fila.notificacao.status.kaua', {
              mensagemId: msg.mensagemId,
              conteudoMensagem: msg.conteudoMensagem,
            });
          } catch (error) {
            this.logger.error(
              `Erro ao processar mensagem da fila: ${JSON.stringify(msg)}`,
              error,
            );
          }
        },
      );
    } catch (error) {
      this.logger.error('Erro ao iniciar o consumidor da fila', error);
    }
  }
}
