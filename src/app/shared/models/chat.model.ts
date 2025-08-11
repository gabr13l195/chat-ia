export interface ChatMessage {
  id: string;
  content: string;
  timestamp: Date;
  sender: 'user' | 'bot';
  messageType: 'text' | 'image';
  imageUrl?: string;
  imageFile?: File;
}

export interface User {
  id: string;
  name: string;
  avatar?: string;
}
