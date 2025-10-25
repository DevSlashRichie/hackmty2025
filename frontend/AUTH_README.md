# Autenticación con Google OAuth

## 📋 Resumen

Se han creado páginas de Login y Signup con autenticación de Google, siguiendo el sistema de diseño de Banorte. 

### Páginas creadas:
- `/login` - Login con botón oficial de Google
- `/signup` - Signup con botón oficial de Google  
- `/login-alt` - Login con botón personalizado (estilo Banorte)
- `/signup-alt` - Signup con botón personalizado (estilo Banorte)

### Componentes creados:
- `src/components/ui/google-auth-button.tsx` - Botón personalizado de Google

## 🚀 Vista previa

El servidor está corriendo en: **http://localhost:5175/**

Puedes visitar:
- http://localhost:5175/ (página principal con enlaces)
- http://localhost:5175/login
- http://localhost:5175/signup
- http://localhost:5175/login-alt (versión con botón personalizado)
- http://localhost:5175/signup-alt (versión con botón personalizado)

## ⚙️ Configuración

### 1. Obtén tu Google Client ID

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Ve a **APIs & Services** > **Credentials**
4. Haz clic en **Create Credentials** > **OAuth client ID**
5. Configura el OAuth consent screen si aún no lo has hecho
6. Selecciona **Web application** como tipo
7. En **Authorized JavaScript origins**, agrega:
   - `http://localhost:5173` (para desarrollo)
   - Tu dominio de producción
8. En **Authorized redirect URIs**, agrega:
   - `http://localhost:5173` (para desarrollo)
   - Tu dominio de producción
9. Copia el **Client ID** generado

### 2. Configura las variables de entorno

1. Crea un archivo `.env` en la raíz de `frontend/`:
   ```bash
   cp .env.example .env
   ```

2. Reemplaza `your-google-client-id.apps.googleusercontent.com` con tu Client ID real:
   ```
   VITE_GOOGLE_CLIENT_ID=tu-client-id-real.apps.googleusercontent.com
   ```

### 3. Actualiza main.tsx

En `src/main.tsx`, reemplaza la línea:
```typescript
const GOOGLE_CLIENT_ID = "TU_GOOGLE_CLIENT_ID.apps.googleusercontent.com";
```

Con:
```typescript
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
```

### 4. Rutas disponibles

- `/login` - Página de inicio de sesión con Google
- `/signup` - Página de registro con Google

## Uso

### Iniciar sesión
Visita `http://localhost:5173/login` para ver la página de inicio de sesión.

### Registrarse
Visita `http://localhost:5173/signup` para ver la página de registro.

## Manejo de la autenticación

Actualmente, los callbacks de éxito están configurados para imprimir en consola. Para implementar la autenticación completa:

1. En `src/routes/login.tsx` y `src/routes/signup.tsx`, modifica las funciones `handleGoogleSuccess`:

```typescript
const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
  const token = credentialResponse.credential;
  
  try {
    const response = await fetch('TU_BACKEND_URL/api/auth/google', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });
    
    const data = await response.json();
    
    // Guarda el token de autenticación
    localStorage.setItem('authToken', data.authToken);
    
    // Redirige al dashboard o página principal
    window.location.href = '/dashboard';
  } catch (error) {
    console.error('Error de autenticación:', error);
  }
};
```

## Características

- ✅ Autenticación con Google OAuth 2.0
- ✅ Diseño siguiendo el sistema de diseño Banorte
- ✅ One Tap login para mejor UX
- ✅ Responsive design
- ✅ Manejo de errores
- ✅ Páginas de login y signup separadas

## Colores utilizados (Sistema Banorte)

- Rojo principal: `#EB0029`
- Gris texto: `#323E48`
- Gris label: `#5B6670`
- Gris fondo: `#F6F6F6`
- Color positivo: `#6CC04A`
- Color disabled: `#CFD2D3`

## Próximos pasos

1. Configurar el backend para verificar los tokens de Google
2. Implementar el manejo de sesiones
3. Agregar rutas protegidas
4. Implementar logout
