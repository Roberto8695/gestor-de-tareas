# Gestor de Tareas - Documentación Técnica y Arquitectura

Este proyecto es una aplicación de gestión de tareas dividida en dos partes: un backend en Node.js proveiendo una API REST, y un frontend construido con Next.js estilizado mediante Tailwind CSS.

A continuación, se detalla una revisión técnica del proyecto:

## 1. Arquitectura del Proyecto Base
El proyecto sigue una arquitectura de **Cliente-Servidor (desacoplada)**:
- **Client-Side Rendering (Frontend)**: Utiliza Next.js en su modalidad estática/cliente (con `'use client'`), la cual consume y renderiza dinámicamente la información directamente del navegador del usuario.
- **RESTful API (Backend)**: El servidor proporciona endpoints claros bajo el patrón REST (GET, POST, PUT, DELETE) gestionados a través de Express.js.
- **Arquitectura en Capas (Backend)**: El backend está dividido lógicamente en capas de Responsabilidad Única (Rutas -> Controladores -> Servicios -> Base de Datos). Esto aísla el comportamiento y facilita encontrar errores.

## 2. Módulos y Componentes Identificados

### Frontend (Next.js)
El frontend actualmente tiene un enfoque "monolítico" a nivel de página (todo vive en `page.tsx`):
- **Componente Principal (`page.tsx`)**: Gestiona tres grandes responsabilidades: 
  1. El estado global e interfaz (Modal, variables de entrada).
  2. Lógica de negocio/fetch (Llamadas API al backend).
  3. Renderizado de la lista de tareas ("Padres/con progreso" e "Hijos/completables").
- **Componentes React (Íconos)**: Elementos de diseño inyectados (`TrashIcon`, `CheckIcon`) implementados como Stateless Functional Components de SVG puros.
- **Global Layout (`layout.tsx`) & CSS (`globals.css`)**: Gestiona la inyección y configuración base de todo Tailwind CSS.

### Backend (Node.js/Express)
La lógica de datos está modularizada correctamente:
- `app.js`: Configuración principal de Express, montaje de rutas y arranque del servidor.
- `routes/taskRoutes.js`: Mapea todos los verbos HTTP hacia funciones específicas.
- `controllers/taskController.js`: Valida los requests y serializa las respuestas HTTP. Acopla el protocolo HTTP con la lógica de negocio.
- `services/taskService.js`: Modulo que ejerce las operaciones crudas (Queries) asíncronas sobre la base de datos local abstraídas en promesas.
- `config/db.js`: Conexión cliente persistente e inicialización estática de tablas con SQLite3.

## 3. Mejoras Arquitectónicas Propuestas (Mantenibilidad)

Para llevar este proyecto a un estándar de grado de producción y facilitar su mantenimiento a largo plazo, propondría lo siguiente:

### Mejoras en Frontend:
1. **Componentización de UI**: Dividir `page.tsx` en pequeños componentes independientes (ej. `TaskCard.tsx`, `SubTaskItem.tsx`, `Header.tsx`, `CreateTaskModal.tsx`). Esto reducirá sustancialmente las líneas de código del punto de entrada y facilitará hacer tests.
2. **Custom Hooks para Lógica API**: Abstraer todo el código de peticiones HTTP en un hook llamado `useTasks()` o utilizar librerías de vanguardia como **React Query (TanStack Query)** o **SWR**. Esto maneja la caché, el loading state, re-tries y mantiene la UI limpia de `fetch` crudos.
3. **Manejo Centralizado de Entornos**: El URL `http://localhost:5000` está quemado en el archivo. Crear variable `.env.local` con `NEXT_PUBLIC_API_URL` prevendría errores críticos a la hora de compilar y despegar la app a producción.
4. **Tipado Estricto Central**: Mover el `type Task` a una carpeta de utilidades `/types` para asegurar que el tipado esté disponible para otros componentes libremente.

### Mejoras en Backend:
1. **Validación de Datos por Middleware**: Utilizar una librería como `Zod` o `Joi` interceptando las peticiones antes del controlador. Así validamos de un inicio si `progress` es un número estricto entre 0 a 100 sin contaminar el código principal.
2. **Migración a un ORM**: Cambiar las queries locales directas hechas en `sqlite3` e implementar  **Prisma ORM** u otro Query builder (TypeORM). Esto provee seguridad frente a inyecciones SQL y un modelo de datos tipado auto-mantenible.
3. **Módulo Centralizado de Errores (Error Handler)**: Remover el bloque repetitivo `try...catch` de todos los controladores creando un "Error Handler" middleware genérico al final del archivo `app.js`.
4. **Implementar Configuración de Entornos (Env)**: Manejar `PORT` de la app y la `Ruta del Path de la Base de Datos` consumiendo un `.env` junto con la librería `dotenv`.
