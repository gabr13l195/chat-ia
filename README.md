# IaGab - Asistente IA con OpenAI

Este proyecto es una aplicación Angular que integra un asistente de IA de OpenAI para proporcionar respuestas inteligentes a través de chat.

## Características

- 💬 Chat en tiempo real con asistente de IA
- 📷 Soporte para envío de imágenes
- 🎵 Soporte para envío de archivos de audio
- 🎤 Grabación de audio en tiempo real
- 🤖 Integración con OpenAI GPT-4.1-nano
- ⏰ Timestamps en todos los mensajes
- 🎨 Interfaz moderna y responsive

## Configuración

### 1. Variables de Entorno

Antes de ejecutar la aplicación, necesitas configurar las variables de OpenAI:

1. Copia el archivo de ejemplo:
```bash
cp src/environments/environment.example.ts src/environments/environment.ts
```

2. Edita `src/environments/environment.ts` y agrega tus credenciales:
```typescript
export const environment = {
  production: false,
  openai: {
    apiKey: 'TU_API_KEY_AQUI',
    projectId: 'TU_PROJECT_ID_AQUI',
    assistantId: 'TU_ASSISTANT_ID_AQUI',
    baseUrl: 'https://api.openai.com/v1'
  }
};
```

### 2. Configuración de OpenAI

- **API Key**: Tu clave de API de OpenAI
- **Project ID**: ID de tu proyecto de OpenAI
- **Assistant ID**: ID de tu asistente configurado
- **Base URL**: URL base de la API de OpenAI (por defecto: https://api.openai.com/v1)

## Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
ng serve
```

Navega a `http://localhost:4200/` para ver la aplicación.

## Uso

### Envío de Mensajes
- Escribe texto en el campo de entrada
- Presiona Enter o haz clic en el botón de envío

### Envío de Imágenes
- Haz clic en el botón de cámara 📷
- O arrastra y suelta una imagen en el área de chat
- Formatos soportados: JPEG, PNG, GIF, WebP
- Tamaño máximo: 5MB

### Envío de Audio
- Haz clic en el botón de música 🎵 para seleccionar un archivo
- O usa el botón de micrófono 🎤 para grabar audio
- Formatos soportados: WAV, MP3, OGG, M4A, WebM
- Tamaño máximo: 10MB

## Estructura del Proyecto

```
src/
├── app/
│   ├── components/
│   │   └── chat/           # Componentes del chat
│   ├── pages/              # Páginas de la aplicación
│   ├── shared/
│   │   ├── models/         # Modelos de datos
│   │   └── services/       # Servicios (Chat, OpenAI)
│   └── environments/       # Configuración de entornos
```

## Servicios Principales

- **ChatService**: Maneja la lógica del chat y mensajes
- **OpenAIService**: Gestiona la comunicación con la API de OpenAI
- **MessageComponent**: Renderiza los mensajes del chat
- **InputComponent**: Maneja la entrada de texto, imágenes y audio

## Seguridad

⚠️ **Importante**: Las claves de API están en el archivo de entorno de desarrollo. Para producción:

1. Nunca subas las claves reales a GitHub
2. Usa variables de entorno del servidor
3. Considera usar un backend proxy para las llamadas a OpenAI

## Desarrollo

```bash
# Generar un nuevo componente
ng generate component component-name

# Ejecutar tests
ng test

# Build de producción
ng build --configuration production
```

## Tecnologías Utilizadas

- Angular 19.2
- TypeScript
- OpenAI API
- RxJS
- CSS3

## Recursos Adicionales

- [Angular CLI Overview](https://angular.dev/tools/cli)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Angular Documentation](https://angular.dev/)
