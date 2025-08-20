import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';

const mockNotificationsService = {
  createNotification: jest.fn().mockResolvedValue({
    message: 'Notification created successfully',
    mensagem: {
      mensagemId: 'uuid-123',
      conteudoMensagem: 'Uma nova notificação',
      status: 'PROCESSANDO',
    },
  }),
  getAllNotifications: jest.fn(),
};

describe('NotificationsController', () => {
  let controller: NotificationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationsController],
      providers: [
        {
          provide: NotificationsService,
          useValue: mockNotificationsService,
        },
      ],
    }).compile();

    controller = module.get<NotificationsController>(NotificationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call the service and return status 202 with the correct body', async () => {
    const dto = {
      mensagemId: 'uuid-123',
      conteudoMensagem: 'Uma nova notificação',
    };

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await controller.createNotification(dto, mockResponse as any);

    expect(mockNotificationsService.createNotification).toHaveBeenCalledWith(
      dto,
    );

    expect(mockResponse.status).toHaveBeenCalledWith(202);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Notification created successfully',
      mensagem: expect.any(Object),
    });
  });
});
