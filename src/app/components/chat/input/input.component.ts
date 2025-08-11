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

  messageText = '';
  selectedImage: File | null = null;
  imagePreview: string | null = null;
  isDragging = false;

  onSendMessage(): void {
    if (this.messageText.trim() || this.selectedImage) {
      if (this.selectedImage) {
        this.imageSent.emit(this.selectedImage);
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

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && this.isValidImage(file)) {
      this.selectedImage = file;
      this.createImagePreview(file);
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
      }
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

  private createImagePreview(file: File): void {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imagePreview = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  removeImage(): void {
    this.selectedImage = null;
    this.imagePreview = null;
  }

  private clearInput(): void {
    this.messageText = '';
    this.selectedImage = null;
    this.imagePreview = null;
  }
}
