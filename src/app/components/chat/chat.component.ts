import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatService } from '../../shared/services/chat.service';
import { ChatMessage } from '../../shared/models/chat.model';
import { MessageComponent } from './message/message.component';
import { InputComponent } from './input/input.component';
import { TypingComponent } from './typing/typing.component';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, MessageComponent, InputComponent, TypingComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  
  messages: ChatMessage[] = [];
  isTyping = false;

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.chatService.messages$.subscribe(messages => {
      this.messages = messages;
    });

    this.chatService.isTyping$.subscribe(isTyping => {
      this.isTyping = isTyping;
    });
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  onMessageSent(message: string): void {
    this.chatService.sendUserMessage(message);
  }

  onImageSent(imageFile: File): void {
    this.chatService.sendUserMessage('', imageFile);
  }

  onAudioSent(audioFile: File): void {
    this.chatService.sendUserMessage('', undefined, audioFile);
  }

  clearChat(): void {
    this.chatService.clearChat();
  }

  private scrollToBottom(): void {
    try {
      this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
    } catch (err) {
      // Handle error silently
    }
  }
}
