# Kumora · Panel de administración

Frontend web de **Kumora (Red de Alimentos Solidarios)**. Es el panel desde donde el **Administrador** valida donaciones, gestiona solicitudes, usuarios, sanciones y categorías, y revisa el resumen de la plataforma.

Donantes y beneficiarios no usan este panel: ellos usan la app de Kumora. Si alguien con otro rol intenta entrar aquí, el login lo rechaza.

- **Frontend:** Vite + React 19 (JavaScript, `.jsx`), CSS con variables (tema claro y oscuro)
- **Backend:** Django REST con JWT → `https://kuska-backend-production.up.railway.app/api`

## Requisitos

- Node.js 20 o superior
- npm

## Instalación

```bash
npm install
cp .env.example .env   # en Windows (PowerShell): Copy-Item .env.example .env
npm run dev
```

La app queda en `http://localhost:5173`.

### Variables de entorno

| Variable       | Descripción                         |
| -------------- | ----------------------------------- |
| `VITE_API_URL` | URL base de la API, sin `/` al final |

### Scripts

| Comando           | Qué hace                                |
| ----------------- | --------------------------------------- |
| `npm run dev`     | Servidor de desarrollo                  |
| `npm run build`   | Compila para producción en `dist/`      |
| `npm run preview` | Sirve la versión compilada              |
| `npm run lint`    | Revisa el código con ESLint             |

## Estructura de carpetas

```
public/
  favicon.svg            Símbolo de Kumora
src/
  api/
    cliente.js           Instancia de axios, tokens y refresh automático
    errores.js           obtenerMensajeError(error): texto legible de cualquier error de la API
    auth.js              login(correo, contrasena)
    *.js                 Un archivo por recurso (donaciones, solicitudes, usuarios…)
  auth/
    SesionContext.jsx    SesionProvider: usuario actual, iniciar y cerrar sesión
    useSesion.js         Hook para leer la sesión
    RutaAdmin.jsx        Protege las rutas privadas
    contexto.js          El contexto de React de la sesión
    usuario.js           ROL_ADMIN y nombreCompleto(usuario)
  components/            Componentes reutilizables
  layout/                Estructura del panel (barra lateral, encabezado)
  pages/                 Una página por ruta
  styles/
    tokens.css           Colores, radios y fuente (claro y oscuro)
    base.css             Reset y estilos globales
  tema.js                Leer, guardar y aplicar el tema
  App.jsx                Rutas
  main.jsx               Punto de entrada
```

## Sesión y autenticación

- El login (`POST auth/login/`) devuelve `access`, `refresh` y `usuario`. Solo se guardan si `usuario.rol` es `"Administrador"`.
- Los tokens y el usuario se guardan en `localStorage`.
- Si una petición responde 401, el cliente renueva los tokens una sola vez con `POST auth/refresh/`, y las peticiones que fallen al mismo tiempo esperan ese mismo refresh. Si el refresh falla, se borra la sesión y se redirige a `/sesion-cerrada`.
- Cerrar sesión borra los tokens y lleva a `/login`; el backend no tiene endpoint de logout.

## Rutas

| Tipo       | Rutas |
| ---------- | ----- |
| Públicas   | `/login`, `/recuperar`, `/sesion-cerrada` |
| Protegidas | `/`, `/donaciones`, `/donaciones/:id`, `/solicitudes`, `/solicitudes/:id`, `/novedades`, `/usuarios`, `/usuarios/:id`, `/sanciones`, `/categorias`, `/configuracion`, `/notificaciones` |
| Errores    | `/sin-permiso` (403), `/error` (500), cualquier otra (404) |

## Tema

El tema se aplica con `data-theme="light" | "dark"` en `<html>` y se guarda en `localStorage`. Si no hay nada guardado, se usa la preferencia del sistema (`prefers-color-scheme`).
