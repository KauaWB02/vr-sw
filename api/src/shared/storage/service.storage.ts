import { Injectable } from '@nestjs/common';
import { NotificationInterface } from 'src/modules/notification/interface/notification.interface';

@Injectable({ scope: undefined })
export class StorageService {
  constructor() {
   console.log('StorageService initialized'); 
  }

  private map = new Map<string, NotificationInterface>();

  set(key: string, value: NotificationInterface) {
    this.map.set(key, value);
  }

  getAll(): NotificationInterface[] {
    return Array.from(this.map.values());
  }

  get(key: string): NotificationInterface | undefined {
    return this.map.get(key);
  }

  has(key: string): boolean {
    return this.map.has(key);
  }

  delete(key: string): boolean {
    return this.map.delete(key);
  }
}
