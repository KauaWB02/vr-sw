import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';
import { StorageService } from 'src/shared/storage/service.storage';
import { ProducerService } from '../rabbitmq/produce.service';
import { NotificationInterface } from './interface/notification.interface';

const mockProducerService = {
  addToQueue: jest.fn(),
  init: jest.fn().mockResolvedValue(undefined),
  consumeFromQueue: jest.fn(),
};

const mockStorageService = {
  set: jest.fn(),
  get: jest.fn(),
  getAll: jest.fn(),
};

describe('NotificationsService', () => {
  let service: NotificationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        {
          provide: StorageService,
          useValue: mockStorageService,
        },
        {
          provide: ProducerService,
          useValue: mockProducerService,
        },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createNotification', () => {
    it('deve chamar o ProducerService.addToQueue com os parâmetros corretos', async () => {
      const body = {
        mensagemId: 'uuid-12345',
        conteudoMensagem: 'Esta é uma mensagem de teste!',
      };

      const expectedPayload: NotificationInterface = {
        mensagemId: body.mensagemId,
        conteudoMensagem: body.conteudoMensagem,
        status: 'PROCESSANDO',
      };

      mockStorageService.get.mockReturnValue(expectedPayload);

      const result = await service.createNotification(body);

      expect(mockProducerService.addToQueue).toHaveBeenCalledTimes(1);

      expect(mockProducerService.addToQueue).toHaveBeenCalledWith(
        'fila.notificacao.entrada.kaua',
        expectedPayload,
      );

      expect(mockStorageService.set).toHaveBeenCalledTimes(1);
      expect(mockStorageService.set).toHaveBeenCalledWith(
        body.mensagemId,
        expectedPayload,
      );

      expect(result).toEqual({
        message: 'Notification created successfully',
        mensagem: expectedPayload,
      });
    });
  });
});
