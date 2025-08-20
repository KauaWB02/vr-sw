import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationInterface } from './interface/notification.interface';
import type { Response } from 'express';
import { CreateNotificationDto } from './dto/notification.dto';

@Controller('notificar')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  async createNotification(
    @Body() body: CreateNotificationDto,
    @Res() res: Response,
  ) {
    const notification =
      await this.notificationsService.createNotification(body);
    return res.status(202).json({
      message: notification.message,
      mensagem: notification.mensagem,
    });
  }

  @Get()
  getAllNotifications(): Promise<NotificationInterface[]> {
    return this.notificationsService.getAllNotifications();
  }
}
