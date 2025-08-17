import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { OpenAIMessage, OpenAIThread, OpenAIRun } from '../models/chat.model';

@Injectable({
  providedIn: 'root'
})
export class OpenAIService {
  private threadId: string | null = null;
  private readonly headers = new HttpHeaders({
    'Authorization': `Bearer ${environment.openai.apiKey}`,
    'OpenAI-Beta': 'assistants=v2',
    'Content-Type': 'application/json'
  });

  constructor(private http: HttpClient) {}

  // Crear o recuperar thread
  private getOrCreateThread(): Observable<string> {
    if (this.threadId) {
      return new Observable(observer => observer.next(this.threadId!));
    }

    return this.http.post<OpenAIThread>(
      `${environment.openai.baseUrl}/threads`,
      {},
      { headers: this.headers }
    ).pipe(
      map(thread => {
        this.threadId = thread.id;
        return thread.id;
      }),
      catchError(error => {
        console.error('Error creating thread:', error);
        return throwError(() => new Error('Failed to create thread'));
      })
    );
  }

  // Enviar mensaje al asistente
  sendMessage(content: string, imageFile?: File, audioFile?: File): Observable<string> {
    return this.getOrCreateThread().pipe(
      switchMap(threadId => {
        const messageContent: any[] = [];
        
        if (content.trim()) {
          messageContent.push({
            type: 'text',
            text: content
          });
        }

        // Para archivos, usamos URLs temporales en lugar de base64
        // ya que la API de OpenAI no soporta data URLs directamente
        if (imageFile) {
          messageContent.push({
            type: 'text',
            text: `[Imagen enviada: ${imageFile.name}]`
          });
        }

        if (audioFile) {
          messageContent.push({
            type: 'text',
            text: `[Audio enviado: ${audioFile.name}]`
          });
        }

        const messageData = {
          role: 'user',
          content: messageContent
        };

        return this.http.post<any>(
          `${environment.openai.baseUrl}/threads/${threadId}/messages`,
          messageData,
          { headers: this.headers }
        ).pipe(
          switchMap(() => this.runAssistant(threadId))
        );
      })
    );
  }

  // Ejecutar el asistente
  private runAssistant(threadId: string): Observable<string> {
    const runData = {
      assistant_id: environment.openai.assistantId
    };

    return this.http.post<OpenAIRun>(
      `${environment.openai.baseUrl}/threads/${threadId}/runs`,
      runData,
      { headers: this.headers }
    ).pipe(
      switchMap(run => this.waitForRunCompletion(threadId, run.id))
    );
  }

  // Esperar a que el asistente complete su respuesta
  private waitForRunCompletion(threadId: string, runId: string): Observable<string> {
    return new Observable(observer => {
      const checkStatus = () => {
        this.http.get<OpenAIRun>(
          `${environment.openai.baseUrl}/threads/${threadId}/runs/${runId}`,
          { headers: this.headers }
        ).subscribe({
          next: (run) => {
            if (run.status === 'completed') {
              this.getAssistantResponse(threadId).subscribe({
                next: (response) => observer.next(response),
                error: (error) => observer.error(error),
                complete: () => observer.complete()
              });
            } else if (run.status === 'failed' || run.status === 'cancelled') {
              observer.error(new Error(`Run ${run.status}: ${run.last_error?.message || 'Unknown error'}`));
            } else {
              // Esperar un poco antes de verificar nuevamente
              setTimeout(checkStatus, 1000);
            }
          },
          error: (error) => observer.error(error)
        });
      };

      checkStatus();
    });
  }

  // Obtener la respuesta del asistente
  private getAssistantResponse(threadId: string): Observable<string> {
    return this.http.get<any>(
      `${environment.openai.baseUrl}/threads/${threadId}/messages?limit=1`,
      { headers: this.headers }
    ).pipe(
      map(response => {
        const messages = response.data;
        if (messages && messages.length > 0) {
          const message = messages[0];
          if (message.content && message.content.length > 0) {
            const content = message.content[0];
            if (content.type === 'text') {
              return content.text.value;
            }
          }
        }
        return 'No se pudo obtener una respuesta del asistente.';
      }),
      catchError(error => {
        console.error('Error getting assistant response:', error);
        return throwError(() => new Error('Failed to get assistant response'));
      })
    );
  }

  // Limpiar thread
  clearThread(): void {
    this.threadId = null;
  }
}
