import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatMessage } from '../../../shared/models/chat.model';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class MessageComponent {
  @Input() message!: ChatMessage;

  get isUser(): boolean {
    return this.message.sender === 'user';
  }

  get isBot(): boolean {
    return this.message.sender === 'bot';
  }

  get isImage(): boolean {
    return this.message.messageType === 'image';
  }

  get formattedTime(): string {
    return this.message.timestamp.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
