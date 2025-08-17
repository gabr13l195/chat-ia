# Guía de Seguridad - IaGab

## Protección de API Keys

### ⚠️ ADVERTENCIA IMPORTANTE

**NUNCA subas tus claves de API reales a GitHub o cualquier repositorio público.**

### Configuración Segura

#### 1. Desarrollo Local
- Usa el archivo `src/environments/environment.ts` solo para desarrollo local
- Este archivo está en `.gitignore` para evitar que se suba accidentalmente
- Copia `environment.example.ts` y configura tus credenciales

#### 2. Producción
Para entornos de producción, usa variables de entorno del servidor:

```bash
# Variables de entorno del servidor
export OPENAI_API_KEY="tu_api_key_real"
export OPENAI_PROJECT_ID="tu_project_id"
export OPENAI_ASSISTANT_ID="tu_assistant_id"
```

#### 3. Backend Proxy (Recomendado)
La forma más segura es crear un backend que maneje las llamadas a OpenAI:

```typescript
// En lugar de llamar directamente a OpenAI desde el frontend
// Envía la petición a tu backend
this.http.post('/api/chat', { message: content })
```

### Mejores Prácticas

1. **Rotación de Claves**: Cambia tus API keys regularmente
2. **Límites de Uso**: Configura límites de rate limiting en OpenAI
3. **Monitoreo**: Revisa regularmente el uso de tu API
4. **Auditoría**: Mantén logs de todas las llamadas a la API

### Configuración del .gitignore

El archivo `.gitignore` ya incluye:
- Archivos de entorno (`.env*`)
- Archivos de configuración con credenciales
- Archivos temporales y de build

### Verificación de Seguridad

Antes de hacer commit, verifica que:
- [ ] No hay API keys en el código
- [ ] Los archivos de entorno están en `.gitignore`
- [ ] Solo hay código público en el repositorio

### Recursos Adicionales

- [OpenAI Security Best Practices](https://platform.openai.com/docs/security-best-practices)
- [Angular Security Guide](https://angular.dev/guide/security)
- [OWASP Security Guidelines](https://owasp.org/www-project-top-ten/)
