import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { interval, Subscription } from 'rxjs';
import { NotificationService } from './notification.service';
import { HttpClientModule } from '@angular/common/http';
import { MatTooltipModule } from '@angular/material/tooltip';

interface Notification {
  mensagemId: string;
  conteudoMensagem: string;
  status: 'PROCESSADO_SUCESSO' | 'FALHA_PROCESSAMENTO' | 'PROCESSANDO';
}

@Component({
  selector: 'app-notification',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatListModule,
    MatDividerModule,
    MatIconModule,
    MatTooltipModule,
    HttpClientModule,
  ],
  providers: [NotificationService],
  templateUrl: './notification.html',
  styleUrls: ['./notification.scss'],
})
export class NotificationComponent {
  public message: string = '';
  public notifications: Notification[] = [];

  public pollingSubscription: Subscription;

  constructor(private readonly notificationService: NotificationService) {
    this.pollingSubscription = interval(3000).subscribe(() => this.getAll());
  }

  ngOnDestroy() {
    this.pollingSubscription?.unsubscribe();
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'PROCESSADO_SUCESSO':
        return 'Processado com Sucesso';
      case 'FALHA_PROCESSAMENTO':
        return 'Falha no Processamento';
      case 'PROCESSANDO':
        return 'Processando';
      default:
        return '';
    }
  }

  sendMessage() {
    this.notificationService.createNotification(this.message).subscribe({
      next: (response) => {
        this.clearInput();
        this.getAll();
      },
      error: (error) => {
        console.error('Error sending notification:', error);
      },
    });
  }

  clearInput() {
    this.message = '';
  }

  getAll() {
    this.notificationService.getAllNotifications().subscribe((data) => {
      this.notifications = data;
    });
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      pending: 'Pendente',
      success: 'Sucesso',
      error: 'Erro',
    };
    return statusMap[status] || status;
  }

  clearNotifications() {
    this.notifications = [];
  }
}
