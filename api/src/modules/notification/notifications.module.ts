import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { SharedModule } from 'src/shared/shared.module';
import { ProducerService } from '../rabbitmq/produce.service';

@Module({
  imports: [SharedModule],
  providers: [NotificationsService, ProducerService],
  controllers: [NotificationsController],
})
export class NotificationModule {}
