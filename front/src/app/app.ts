import { Component, signal } from '@angular/core';
import { NotificationComponent } from './module/notification/notification';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NotificationComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('front');
}
