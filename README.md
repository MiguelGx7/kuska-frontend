# Red de Alimentos Solidarios — Frontend

Interfaz web de la plataforma **Red de Alimentos Solidarios**, construida en **React**, que consume el backend en Django.

## Descripción

Plataforma para facilitar la donación de alimentos: los donantes registran alimentos disponibles, los beneficiarios consultan y solicitan donaciones, y los administradores validan, gestionan y registran las entregas.

## Roles del sistema

| Rol | Puede... |
|---|---|
| Donante | Registrar alimentos disponibles y su cantidad |
| Beneficiario | Consultar donaciones y realizar solicitudes |
| Administrador | Validar donaciones, gestionar solicitudes y registrar entregas |

## Tecnologías

- **React**
- Consumo de API REST (backend en Django)

## Requisitos previos

- Node.js 18+
- npm o yarn
- Backend corriendo (local o desplegado) — ver repo `backend`

## Instalación

```bash
git clone <url-del-repo>
cd <nombre-del-repo>

npm install
```

## Configuración

Crea un archivo `.env` en la raíz del proyecto:

```env
REACT_APP_API_URL=http://localhost:8000/api
```

Ajusta la URL según dónde tengas corriendo el backend.

## Ejecutar en desarrollo

```bash
npm start
```

La app quedará disponible en `http://localhost:3000/`.

## Build de producción

```bash
npm run build
```

## Estructura del proyecto

```
src/
├── components/      # Componentes reutilizables
├── pages/           # Vistas por rol (Donante, Beneficiario, Administrador)
├── services/        # Llamadas al API
├── context/         # Manejo de sesión / autenticación
└── App.jsx
```

## Funcionalidades principales

- Registro e inicio de sesión según rol
- Dashboard con donaciones recibidas, donaciones entregadas, solicitudes pendientes y personas beneficiadas
- Formulario de registro de donaciones (con catálogo de alimentos + opción "Otro")
- Listado y solicitud de donaciones disponibles
- Panel de administración para validar donaciones, gestionar solicitudes y registrar entregas

## Autores

- Miguel Angel Gomez

## Licencia

Este proyecto está bajo la licencia MIT — ver el archivo [LICENSE](LICENSE) para más detalles.