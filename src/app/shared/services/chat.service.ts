import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ChatMessage } from '../models/chat.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  public messages$ = this.messagesSubject.asObservable();

  private isTypingSubject = new BehaviorSubject<boolean>(false);
  public isTyping$ = this.isTypingSubject.asObservable();

  constructor() {
    // No hay mensaje de bienvenida automático
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  addMessage(message: ChatMessage): void {
    const currentMessages = this.messagesSubject.value;
    this.messagesSubject.next([...currentMessages, message]);
  }

  sendUserMessage(content: string, imageFile?: File): void {
    const userMessage: ChatMessage = {
      id: this.generateId(),
      content: content || 'Imagen enviada',
      timestamp: new Date(),
      sender: 'user',
      messageType: imageFile ? 'image' : 'text',
      imageFile: imageFile,
      imageUrl: imageFile ? URL.createObjectURL(imageFile) : undefined
    };

    this.addMessage(userMessage);
    // No hay respuesta automática del bot
  }

  clearChat(): void {
    this.messagesSubject.next([]);
  }
}
