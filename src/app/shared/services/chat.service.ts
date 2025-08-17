import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ChatMessage } from '../models/chat.model';
import { OpenAIService } from './openai.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  public messages$ = this.messagesSubject.asObservable();

  private isTypingSubject = new BehaviorSubject<boolean>(false);
  public isTyping$ = this.isTypingSubject.asObservable();

  constructor(private openaiService: OpenAIService) {
    // No hay mensaje de bienvenida automático
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  addMessage(message: ChatMessage): void {
    const currentMessages = this.messagesSubject.value;
    this.messagesSubject.next([...currentMessages, message]);
  }

  sendUserMessage(content: string, imageFile?: File, audioFile?: File): void {
    const userMessage: ChatMessage = {
      id: this.generateId(),
      content: content || (imageFile ? 'Imagen enviada' : audioFile ? 'Audio enviado' : ''),
      timestamp: new Date(),
      sender: 'user',
      messageType: imageFile ? 'image' : audioFile ? 'audio' : 'text',
      imageFile: imageFile,
      imageUrl: imageFile ? URL.createObjectURL(imageFile) : undefined,
      audioFile: audioFile,
      audioUrl: audioFile ? URL.createObjectURL(audioFile) : undefined
    };

    this.addMessage(userMessage);

    // Mostrar indicador de escritura
    this.isTypingSubject.next(true);

    // Enviar mensaje a OpenAI y obtener respuesta
    this.openaiService.sendMessage(content, imageFile, audioFile).subscribe({
      next: (response) => {
        this.isTypingSubject.next(false);
        
        const botMessage: ChatMessage = {
          id: this.generateId(),
          content: response,
          timestamp: new Date(),
          sender: 'bot',
          messageType: 'text'
        };

        this.addMessage(botMessage);
      },
      error: (error) => {
        this.isTypingSubject.next(false);
        console.error('Error getting OpenAI response:', error);
        
        const errorMessage: ChatMessage = {
          id: this.generateId(),
          content: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.',
          timestamp: new Date(),
          sender: 'bot',
          messageType: 'text',
          error: error.message
        };

        this.addMessage(errorMessage);
      }
    });
  }

  clearChat(): void {
    this.messagesSubject.next([]);
    this.openaiService.clearThread();
  }
}
