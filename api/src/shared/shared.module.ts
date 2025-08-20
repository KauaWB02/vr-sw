import { Global, Module } from '@nestjs/common';
import { StorageService } from './storage/service.storage';
@Global()
@Module({
  imports: [],
  exports: [StorageService],
  providers: [StorageService],
})
export class SharedModule {}
