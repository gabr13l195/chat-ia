export interface ChatMessage {
  id: string;
  content: string;
  timestamp: Date;
  sender: 'user' | 'bot';
  messageType: 'text' | 'image' | 'audio';
  imageUrl?: string;
  imageFile?: File;
  audioUrl?: string;
  audioFile?: File;
  isProcessing?: boolean;
  error?: string;
}

export interface User {
  id: string;
  name: string;
  avatar?: string;
}

export interface OpenAIMessage {
  role: 'user' | 'assistant';
  content: string | Array<{
    type: 'text' | 'image_url' | 'audio';
    text?: string;
    image_url?: {
      url: string;
    };
    audio?: {
      url: string;
    };
  }>;
}

export interface OpenAIThread {
  id: string;
  object: string;
  created_at: number;
  metadata: any;
}

export interface OpenAIRun {
  id: string;
  object: string;
  created_at: number;
  thread_id: string;
  assistant_id: string;
  status: string;
  required_action?: any;
  last_error?: any;
}
