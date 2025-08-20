import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { NotificationInterface } from './interface/notification.interface';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private API_URL = 'http://localhost:3333/api/notificar';

  constructor(private http: HttpClient) {}

  createNotification(message: string): Observable<{ mensagem: NotificationInterface }> {
    const messageId = uuidv4();
    return this.http.post<{ mensagem: NotificationInterface }>(this.API_URL, {
      mensagemId: messageId,
      conteudoMensagem: message,
    });
  }

  getAllNotifications(): Observable<NotificationInterface[]> {
    return this.http.get<NotificationInterface[]>(this.API_URL);
  }
}
