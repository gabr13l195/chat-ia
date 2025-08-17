import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.css'
})
export class InputComponent {
  @Output() messageSent = new EventEmitter<string>();
  @Output() imageSent = new EventEmitter<File>();
  @Output() audioSent = new EventEmitter<File>();

  messageText = '';
  selectedImage: File | null = null;
  selectedAudio: File | null = null;
  imagePreview: string | null = null;
  audioPreview: string | null = null;
  isDragging = false;
  isRecording = false;
  mediaRecorder: MediaRecorder | null = null;
  audioChunks: Blob[] = [];

  onSendMessage(): void {
    if (this.messageText.trim() || this.selectedImage || this.selectedAudio) {
      if (this.selectedImage) {
        this.imageSent.emit(this.selectedImage);
      }
      if (this.selectedAudio) {
        this.audioSent.emit(this.selectedAudio);
      }
      if (this.messageText.trim()) {
        this.messageSent.emit(this.messageText.trim());
      }
      this.clearInput();
    }
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.onSendMessage();
    }
  }

  onFileSelected(event: any, type: 'image' | 'audio'): void {
    const file = event.target.files[0];
    if (file) {
      if (type === 'image' && this.isValidImage(file)) {
        this.selectedImage = file;
        this.createImagePreview(file);
      } else if (type === 'audio' && this.isValidAudio(file)) {
        this.selectedAudio = file;
        this.createAudioPreview(file);
      }
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
    
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (this.isValidImage(file)) {
        this.selectedImage = file;
        this.createImagePreview(file);
      } else if (this.isValidAudio(file)) {
        this.selectedAudio = file;
        this.createAudioPreview(file);
      }
    }
  }

  startRecording(): void {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          this.mediaRecorder = new MediaRecorder(stream);
          this.audioChunks = [];
          
          this.mediaRecorder.ondataavailable = (event) => {
            this.audioChunks.push(event.data);
          };
          
          this.mediaRecorder.onstop = () => {
            const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
            const audioFile = new File([audioBlob], 'recording.wav', { type: 'audio/wav' });
            this.selectedAudio = audioFile;
            this.createAudioPreview(audioFile);
            this.isRecording = false;
          };
          
          this.mediaRecorder.start();
          this.isRecording = true;
        })
        .catch(error => {
          console.error('Error accessing microphone:', error);
          alert('No se pudo acceder al micrófono. Por favor, verifica los permisos.');
        });
    } else {
      alert('Tu navegador no soporta grabación de audio.');
    }
  }

  stopRecording(): void {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
      this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
  }

  private isValidImage(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!validTypes.includes(file.type)) {
      alert('Por favor selecciona una imagen válida (JPEG, PNG, GIF, WebP)');
      return false;
    }
    
    if (file.size > maxSize) {
      alert('La imagen es demasiado grande. Máximo 5MB permitido.');
      return false;
    }
    
    return true;
  }

  private isValidAudio(file: File): boolean {
    const validTypes = ['audio/wav', 'audio/mp3', 'audio/ogg', 'audio/m4a', 'audio/webm'];
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    if (!validTypes.includes(file.type)) {
      alert('Por favor selecciona un archivo de audio válido (WAV, MP3, OGG, M4A, WebM)');
      return false;
    }
    
    if (file.size > maxSize) {
      alert('El archivo de audio es demasiado grande. Máximo 10MB permitido.');
      return false;
    }
    
    return true;
  }

  private createImagePreview(file: File): void {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imagePreview = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  private createAudioPreview(file: File): void {
    this.audioPreview = URL.createObjectURL(file);
  }

  removeImage(): void {
    this.selectedImage = null;
    this.imagePreview = null;
  }

  removeAudio(): void {
    this.selectedAudio = null;
    this.audioPreview = null;
  }

  private clearInput(): void {
    this.messageText = '';
    this.selectedImage = null;
    this.selectedAudio = null;
    this.imagePreview = null;
    this.audioPreview = null;
  }
}
